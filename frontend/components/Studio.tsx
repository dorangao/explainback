import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ComposeReply,
  Feedback,
  Language,
  Lesson,
  Player,
  Post,
  Status,
} from "../lib/types";
import { say } from "../lib/types";
import {
  createLessonPlayer,
  galleryLessons,
  gallerySourceNote,
  studioWalkthrough,
  validateLesson,
} from "../lib/shared";
import { useProviderSession } from "../hooks/useProviderSession";
import { useImageAttachment } from "../hooks/useImageAttachment";
import { Gallery } from "./Gallery";
import { LessonPlayer } from "./LessonPlayer";
import { RequestSummary } from "./RevisionSummary";
// Authoring, review and diagnostics load only when someone creates or revises.
const DraftReview = lazy(() =>
  import("./DraftReview").then((m) => ({ default: m.DraftReview })),
);
const RevisionSummary = lazy(() =>
  import("./RevisionSummary").then((m) => ({ default: m.RevisionSummary })),
);
const ProviderConsole = lazy(() =>
  import("./ProviderConsole").then((m) => ({ default: m.ProviderConsole })),
);

type Revision = { before: Lesson; after: Lesson };

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
    [message, setMessage] = useState(""),
    [feedback, setFeedback] = useState<Feedback | null>(null),
    [revision, setRevision] = useState<Revision | null>(null),
    [source, setSource] = useState<string | null>(null);
  const clearFeedback = useCallback(() => setFeedback(null), []);
  const provider = useProviderSession({
    post,
    language,
    onBusy,
    onInvalidate: clearFeedback,
  });
  const {
    busy,
    busyRef,
    remaining,
    sessionId,
    metrics,
    languageInterrupted,
    run,
    alive,
    epoch,
  } = provider;
  const image = useImageAttachment(language);
  const targets = useMemo(
    () => providerStatus?.models ?? [],
    [providerStatus?.models],
  );
  const target =
    targets.find((t) => t.id === modelId) ??
    targets.find((t) => t.id === providerStatus?.defaultModel) ??
    targets[0];
  const { invalidate } = provider;
  const stopHidden = (!visible || (!lessonId && view === "studio")) && busy;
  useEffect(() => {
    if (!stopHidden) return;
    invalidate();
    setMessage(
      say(
        language,
        "Request stopped here. Your current draft is preserved.",
        "已停止应用请求结果，当前草稿已保留。",
      ),
    );
  }, [stopHidden, invalidate, language]);
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
  const closeLesson = useCallback(() => {
    invalidate();
    setDraft(null);
    setPlayer(null);
    setPresenting(false);
    setReviewed(false);
    setSource(null);
    setFeedback(null);
    setRevision(null);
    setMessage("");
  }, [invalidate]);
  // A gallery lesson is reviewed content: open it straight into the player.
  const openedGallery = useRef<string | null>(null);
  useEffect(() => {
    if (!lessonId || openedGallery.current === lessonId) return;
    const item = galleryLessons.find((g) => g.id === lessonId);
    if (!item) return;
    openedGallery.current = lessonId;
    invalidate();
    const lesson = loadLesson(structuredClone(item.lesson));
    setReviewed(true);
    setPlayer(createLessonPlayer(lesson));
    setPresenting(true);
    setSource(item.source);
  }, [lessonId, invalidate, loadLesson]);
  // An invite or the Create link seeds the editable starter topic.
  const seenStarter = useRef(0);
  useEffect(() => {
    if (!starter || !authenticated || seenStarter.current === starter) return;
    seenStarter.current = starter;
    closeLesson();
    setTopic(studioWalkthrough(language).topic);
    setCreation("generated");
  }, [starter, authenticated, closeLesson, language]);
  async function request(mode: "compose" | "guide", revisionText?: string) {
    if (
      busyRef.current ||
      !authenticated ||
      !target?.configured ||
      remaining === 0 ||
      image.loading
    )
      return;
    const attached = image.image;
    if (mode === "compose" && !revisionText && !topic.trim() && !attached) {
      setMessage(
        say(
          language,
          "Enter a question or attach an image first.",
          "请先输入问题或附加图片。",
        ),
      );
      return;
    }
    if (attached && !revisionText && target.provider !== "meta") {
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
                (!revisionText && attached ? "" : (draft?.title[language] ?? "")),
              creation,
              ...(!revisionText && attached ? { image: attached.dataUrl } : {}),
              ...(revisionText
                ? { draft: validateLesson(draft), revision: revisionText }
                : {}),
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
    const before = revisionText && draft ? structuredClone(draft) : null;
    setMessage("");
    setFeedback(null);
    const result = await run<ComposeReply | Feedback>(
      target,
      mode === "guide" ? "guide" : revisionText ? "revise" : "compose",
      (id, options) =>
        post<ComposeReply | Feedback>(
          `/api/studio/${mode}`,
          { sessionId: id, ...body },
          options,
        ),
    );
    if (!result.ok) {
      if (!result.stale)
        setMessage(
          say(
            language,
            "The request could not be completed or validated. Your draft is preserved. Please retry explicitly.",
            "请求未完成或未通过验证，草稿已保留，请手动重试。",
          ),
        );
      return;
    }
    if (mode === "compose") {
      const composed = result.reply as ComposeReply;
      if (composed.status === "ready" && composed.lesson) {
        const next = loadLesson(composed.lesson);
        setRevision(before ? { before, after: next } : null);
        setMessage(
          say(
            language,
            before
              ? "Revision ready. Check what changed, then review before presenting."
              : "Draft ready. Review the model and assumptions before presenting.",
            before
              ? "修改已就绪。先查看改动，再审阅后演示。"
              : "草稿已就绪，演示前请审阅模型与假设。",
          ) +
            (composed.message?.[language]
              ? `\n${composed.message[language]}`
              : ""),
        );
        if (!revisionText) image.clear();
      } else setMessage(composed.message[language]);
    } else setFeedback(result.reply as Feedback);
  }
  async function importLesson(file: File | undefined) {
    if (!file || busyRef.current || !authenticated) return;
    const token = epoch.current;
    try {
      if (file.size > 40000) throw new Error();
      const value = JSON.parse(await file.text());
      if (alive.current && token === epoch.current && !busyRef.current) {
        loadLesson(value);
        setRevision(null);
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
  const statusMessage = languageInterrupted
    ? say(
        language,
        "Language changed. The pending result will not be applied; retry explicitly.",
        "语言已切换，当前请求结果不再应用，请手动重试。",
      )
    : message || image.notice;
  const loadingNote = (
    <p role="status">{say(language, "Loading…", "正在加载…")}</p>
  );
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
                        if (!busyRef.current && authenticated)
                          void image.attach(event.target.files?.[0]);
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
                  {image.loading && (
                    <p role="status">
                      {say(
                        language,
                        "Preparing image locally…",
                        "正在本地处理图片…",
                      )}
                    </p>
                  )}
                  {image.image && (
                    <div className="image-preview">
                      <img
                        src={image.image.dataUrl}
                        alt={say(
                          language,
                          "Attached image preview",
                          "已附加图片预览",
                        )}
                      />
                      <span>{image.image.name}</span>
                      <button
                        type="button"
                        className="text-button"
                        disabled={busy}
                        onClick={image.clear}
                      >
                        {say(language, "Remove image", "移除图片")}
                      </button>
                    </div>
                  )}
                </div>
                <div className="author-submit">
                  <button
                    type="submit"
                    disabled={busy || image.loading || !canRequest}
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
        {statusMessage && (
          <p className="studio-message" role="status">
            {statusMessage}
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
          <Suspense fallback={loadingNote}>
            {revision ? (
              <RevisionSummary
                before={revision.before}
                after={draft}
                language={language}
                metrics={metrics?.mode === "revise" ? metrics : null}
                onDismiss={() => setRevision(null)}
              />
            ) : (
              metrics?.mode === "compose" && (
                <RequestSummary metrics={metrics} language={language} />
              )
            )}
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
              onRevise={(text) => void request("compose", text)}
              canRequest={canRequest}
            />
          </Suspense>
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
              onLibrary={closeLesson}
            />
            {feedback && metrics?.mode === "guide" && (
              <RequestSummary metrics={metrics} language={language} />
            )}
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
          <Suspense fallback={null}>
            <ProviderConsole
              post={post}
              language={language}
              enabled={
                Boolean(providerStatus?.traceEnabled) && visible && showLesson
              }
              sessionId={sessionId}
              busy={busy}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
