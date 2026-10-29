import { useCallback, useEffect, useMemo, useState } from "react";
import type { Language, Lesson, Show } from "../lib/types";
import { say } from "../lib/types";
import { chapterExperiment, formatDemoNumber as fmt } from "../lib/shared";
import { ExperimentView } from "./ExperimentView";

const speechAvailable = () =>
  typeof window !== "undefined" &&
  "speechSynthesis" in window &&
  typeof SpeechSynthesisUtterance !== "undefined";
// Reading time when no voice is available: about 55 ms per character, 4–14 s.
const readingMs = (text: string) =>
  Math.min(14000, Math.max(4000, text.length * 55));

// A narrated slide show. Slides are rendered from the checked lesson; the narration was
// written by the creator model; the voice is the browser's own speech synthesis.
export function ShowPlayer({
  lesson,
  show,
  cover,
  language,
  scriptModel,
  coverModel,
  onClose,
}: {
  lesson: Lesson;
  show: Show;
  cover: string | null;
  language: Language;
  scriptModel: string | null;
  coverModel: string | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [voice, setVoice] = useState(() => speechAvailable()),
    [progress, setProgress] = useState(0);
  const slide = show.slides[index],
    last = index === show.slides.length - 1;
  const chapter = lesson.chapters[slide.chapter] ?? lesson.chapters[0];
  const experiment = useMemo(
    () => chapterExperiment(chapter, 0, language),
    [chapter, language],
  );
  const narration = slide.narration[language];
  const stop = useCallback(() => {
    if (speechAvailable()) window.speechSynthesis.cancel();
  }, []);
  const go = useCallback(
    (next: number) => {
      stop();
      setIndex(Math.max(0, Math.min(show.slides.length - 1, next)));
    },
    [show.slides.length, stop],
  );
  // Narration: speak the slide, or wait a reading time, then advance while playing.
  useEffect(() => {
    if (!playing) return;
    let timer = 0,
      cancelled = false;
    const advance = () => {
      if (cancelled) return;
      if (last) setPlaying(false);
      else setIndex((i) => Math.min(show.slides.length - 1, i + 1));
    };
    if (voice && speechAvailable()) {
      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.lang = language === "zh" ? "zh-CN" : "en-US";
      const match = window.speechSynthesis
        .getVoices()
        .find((v) =>
          v.lang.toLowerCase().startsWith(language === "zh" ? "zh" : "en"),
        );
      if (match) utterance.voice = match;
      utterance.rate = 0.95;
      utterance.onend = advance;
      utterance.onerror = () => {
        timer = window.setTimeout(advance, readingMs(narration));
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else timer = window.setTimeout(advance, readingMs(narration));
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      if (speechAvailable()) window.speechSynthesis.cancel();
    };
  }, [playing, index, voice, narration, language, last, show.slides.length]);
  // Experiment slides sweep the parameter once, over roughly the narration time.
  useEffect(() => {
    if (slide.kind !== "experiment") return;
    const duration = Math.max(5000, readingMs(narration));
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const u = Math.min(1, (now - started) / duration);
      setProgress(u);
      if (u < 1) frame = requestAnimationFrame(tick);
    };
    setProgress(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [slide.kind, index, narration]);
  useEffect(() => stop, [stop]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(index + 1);
      else if (event.key === "ArrowLeft") go(index - 1);
      else if (event.key === "Escape") onClose();
      else if (event.key === " " && event.target === document.body) {
        event.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, index, onClose]);
  const e = experiment;
  return (
    <section
      className="show-player"
      data-kind={slide.kind}
      aria-label={say(language, "Lesson show", "讲解秀")}
    >
      <div className="show-stage">
        {slide.kind === "cover" && (
          <div className="show-cover">
            {cover && (
              <img
                src={cover}
                alt=""
                width={768}
                height={512}
                loading="eager"
              />
            )}
            <div>
              <p className="eyebrow">
                {say(language, "LESSON SHOW", "讲解秀")}
              </p>
              <h1>{lesson.title[language]}</h1>
              <p className="lead-small">{lesson.intro[language]}</p>
            </div>
          </div>
        )}
        {slide.kind === "claim" && (
          <blockquote className="show-claim">
            <p className="eyebrow">{say(language, "THE CLAIM", "观点")}</p>
            <p>{e.claim}</p>
          </blockquote>
        )}
        {slide.kind === "experiment" && (
          <div className="show-experiment">
            <ExperimentView
              experiment={e}
              progress={progress}
              language={language}
              interactive={false}
              onScrub={() => {}}
            />
            <p className="experiment-caption">{e.caption(progress)}</p>
          </div>
        )}
        {slide.kind === "evidence" && (
          <div className="show-evidence">
            <p className="eyebrow">
              {say(language, "CALCULATED EVIDENCE", "计算证据")}
            </p>
            <p>{e.result}</p>
            {e.metrics.length > 0 && (
              <dl>
                {e.metrics.map((m) => (
                  <div key={m.label}>
                    <dt>{m.label}</dt>
                    <dd>
                      {fmt(m.value)} {m.unit}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}
        {slide.kind === "transfer" && (
          <div className="show-transfer">
            <p className="eyebrow">{say(language, "A FRESH CASE", "新情境")}</p>
            <p className="pre-line">{e.transfer.question}</p>
            {e.transfer.choices?.map((choice, i) => (
              <p key={i} className="show-choice">
                {i + 1}. {choice}
              </p>
            ))}
          </div>
        )}
        {slide.kind === "takeaway" && (
          <div className="show-takeaway">
            <p className="eyebrow">{say(language, "TAKEAWAY", "要点")}</p>
            <p>{chapter.explanation[language]}</p>
          </div>
        )}
      </div>
      <div className="show-caption">
        <p className="eyebrow">{slide.heading[language]}</p>
        <p className="show-narration" aria-live="polite">
          {narration}
        </p>
      </div>
      <div className="show-controls">
        <button
          type="button"
          className="secondary"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={say(language, "Previous slide", "上一张")}
        >
          ←
        </button>
        <button type="button" onClick={() => setPlaying((p) => !p)}>
          {playing
            ? say(language, "Pause", "暂停")
            : last
              ? say(language, "Play again", "重新播放")
              : say(language, "Play", "播放")}
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => go(index + 1)}
          disabled={last}
          aria-label={say(language, "Next slide", "下一张")}
        >
          →
        </button>
        <span className="show-counter">
          {index + 1} / {show.slides.length}
        </span>
        <label className="show-voice">
          <input
            type="checkbox"
            checked={voice}
            disabled={!speechAvailable()}
            onChange={(event) => setVoice(event.target.checked)}
          />
          {say(language, "Browser voice", "浏览器朗读")}
        </label>
        <button type="button" className="text-button" onClick={onClose}>
          {say(language, "Close show", "关闭讲解秀")}
        </button>
      </div>
      <p className="fine show-credits">
        {scriptModel
          ? say(
              language,
              `Narration written by Meta ${scriptModel}`,
              `旁白由 Meta ${scriptModel} 撰写`,
            )
          : say(language, "Narration by the author", "旁白由作者撰写")}
        {coverModel
          ? say(
              language,
              ` · cover drawn by Meta ${coverModel}`,
              ` · 封面由 Meta ${coverModel} 绘制`,
            )
          : ""}
        {say(
          language,
          " · voice by your browser, not a Meta model · values come from the checked lesson",
          " · 朗读由浏览器完成，不是 Meta 模型 · 数值来自经核验的课程",
        )}
      </p>
    </section>
  );
}
