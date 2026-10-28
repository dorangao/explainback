import { useEffect, useMemo, useReducer, useRef, useState, useId } from "react";
import type { Feedback, Language, Player } from "../lib/types";
import { say } from "../lib/types";
import { formatDemoNumber } from "../lib/shared";
import { measureQuantum, sampleQuantum } from "../../public/quantum.mjs";
import { ExperimentView } from "./ExperimentView";
const measure = measureQuantum as (state: unknown) => {
  state: unknown;
  outcome: number;
};
const sample = sampleQuantum as (state: unknown) => number[];
export function LessonPlayer({
  player,
  language,
  visible,
  busy,
  canAsk,
  feedback,
  onGuide,
  onClearFeedback,
  onBack,
  onLibrary,
}: {
  player: Player;
  language: Language;
  visible: boolean;
  busy: boolean;
  canAsk: boolean;
  feedback: Feedback | null;
  onGuide: () => void;
  onClearFeedback: () => void;
  onBack: () => void;
  onLibrary: () => void;
}) {
  const formId = useId();
  const [, update] = useReducer((n) => n + 1, 0),
    [playing, setPlaying] = useState(false),
    [answer, setAnswer] = useState(""),
    [result, setResult] = useState<boolean | "invalid" | null>(null),
    [notice, setNotice] = useState(""),
    [observation, setObservation] = useState<{
      state: unknown;
      outcome: number;
    } | null>(null),
    [counts, setCounts] = useState<number[] | null>(null);
  const heading = useRef<HTMLHeadingElement>(null),
    state = player.state;
  const controlsKey = JSON.stringify(state.controls);
  const e = useMemo(
    () => player.experiment(language),
    [player, language, state.chapter, state.variant, state.metric, controlsKey],
  );
  const chapter = player.lesson.chapters[state.chapter];
  useEffect(() => {
    setPlaying(false);
  }, [language, visible, busy]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  useEffect(() => {
    if (!playing || busy || !visible || state.stage !== "experiment") return;
    let frame = 0,
      last = 0,
      progress = player.state.progress;
    const tick = (now: number) => {
      if (last) progress = Math.min(1, progress + (now - last) / 6000);
      last = now;
      player.scrub(progress);
      update();
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, busy, visible, player, state.stage]);
  const resetFeedback = () => {
    onClearFeedback();
    setResult(null);
    setObservation(null);
    setCounts(null);
    setNotice("");
  };
  const act = (fn: () => void) => {
    setPlaying(false);
    resetFeedback();
    fn();
    update();
  };
  const stages = {
    predict: say(language, "Make a prediction", "先做一个预测"),
    experiment: say(language, "Run the experiment", "亲手运行实验"),
    explain: say(language, "Explain what changed", "解释观察到的变化"),
    transfer: say(language, "Try a fresh case", "试一个新情境"),
    complete: say(language, "A clearer explanation.", "理解，又清晰了一点。"),
  };
  const labels = [
    say(language, "Predict", "预测"),
    say(language, "Experiment", "实验"),
    say(language, "Explain", "解释"),
    say(language, "Transfer", "迁移"),
  ];
  const index = [
    "predict",
    "experiment",
    "explain",
    "transfer",
    "complete",
  ].indexOf(state.stage);
  const nextDisabled =
    busy ||
    (state.stage === "predict" && !state.prediction) ||
    (state.stage === "experiment" && state.progress !== 1) ||
    (state.stage === "transfer" && state.transfer !== true);
  const nextLabel =
    state.stage === "complete"
      ? say(language, "Restart lesson", "重新学习")
      : state.stage === "predict"
        ? say(language, "Test this claim →", "检验这个观点 →")
        : state.stage === "experiment"
          ? say(language, "Explain the result →", "解释结果 →")
          : state.stage === "explain"
            ? say(language, "Try a fresh case →", "尝试新情境 →")
            : say(language, "Next chapter →", "下一章 →");
  function setInput(id: string, value: number) {
    try {
      act(() => player.input(id, value));
      return true;
    } catch {
      setNotice(
        say(
          language,
          "Use a value within the reviewed range and step.",
          "请输入符合已审阅范围与步长的值。",
        ),
      );
    }
    return false;
  }
  return (
    <section
      className="lesson-player"
      data-stage={state.stage}
      data-chapter={state.chapter}
      data-progress={state.progress}
      aria-labelledby={`${formId}-title`}
    >
      <div className="player-toolbar">
        <a className="back-link" href="#studio" onClick={onLibrary}>
          <span aria-hidden="true">← </span>
          {say(language, "Back to library", "返回课程库")}
        </a>
        <button className="text-button" onClick={onBack} disabled={busy}>
          {say(language, "Lesson overview", "课程概览")}
        </button>
      </div>
      <div className="player-heading">
        <p className="eyebrow">
          {say(language, "CHAPTER", "章节")} {state.chapter + 1} /{" "}
          {player.lesson.chapters.length} · {e.title}
        </p>
        <h2 id={`${formId}-title`}>{player.lesson.title[language]}</h2>
        <p>{chapter.framing[language]}</p>
      </div>
      <ol
        className="learning-steps"
        aria-label={say(language, "Learning progress", "学习进度")}
      >
        {labels.map((label, i) => (
          <li
            key={label}
            aria-current={index === i ? "step" : undefined}
            className={index > i ? "is-complete" : ""}
          >
            <span>{index > i ? "✓" : `0${i + 1}`}</span>
            {label}
          </li>
        ))}
      </ol>
      <div className="player-layout">
        <div className="player-main">
          <h3 ref={heading} tabIndex={-1}>
            {stages[state.stage]}
          </h3>
          {state.stage !== "complete" && (
            <blockquote className="claim">
              <span className="eyebrow">
                {say(language, "THE CLAIM", "待检验的观点")}
              </span>
              {e.claim}
            </blockquote>
          )}
          {state.stage === "predict" && (
            <>
              <p>
                {say(
                  language,
                  "Choose before revealing the result. You can change your mind after testing.",
                  "先选择，再查看结果。实验之后，你可以重新思考。",
                )}
              </p>
              <div className="prediction-options">
                {(["agree", "disagree", "unsure"] as const).map((value, i) => (
                  <button
                    key={value}
                    className="secondary"
                    aria-pressed={state.prediction === value}
                    disabled={busy}
                    onClick={() => {
                      player.predict(value);
                      update();
                    }}
                  >
                    {
                      [
                        say(language, "Agree", "同意"),
                        say(language, "Disagree", "不同意"),
                        say(language, "Not sure", "不确定"),
                      ][i]
                    }
                  </button>
                ))}
              </div>
            </>
          )}
          {!["predict", "complete"].includes(state.stage) && (
            <div className="experiment-surface">
              <ExperimentView
                experiment={e}
                progress={state.progress}
                language={language}
                interactive={!busy && state.stage === "experiment"}
                onScrub={(v) => act(() => player.scrub(v))}
              />
              <p className="experiment-caption">{e.caption(state.progress)}</p>
              <label className="scrub-label">
                {say(language, "Experiment progress", "实验进度")}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step={1 / e.steps}
                  value={state.progress}
                  onChange={(event) =>
                    act(() => player.scrub(Number(event.target.value)))
                  }
                  disabled={busy || state.stage !== "experiment"}
                />
              </label>
              <div className="actions">
                <button
                  className="secondary"
                  disabled={busy || state.stage !== "experiment"}
                  onClick={() => {
                    if (playing) setPlaying(false);
                    else {
                      if (state.progress === 1) player.scrub(0);
                      setObservation(null);
                      setCounts(null);
                      setPlaying(true);
                    }
                  }}
                >
                  {say(
                    language,
                    playing
                      ? "Pause"
                      : e.kind === "process"
                        ? "Play process"
                        : "Play experiment",
                    playing
                      ? "暂停"
                      : e.kind === "process"
                        ? "播放过程"
                        : "播放实验",
                  )}
                </button>
                <button
                  className="text-button"
                  disabled={busy || state.stage !== "experiment"}
                  onClick={() => act(() => player.scrub(1))}
                >
                  {say(language, "Show final state", "查看最终状态")}
                </button>
              </div>
              {state.progress === 1 && e.metrics.length > 0 && (
                <dl className="experiment-metrics">
                  {e.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>
                        {formatDemoNumber(m.value)} <small>{m.unit}</small>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              {e.quantumState !== undefined && (
                <div className="quantum-measure">
                  <p className="fine">
                    {say(
                      language,
                      "Curves show pre-measurement probabilities. Each fresh shot prepares the circuit again.",
                      "曲线显示测量前的概率；每次独立测量都会重新制备电路。",
                    )}
                  </p>
                  <div className="actions">
                    <button
                      className="secondary"
                      disabled={busy || state.progress !== 1}
                      onClick={() => {
                        setObservation(
                          measure(observation?.state ?? e.quantumState),
                        );
                        setCounts(null);
                      }}
                    >
                      {say(
                        language,
                        observation
                          ? "Read this measured state again"
                          : "Measure once",
                        observation ? "再次读取本次测量后的状态" : "测量一次",
                      )}
                    </button>
                    <button
                      className="secondary"
                      disabled={busy || state.progress !== 1}
                      onClick={() => {
                        setCounts(sample(e.quantumState));
                        setObservation(null);
                      }}
                    >
                      {say(
                        language,
                        "256 fresh preparations",
                        "独立制备并测量 256 次",
                      )}
                    </button>
                  </div>
                  <p role="status">
                    {observation
                      ? `${say(language, "Measured state", "测量状态")} |${e.basisLabels?.[observation.outcome]}⟩`
                      : counts
                        ? counts
                            .map((n, i) => `|${e.basisLabels?.[i]}⟩ ${n}/256`)
                            .join(" · ")
                        : ""}
                  </p>
                </div>
              )}
            </div>
          )}
          {state.stage === "explain" && (
            <section className="evidence-summary">
              <p className="eyebrow">
                {say(language, "CALCULATED EVIDENCE", "计算证据")}
              </p>
              <p>{e.result}</p>
              <p className="eyebrow">
                {say(
                  language,
                  "AUTHORED EXPLANATION · REVIEWABLE",
                  "创作的解释 · 可审阅",
                )}
              </p>
              <p>{chapter.explanation[language]}</p>
              {canAsk && (
                <button className="secondary" disabled={busy} onClick={onGuide}>
                  {say(
                    language,
                    busy
                      ? "Muse is working…"
                      : "Ask Muse to explain this result",
                    busy ? "Muse 正在处理…" : "让 Muse 解释这个结果",
                  )}
                </button>
              )}
              {feedback && (
                <div className="model-feedback">
                  <p>{feedback.explanation}</p>
                  <button
                    className="secondary"
                    disabled={busy}
                    onClick={() =>
                      act(() => {
                        if (feedback.nextAction === "compare")
                          player.variant(1 - state.variant);
                        else if (feedback.nextAction === "replay")
                          player.replay();
                        else player.next();
                      })
                    }
                  >
                    {say(
                      language,
                      {
                        compare: "Compare a preset",
                        replay: "Replay experiment",
                        transfer: "Try the transfer question",
                      }[feedback.nextAction],
                      {
                        compare: "比较另一组设置",
                        replay: "重播实验",
                        transfer: "尝试迁移题",
                      }[feedback.nextAction],
                    )}{" "}
                    →
                  </button>
                </div>
              )}
            </section>
          )}
          {state.stage === "transfer" && (
            <section className="transfer-question">
              <p className="pre-line">{e.transfer.question}</p>
              {e.transfer.type === "choice" ? (
                <div className="choice-list">
                  {e.transfer.choices?.map((choice, i) => (
                    <button
                      className="secondary"
                      disabled={busy}
                      key={i}
                      onClick={() => {
                        setResult(player.check(String(i)));
                        update();
                      }}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setResult(player.check(answer) ?? "invalid");
                    update();
                  }}
                >
                  <label>
                    {say(language, "Your answer", "你的答案")} (
                    {e.transfer.unit})
                    <input
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value);
                        setResult(null);
                        player.editAnswer();
                        update();
                      }}
                      inputMode="decimal"
                      maxLength={32}
                      disabled={busy}
                    />
                  </label>
                  <button className="secondary" disabled={busy}>
                    {say(language, "Check answer locally", "本地核验答案")}
                  </button>
                </form>
              )}
              <p
                className={
                  result === true ? "answer-correct" : "answer-feedback"
                }
                role="status"
              >
                {result === null
                  ? ""
                  : result === "invalid"
                    ? say(
                        language,
                        "Enter a finite number.",
                        "请输入有限数值。",
                      )
                    : result
                      ? say(
                          language,
                          "That matches this model. Ready for the next step.",
                          "与本模型的结果相符，可以继续下一步。",
                        )
                      : say(
                          language,
                          "That does not match yet. Revisit the inputs and try again.",
                          "还不相符，请重新检查输入并再次尝试。",
                        )}
              </p>
            </section>
          )}
          {state.stage === "complete" && (
            <div className="completion">
              <span className="completion-mark" aria-hidden="true">
                ✓
              </span>
              <p>
                {say(
                  language,
                  "You predicted, tested, explained and tried a fresh case. Keep asking what changes when the assumptions change.",
                  "你已预测、实验、解释，并尝试了新情境。继续思考：假设改变时，结果会怎样变化？",
                )}
              </p>
              <p className="fine">
                {say(
                  language,
                  "This walkthrough is a teaching example, not a certification of understanding.",
                  "本演示是教学示例，并不代表已全面掌握知识。",
                )}
              </p>
            </div>
          )}
          {notice && (
            <p className="notice" role="status">
              {notice}
            </p>
          )}
          <div className="player-next">
            <button
              disabled={nextDisabled}
              onClick={() => {
                act(() => {
                  if (state.stage === "complete") player.restart();
                  else player.next();
                });
                setAnswer("");
                heading.current?.focus();
              }}
            >
              {nextLabel}
            </button>
            {!["predict", "complete"].includes(state.stage) && (
              <button
                className="text-button"
                disabled={busy}
                onClick={() => act(() => player.replay())}
              >
                {say(language, "Replay experiment", "重播实验")}
              </button>
            )}
          </div>
        </div>
        <aside className="player-inspector">
          <p className="eyebrow">
            {say(language, "YOUR EXPERIMENT", "你的实验")}
          </p>
          {state.prediction && (
            <p className="fine">
              {say(language, "Your prediction: ", "你的预测：")}
              {
                {
                  agree: say(language, "Agree", "同意"),
                  disagree: say(language, "Disagree", "不同意"),
                  unsure: say(language, "Not sure", "不确定"),
                }[state.prediction]
              }
            </p>
          )}
          {!e.generated && (
            <label>
              {say(
                language,
                "Compare a preset (resets this chapter)",
                "比较设置（重置本章）",
              )}
              <select
                value={state.variant}
                onChange={(event) =>
                  act(() => player.variant(Number(event.target.value)))
                }
                disabled={busy}
              >
                {e.variants.map((v, i) => (
                  <option key={i} value={i}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          )}
          {e.inputs?.map((input) => (
            <div className="parameter" key={input.id}>
              <label htmlFor={`${formId}-parameter-${input.id}`}>
                {input.label} <span>({input.unit})</span>
              </label>
              <input
                id={`${formId}-parameter-${input.id}`}
                type="number"
                min={input.min}
                max={input.max}
                step={input.step}
                key={`${input.id}-${input.value}`}
                defaultValue={input.value}
                disabled={busy}
                onBlur={(event) => {
                  const value = event.target.value;
                  if (value !== "" && event.target.validity.valid) {
                    if (
                      Number(value) !== input.value &&
                      !setInput(input.id, Number(value))
                    )
                      event.target.value = String(input.value);
                  } else {
                    event.target.value = String(input.value);
                    setNotice(
                      say(
                        language,
                        "Use a value within the reviewed range and step.",
                        "请输入符合已审阅范围与步长的值。",
                      ),
                    );
                  }
                }}
              />
              <input
                type="range"
                aria-label={`${input.label} slider`}
                min={input.min}
                max={input.max}
                step={input.step}
                value={input.value}
                disabled={busy}
                onChange={(event) =>
                  setInput(input.id, Number(event.target.value))
                }
              />
              <small>
                {input.min} → {input.max} ·{" "}
                {say(
                  language,
                  "changes reset your prediction",
                  "修改将重置预测",
                )}
              </small>
            </div>
          ))}
          {(e.formulas?.length ?? 0) > 1 && (
            <label>
              {say(language, "Graph output", "图表输出")}
              <select
                value={state.metric}
                disabled={busy}
                onChange={(event) => {
                  player.output(Number(event.target.value));
                  update();
                }}
              >
                {e.formulas?.map((f, i) => (
                  <option key={f.id} value={i}>
                    {f.label} ({f.unit})
                  </option>
                ))}
              </select>
            </label>
          )}
          <details className="assumptions" open>
            <summary>
              {say(language, "Assumptions & limits", "假设与限制")}
            </summary>
            <p>{e.assumptions}</p>
            {e.generated && (
              <p className="fine">
                {say(
                  language,
                  e.kind === "process"
                    ? "Authored steps and answers; not independently verified."
                    : "Calculations follow reviewed formulas. Scientific assumptions and units still need review.",
                  e.kind === "process"
                    ? "步骤与答案来自创作，未经独立验证。"
                    : "按已审阅公式计算，科学假设与单位仍需审阅。",
                )}
              </p>
            )}
          </details>
        </aside>
      </div>
    </section>
  );
}
