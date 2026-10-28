import { useCallback, useEffect, useRef, useState, useId } from "react";
import type {
  ComposeReply,
  Feedback,
  Language,
  Lesson,
  Player,
  Post,
  Status,
  StudioSession,
} from "../lib/types";
import { say } from "../lib/types";
import { ApiError } from "../lib/api";
import {
  createLessonPlayer,
  galleryLessons,
  gallerySourceNote,
  studioWalkthrough,
  validateLesson,
} from "../lib/shared";
import { prepareImage } from "../lib/image";
import { Gallery } from "./Gallery";
import { DraftReview } from "./DraftReview";
import { LessonPlayer } from "./LessonPlayer";
import { ProviderConsole } from "./ProviderConsole";
export function Studio({
  language,
  authenticated,
  status: providerStatus,
  post,
  visible,
  view,
  lessonId,
  starter,
  onBusy,
  onRequestAccess,
}: {
  language: Language;
  authenticated: boolean;
  status: Status | null;
  post: Post;
  visible: boolean;
  view: "studio" | "create";
  lessonId: string | null;
  starter: number;
  onBusy: (busy: boolean) => void;
  onRequestAccess: () => void;
}) {
  const formId = useId();
  const [topic, setTopic] = useState(""),
    [creation, setCreation] = useState("generated"),
    [modelId, setModelId] = useState(""),
    [draft, setDraft] = useState<Lesson | null>(null),
    [revisionKey, setRevisionKey] = useState(0),
    [reviewed, setReviewed] = useState(false),
    [player, setPlayer] = useState<Player | null>(null),
    [presenting, setPresenting] = useState(false),
    [busy, setBusy] = useState(false),
    [remaining, setRemaining] = useState(8),
    [message, setMessage] = useState(""),
    [feedback, setFeedback] = useState<Feedback | null>(null),
    [image, setImage] = useState<{ name: string; dataUrl: string } | null>(
      null,
    ),
    [imageLoading, setImageLoading] = useState(false),
    [sessionId, setSessionId] = useState<string | null>(null),
    [source, setSource] = useState<string | null>(null);
  const epoch = useRef(0),
    imageEpoch = useRef(0),
    session = useRef<StudioSession | null>(null),
    alive = useRef(true),
    pending = useRef<AbortController | null>(null),
    busyRef = useRef(false),
    languageRef = useRef(language),
    postRef = useRef(post);
  postRef.current = post;
  const targets = providerStatus?.models ?? [],
    target =
      targets.find((t) => t.id === modelId) ??
      targets.find((t) => t.id === providerStatus?.defaultModel) ??
      targets[0];
  const markBusy = useCallback(
    (value: boolean) => {
      busyRef.current = value;
      setBusy(value);
      onBusy(value);
    },
    [onBusy],
  );
  const invalidate = useCallback(
    (remote = true) => {
      epoch.current++;
      pending.current?.abort();
      pending.current = null;
      const old = session.current;
      session.current = null;
      setSessionId(null);
      setRemaining(8);
      setFeedback(null);
      markBusy(false);
      if (old && remote)
        void postRef
          .current("/api/reset", { sessionId: old.sessionId })
          .catch(() => {});
    },
    [markBusy],
  );
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      epoch.current++;
      imageEpoch.current++;
      pending.current?.abort();
      const old = session.current;
      if (old)
        void postRef
          .current("/api/reset", { sessionId: old.sessionId })
          .catch(() => {});
      onBusy(false);
    };
  }, [onBusy]);
  useEffect(() => {
    if (languageRef.current !== language) {
      const wasBusy = busyRef.current;
      languageRef.current = language;
      invalidate();
      if (wasBusy)
        setMessage(
          say(
            language,
            "Language changed. The pending result will not be applied; retry explicitly.",
            "语言已切换，当前请求结果不再应用，请手动重试。",
          ),
        );
    }
  }, [language, invalidate]);
  useEffect(() => {
    if ((!visible || (!lessonId && view === "studio")) && busyRef.current) {
      invalidate();
      setMessage(
        say(
          language,
          "Request stopped here. Your current draft is preserved.",
          "已停止应用请求结果，当前草稿已保留。",
        ),
      );
    }
  }, [visible, view, lessonId, invalidate, language]);
  useEffect(() => {
    if (!targets.some((t) => t.id === modelId) && target) setModelId(target.id);
  }, [targets, modelId, target]);
  const loadLesson = useCallback((input: unknown) => {
    const valid = validateLesson(input);
    setDraft(valid);
    setPlayer(null);
    setPresenting(false);
    setReviewed(false);
    setSource(null);
    setFeedback(null);
    setRevisionKey((k) => k + 1);
    setMessage("");
    return valid;
  }, []);
  useEffect(() => {
    if (!lessonId) return;
    const item = galleryLessons.find((g) => g.id === lessonId);
    if (!item) return;
    invalidate();
    const lesson = loadLesson(structuredClone(item.lesson));
    setReviewed(true);
    setPlayer(createLessonPlayer(lesson));
    setPresenting(true);
    setSource(item.source);
  }, [lessonId, invalidate, loadLesson]);
  useEffect(() => {
    if (starter && authenticated) {
      invalidate();
      closeLesson();
      setTopic(studioWalkthrough(language).topic);
      setCreation("generated");
    }
  }, [starter, authenticated]);
  function closeLesson() {
    invalidate();
    setDraft(null);
    setPlayer(null);
    setPresenting(false);
    setReviewed(false);
    setSource(null);
    setFeedback(null);
    setMessage("");
  }
  const clearFeedback = useCallback(() => setFeedback(null), []);
  async function request(mode: "compose" | "guide", revision?: string) {
    if (
      busyRef.current ||
      !authenticated ||
      !target?.configured ||
      remaining === 0 ||
      imageLoading
    )
      return;
    if (mode === "compose" && !revision && !topic.trim() && !image) {
      setMessage(
        say(
          language,
          "Enter a question or attach an image first.",
          "请先输入问题或附加图片。",
        ),
      );
      return;
    }
    if (image && !revision && target.provider !== "meta") {
      setMessage(
        say(
          language,
          "Choose a Meta model for image input.",
          "图片输入请选择 Meta 模型。",
        ),
      );
      return;
    }
    let body: Record<string, unknown>;
    try {
      body =
        mode === "compose"
          ? {
              topic:
                topic.trim() ||
                (!revision && image ? "" : (draft?.title[language] ?? "")),
              creation,
              ...(!revision && image ? { image: image.dataUrl } : {}),
              ...(revision ? { draft: validateLesson(draft), revision } : {}),
            }
          : {
              lesson: validateLesson(player?.lesson),
              chapter: player!.state.chapter,
              variant: player!.state.variant,
              prediction: player!.state.prediction,
              language,
              controls: player!.state.controls,
              metric: player!.state.metric,
            };
    } catch {
      setMessage(
        say(
          language,
          "Complete both languages and validate the lesson before continuing.",
          "请填全中英文内容并验证课程后继续。",
        ),
      );
      return;
    }
    const token = ++epoch.current,
      controller = new AbortController();
    pending.current = controller;
    markBusy(true);
    setMessage("");
    setFeedback(null);
    const options = {
      timeoutMs: (target.timeoutMs ?? 60000) + 65000,
      signal: controller.signal,
    };
    try {
      if (!session.current) {
        const created = await post<StudioSession>(
          "/api/studio/session",
          { synthetic: true, language, llm: target.id },
          options,
        );
        if (!alive.current || token !== epoch.current) {
          void post("/api/reset", { sessionId: created.sessionId }).catch(
            () => {},
          );
          return;
        }
        session.current = created;
        setSessionId(created.sessionId);
      }
      const reply = await post<ComposeReply | Feedback>(
        `/api/studio/${mode}`,
        { sessionId: session.current.sessionId, ...body },
        options,
      );
      if (!alive.current || token !== epoch.current) return;
      setRemaining(reply.attemptsRemaining);
      if (mode === "compose") {
        const composed = reply as ComposeReply;
        if (composed.status === "ready") {
          loadLesson(composed.lesson);
          setMessage(
            say(
              language,
              "Draft ready. Review the model and assumptions before presenting.",
              "草稿已就绪，演示前请审阅模型与假设。",
            ) +
              (composed.message?.[language]
                ? `\n${composed.message[language]}`
                : ""),
          );
          if (!revision) {
            imageEpoch.current++;
            setImage(null);
          }
        } else setMessage(composed.message[language]);
      } else setFeedback(reply as Feedback);
    } catch (error) {
      if (alive.current && token === epoch.current) {
        if (error instanceof ApiError) {
          if (error.status === 404) {
            session.current = null;
            setSessionId(null);
          }
          if (error.attemptsRemaining !== undefined)
            setRemaining(error.attemptsRemaining);
        }
        setMessage(
          say(
            language,
            "The request could not be completed or validated. Your draft is preserved. Please retry explicitly.",
            "请求未完成或未通过验证，草稿已保留，请手动重试。",
          ),
        );
      }
    } finally {
      if (alive.current && token === epoch.current) {
        pending.current = null;
        markBusy(false);
      }
    }
  }
  async function attach(file: File | undefined) {
    if (!file || busyRef.current || !authenticated) return;
    const token = ++imageEpoch.current;
    setImageLoading(true);
    try {
      const prepared = await prepareImage(file);
      if (alive.current && token === imageEpoch.current) {
        setImage(prepared);
        setMessage(
          say(
            language,
            "Image attached. It will be sent only when you create a lesson.",
            "图片已附加，仅在创建课程时发送。",
          ),
        );
      }
    } catch (error) {
      if (alive.current && token === imageEpoch.current) {
        setImage(null);
        setMessage(
          say(
            language,
            error instanceof Error && error.message === "size"
              ? "Choose an image under 12 MB that can be reduced to about 1 MB."
              : "Choose a readable PNG, JPEG, WebP or GIF image.",
            error instanceof Error && error.message === "size"
              ? "请选择小于 12 MB、可缩小到约 1 MB 的图片。"
              : "请选择可读取的 PNG、JPEG、WebP 或 GIF 图片。",
          ),
        );
      }
    } finally {
      if (alive.current && token === imageEpoch.current) setImageLoading(false);
    }
  }
  async function importLesson(file: File | undefined) {
    if (!file || busyRef.current || !authenticated) return;
    const token = epoch.current;
    try {
      if (file.size > 40000) throw new Error();
      const value = JSON.parse(await file.text());
      if (alive.current && token === epoch.current && !busyRef.current) {
        loadLesson(value);
        setMessage(
          say(
            language,
            "Imported draft. Review it before presenting. No model call was made.",
            "已导入草稿，演示前请审阅。未调用模型。",
          ),
        );
      }
    } catch {
      if (alive.current && token === epoch.current)
        setMessage(
          say(
            language,
            "Use a valid version 1 or 2 lesson JSON file under 40 KB.",
            "请选择小于 40 KB 的有效版本 1 或 2 课程 JSON 文件。",
          ),
        );
    }
  }
  function exportLesson() {
    try {
      const valid = validateLesson(draft),
        url = URL.createObjectURL(
          new Blob([JSON.stringify(valid, null, 2)], {
            type: "application/json",
          }),
        ),
        link = document.createElement("a");
      link.href = url;
      link.download = "explainback-lesson.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setMessage(
        say(
          language,
          "Complete both languages before exporting.",
          "导出前请补全中英文内容。",
        ),
      );
    }
  }
  function present() {
    try {
      setPlayer(createLessonPlayer(validateLesson(draft)));
      setPresenting(true);
      setMessage("");
    } catch {
      setMessage(
        say(
          language,
          "Complete both languages and check the lesson definition before presenting.",
          "演示前请填全中英文内容并检查课程定义。",
        ),
      );
    }
  }
  const canRequest =
    authenticated && Boolean(target?.configured) && remaining > 0;
  const showLesson = Boolean(lessonId) || view === "create";
  return (
    <div className="studio" hidden={!visible}>
      {draft && authenticated && showLesson && (
        <div className="draft-provider-bar">
          <label>
            {say(
              language,
              "Model for your next request",
              "下一次请求使用的模型",
            )}
            <select
              value={target?.id ?? ""}
              disabled={busy}
              onChange={(event) => {
                setModelId(event.target.value);
                invalidate();
              }}
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id} disabled={!t.configured}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <p className="fine">
            {remaining}{" "}
            {say(
              language,
              "requests left in this provider session",
              "次请求剩余 / 当前模型会话",
            )}
          </p>
        </div>
      )}

      {!lessonId && view === "studio" && (
        <>
          <section className="intro-studio">
            <div>
              <p className="eyebrow">
                {say(
                  language,
                  "CURIOSITY, PUT INTO PRACTICE",
                  "让好奇心，变成亲手尝试",
                )}
              </p>
              <h1>
                {say(
                  language,
                  "A question. An experiment.",
                  "一个问题，一次实验。",
                )}
                <br />
                <span>
                  {say(language, "Your own explanation.", "讲出你自己的理解。")}
                </span>
              </h1>
              <p>
                {say(
                  language,
                  "Explore an idea, see what changes, and explain it back. Interactive lessons in English and Chinese.",
                  "探索一个想法，观察变化，再用自己的话讲出来。中英文互动课程，从好奇开始。",
                )}
              </p>
            </div>
            <div className="intro-note">
              <span aria-hidden="true">↳</span>
              <p>
                {say(
                  language,
                  "Understanding grows when you can explain what happened.",
                  "当你能解释发生了什么，理解也随之生长。",
                )}
              </p>
            </div>
          </section>
          <Gallery language={language} />
          <section className="create-invitation">
            <div>
              <p className="eyebrow">
                {say(language, "BRING YOUR OWN QUESTION", "带着你的问题来")}
              </p>
              <h2>
                {say(
                  language,
                  "What would you like to understand?",
                  "你想弄明白什么？",
                )}
              </h2>
              <p>
                {say(
                  language,
                  "Let Muse draft a lesson. Review it, refine it, then put the idea to the test.",
                  "让 Muse 起草课程，审阅、修改，再亲手检验其中的想法。",
                )}
              </p>
            </div>
            <a className="button" href="#create">
              {say(language, "Create a lesson", "创建课程")}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </section>
        </>
      )}
      {!draft && view === "create" && (
        <section className="author-workspace">
          <div className="workspace-heading">
            <div>
              <p className="eyebrow">
                {say(language, "01 / ASK A QUESTION", "01 / 提出一个问题")}
              </p>
              <h1>
                {say(
                  language,
                  "Start with a little curiosity.",
                  "从一点好奇开始。",
                )}
              </h1>
              <p>
                {say(
                  language,
                  "A question or a sketch becomes a lesson you can review and operate.",
                  "一个问题或一张草图，变成可审阅、可操作的课程。",
                )}
              </p>
            </div>
            <a href="#studio" className="back-link">
              {say(language, "Explore the library", "探索课程库")} ↗
            </a>
          </div>
          {!authenticated ? (
            <div className="creation-locked">
              <p>
                {say(
                  language,
                  "Lesson creation is available to preview testers and reviewers.",
                  "课程创建目前向预览测试者和评审开放。",
                )}
              </p>
              <button onClick={onRequestAccess}>
                {say(language, "Enter with access code", "使用访问码进入")}
              </button>
            </div>
          ) : (
            <>
              <ol className="studio-steps">
                <li>
                  <span>01</span>
                  <strong>{say(language, "Create", "创建")}</strong>
                  <small>
                    {say(
                      language,
                      "Bring a question or image",
                      "输入问题或图片",
                    )}
                  </small>
                </li>
                <li>
                  <span>02</span>
                  <strong>
                    {say(language, "Review & refine", "审阅与修改")}
                  </strong>
                  <small>
                    {say(
                      language,
                      "Check the model and assumptions",
                      "检查模型与假设",
                    )}
                  </small>
                </li>
                <li>
                  <span>03</span>
                  <strong>{say(language, "Experiment", "亲手实验")}</strong>
                  <small>
                    {say(
                      language,
                      "Predict, operate and explain",
                      "预测、操作并解释",
                    )}
                  </small>
                </li>
              </ol>
              <form
                className="author-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void request("compose");
                }}
              >
                <label htmlFor={`${formId}-topic`}>
                  {say(
                    language,
                    "What would you like to explore?",
                    "你想探索什么？",
                  )}
                </label>
                <textarea
                  id={`${formId}-topic`}
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  maxLength={600}
                  rows={4}
                  placeholder={say(
                    language,
                    "Why does coffee cool more slowly as it approaches room temperature?",
                    "为什么咖啡接近室温时，冷却会越来越慢？",
                  )}
                  disabled={busy}
                />
                <div className="topic-starters">
                  <span>
                    {say(language, "Try a starting point", "试一个起点")}
                  </span>
                  {[
                    [
                      "Cooling coffee",
                      "咖啡冷却",
                      studioWalkthrough(language).topic,
                    ],
                    [
                      "Web requests",
                      "网页请求",
                      say(
                        language,
                        "Explain how a browser loads a web page with a cache.",
                        "解释浏览器如何通过缓存加载网页。",
                      ),
                    ],
                    [
                      "Quantum interference",
                      "量子干涉",
                      say(
                        language,
                        "How does a quantum computer use interference?",
                        "量子计算机如何利用干涉？",
                      ),
                    ],
                  ].map(([en, zh, value]) => (
                    <button
                      type="button"
                      className="text-button"
                      key={en}
                      disabled={busy}
                      onClick={() => setTopic(value)}
                    >
                      {say(language, en, zh)} ↗
                    </button>
                  ))}
                </div>
                <div className="author-settings">
                  <label>
                    {say(language, "Creation mode", "创建方式")}
                    <select
                      value={creation}
                      onChange={(event) => setCreation(event.target.value)}
                      disabled={busy}
                    >
                      <option value="generated">
                        {say(language, "New topic demo", "新主题演示")}
                      </option>
                      <option value="catalog">
                        {say(language, "Existing experiments", "原有实验")}
                      </option>
                    </select>
                  </label>
                  <label>
                    {say(language, "Model", "模型")}
                    <select
                      value={target?.id ?? ""}
                      onChange={(event) => {
                        setModelId(event.target.value);
                        invalidate();
                      }}
                      disabled={busy}
                    >
                      {targets.map((t) => (
                        <option
                          key={t.id}
                          value={t.id}
                          disabled={!t.configured}
                        >
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="image-attachment">
                  <label className="file-action">
                    <span aria-hidden="true">＋</span>
                    {say(
                      language,
                      "Add a photo, sketch or diagram",
                      "添加照片、草图或示意图",
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={(event) => {
                        void attach(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                      disabled={busy}
                    />
                  </label>
                  <span className="fine">
                    {say(
                      language,
                      "Optional · up to 12 MB",
                      "可选 · 最大 12 MB",
                    )}
                  </span>
                  {imageLoading && (
                    <p role="status">
                      {say(
                        language,
                        "Preparing image locally…",
                        "正在本地处理图片…",
                      )}
                    </p>
                  )}
                  {image && (
                    <div className="image-preview">
                      <img
                        src={image.dataUrl}
                        alt={say(
                          language,
                          "Attached image preview",
                          "已附加图片预览",
                        )}
                      />
                      <span>{image.name}</span>
                      <button
                        type="button"
                        className="text-button"
                        disabled={busy}
                        onClick={() => {
                          imageEpoch.current++;
                          setImage(null);
                        }}
                      >
                        {say(language, "Remove image", "移除图片")}
                      </button>
                    </div>
                  )}
                </div>
                <div className="author-submit">
                  <button
                    type="submit"
                    disabled={busy || imageLoading || !canRequest}
                  >
                    {say(
                      language,
                      busy ? "Muse is working…" : "Create a lesson",
                      busy ? "Muse 正在处理…" : "创建课程",
                    )}{" "}
                    <span aria-hidden="true">↗</span>
                  </button>
                  <label className="file-action import-action">
                    {say(language, "Import lesson JSON", "导入课程 JSON")}
                    <input
                      type="file"
                      accept=".json,application/json"
                      disabled={busy}
                      onChange={(event) => {
                        void importLesson(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <p className="fine author-privacy">
                  {say(
                    language,
                    "One model request when you click Create. Images are sent once and are not stored. Use synthetic examples. Export a lesson to keep it.",
                    "点击创建时调用一次模型。图片仅发送一次，不会存储。请使用虚构示例，导出课程以便保留。",
                  )}
                </p>
              </form>
            </>
          )}
        </section>
      )}
      <div hidden={!showLesson}>
        {message && (
          <p className="studio-message" role="status">
            {message}
          </p>
        )}
        {busy && (
          <p className="request-progress" role="status">
            <span className="working-dot" />
            {say(
              language,
              "Muse is working. Your existing draft stays here until the response is validated.",
              "Muse 正在处理，响应通过验证前，现有草稿会保留。",
            )}
          </p>
        )}
        {draft && !presenting && (
          <DraftReview
            key={revisionKey}
            draft={draft}
            language={language}
            busy={busy}
            reviewed={reviewed}
            setReviewed={setReviewed}
            onChange={(next) => {
              setDraft(next);
              setReviewed(false);
            }}
            onPresent={present}
            onExport={exportLesson}
            onClose={closeLesson}
            onRevise={(revision) => void request("compose", revision)}
            canRequest={canRequest}
          />
        )}
        {presenting && player && (
          <>
            <LessonPlayer
              player={player}
              language={language}
              visible={visible && showLesson}
              busy={busy}
              canAsk={canRequest}
              feedback={feedback}
              onGuide={() => void request("guide")}
              onClearFeedback={clearFeedback}
              onBack={() => setPresenting(false)}
              onLibrary={() => {
                invalidate();
                closeLesson();
              }}
            />
            {source && (
              <p className="lesson-provenance">
                {gallerySourceNote(source, language)}
              </p>
            )}
          </>
        )}
        {remaining === 0 && authenticated && (
          <div className="notice">
            <p>
              {say(
                language,
                "This provider session has used its request budget. Your lesson still works locally.",
                "本次模型会话的请求额度已用完，课程仍可在本地运行。",
              )}
            </p>
            <button className="secondary" onClick={() => invalidate()}>
              {say(
                language,
                "Start a new provider session",
                "开启新的模型会话",
              )}
            </button>
          </div>
        )}
        {authenticated && (
          <ProviderConsole
            post={post}
            language={language}
            enabled={
              Boolean(providerStatus?.traceEnabled) && visible && showLesson
            }
            sessionId={sessionId}
            busy={busy}
          />
        )}
      </div>
    </div>
  );
}
