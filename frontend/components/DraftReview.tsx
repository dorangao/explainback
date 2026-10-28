import { useState, useId } from "react";
import type { Lesson, Language, Demo } from "../lib/types";
import { say } from "../lib/types";
import {
  validateLesson,
  lessonLanguageWarnings,
  chapterExperiment,
} from "../lib/shared";
function Definition({
  demo,
  language,
  value,
  onEdit,
  onApply,
  onDiscard,
  busy,
}: {
  demo: Demo;
  language: Language;
  value?: string;
  onEdit: (value: string) => void;
  onApply: () => void;
  onDiscard: () => void;
  busy: boolean;
}) {
  return (
    <details className="definition" open>
      <summary>
        {say(language, "Review the generated demo", "审阅生成的演示")}
      </summary>
      <p>{demo.assumptions[language]}</p>
      {demo.kind === "model" ? (
        <>
          <p className="fine">
            {demo.axis.label[language]}: {demo.axis.min} → {demo.axis.max}{" "}
            {demo.axis.unit}
          </p>
          <div className="formula-list">
            {demo.outputs.map((o) => (
              <div key={o.id}>
                <span>
                  {o.label[language]} · {o.unit}
                </span>
                <code>{o.expression}</code>
              </div>
            ))}
          </div>
          <dl className="input-ranges">
            {demo.inputs.map((i) => (
              <div key={i.id}>
                <dt>{i.label[language]}</dt>
                <dd>
                  {i.min}–{i.max} {i.unit} ·{" "}
                  {say(language, "starts at", "初值")} {i.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <>
          <ol>
            {demo.stages.map((s, i) => (
              <li key={i}>
                <strong>{s.title[language]}</strong> — {s.detail[language]}
              </li>
            ))}
          </ol>
          <details>
            <summary>
              {say(language, "Review the authored answer", "审阅创作的答案")}
            </summary>
            <p>{demo.transfer.question[language]}</p>
            <p>{demo.transfer.choices[demo.transfer.answer][language]}</p>
            <p>{demo.transfer.rationale[language]}</p>
          </details>
        </>
      )}
      <details className="definition-editor">
        <summary>
          {say(
            language,
            "Edit formulas, controls or steps (JSON)",
            "编辑公式、控件或步骤（JSON）",
          )}
        </summary>
        <label>
          {say(language, "Bilingual demo definition", "双语演示定义")}
          <textarea
            value={value ?? JSON.stringify(demo, null, 2)}
            onChange={(e) => onEdit(e.target.value)}
            maxLength={24000}
            rows={12}
            disabled={busy}
            spellCheck={false}
          />
        </label>
        <div className="actions">
          <button
            type="button"
            className="secondary"
            onClick={onApply}
            disabled={busy || value === undefined}
          >
            {say(language, "Validate & apply definition", "验证并应用定义")}
          </button>
          <button
            type="button"
            className="text-button"
            onClick={onDiscard}
            disabled={busy || value === undefined}
          >
            {say(language, "Discard definition edits", "放弃定义编辑")}
          </button>
        </div>
      </details>
    </details>
  );
}
export function DraftReview({
  draft,
  language,
  busy,
  reviewed,
  setReviewed,
  onChange,
  onPresent,
  onExport,
  onClose,
  onRevise,
  canRequest,
}: {
  draft: Lesson;
  language: Language;
  busy: boolean;
  reviewed: boolean;
  setReviewed: (v: boolean) => void;
  onChange: (v: Lesson) => void;
  onPresent: () => void;
  onExport: () => void;
  onClose: () => void;
  onRevise: (value: string) => void;
  canRequest: boolean;
}) {
  const formId = useId();
  const [pending, setPending] = useState<Record<number, string>>({}),
    [error, setError] = useState(""),
    [revision, setRevision] = useState("");
  const generated = draft.chapters.some((c) => c.demo),
    hasPending = Object.keys(pending).length > 0,
    warnings = lessonLanguageWarnings(draft);
  const change = (mutate: (value: Lesson) => void) => {
    const next = structuredClone(draft);
    mutate(next);
    onChange(next);
  };
  function apply(index: number) {
    try {
      const next = structuredClone(draft);
      next.chapters[index].demo = JSON.parse(pending[index]);
      onChange(validateLesson(next));
      setPending((p) => {
        const n = { ...p };
        delete n[index];
        return n;
      });
      setError("");
    } catch {
      setError(
        say(
          language,
          "Definition rejected. Check both languages, ranges and formulas. Your last valid definition is preserved.",
          "定义未通过。请检查双语文字、范围和公式。上一次有效定义已保留。",
        ),
      );
    }
  }
  const editChapter = (
    index: number,
    key: "framing" | "explanation",
    value: string,
  ) =>
    change((next) => {
      next.chapters[index][key][language] = value;
    });
  return (
    <section className="draft-review" aria-labelledby={`${formId}-title`}>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">
            {say(language, "02 / REVIEW & REFINE", "02 / 审阅与修改")}
          </p>
          <h2 id={`${formId}-title`}>{draft.title[language]}</h2>
        </div>
        <button className="text-button" disabled={busy} onClick={onClose}>
          {say(language, "Close lesson", "关闭课程")}
        </button>
      </div>
      <p className="lead-small">{draft.intro[language]}</p>
      <p className="review-notice">
        {say(
          language,
          "Check the teaching text, formulas and assumptions. Structure and arithmetic checks do not establish scientific accuracy.",
          "请检查教学文字、公式与假设。结构与算术检查不代表科学正确。",
        )}
      </p>
      {warnings.length > 0 && (
        <p className="notice" role="status">
          {say(
            language,
            "Check both translations: unexpected Cyrillic text in ",
            "请检查两种译文，以下字段出现了西里尔文字：",
          )}
          {warnings.join(", ")}
        </p>
      )}
      <div className="review-chapters">
        {draft.chapters.map((chapter, index) => (
          <article
            className="review-chapter"
            key={`${index}-${chapter.experiment}`}
          >
            <div className="chapter-heading">
              <span className="chapter-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>
                {chapter.demo?.title[language] ??
                  chapterExperiment(chapter, 0, language).title}
              </h3>
              <div className="actions">
                <button
                  className="text-button"
                  disabled={busy || index === 0 || hasPending}
                  onClick={() =>
                    change((next) => {
                      [next.chapters[index - 1], next.chapters[index]] = [
                        next.chapters[index],
                        next.chapters[index - 1],
                      ];
                    })
                  }
                >
                  {say(language, "Move up", "上移")}
                </button>
                <button
                  className="text-button"
                  disabled={busy || draft.chapters.length === 1 || hasPending}
                  onClick={() =>
                    change((next) => {
                      next.chapters.splice(index, 1);
                    })
                  }
                >
                  {say(language, "Remove", "移除")}
                </button>
              </div>
            </div>
            <p>{chapter.framing[language]}</p>
            <blockquote>
              {chapter.demo?.claim[language] ??
                chapterExperiment(chapter, 0, language).claim}
            </blockquote>
            {chapter.demo && (
              <Definition
                demo={chapter.demo}
                language={language}
                value={pending[index]}
                busy={busy}
                onEdit={(value) => {
                  setPending((p) => ({ ...p, [index]: value }));
                  setReviewed(false);
                }}
                onApply={() => apply(index)}
                onDiscard={() => {
                  setPending((p) => {
                    const n = { ...p };
                    delete n[index];
                    return n;
                  });
                  setReviewed(false);
                }}
              />
            )}
          </article>
        ))}
      </div>
      <details className="edit-text">
        <summary>{say(language, "Edit lesson text", "编辑课程文字")}</summary>
        <div className="form-grid">
          <label>
            {say(language, "Lesson title", "课程标题")}
            <input
              value={draft.title[language]}
              onChange={(e) =>
                change((next) => {
                  next.title[language] = e.target.value;
                })
              }
              maxLength={80}
              disabled={busy}
            />
          </label>
          <label>
            {say(language, "Introduction", "简介")}
            <textarea
              value={draft.intro[language]}
              onChange={(e) =>
                change((next) => {
                  next.intro[language] = e.target.value;
                })
              }
              maxLength={200}
              rows={2}
              disabled={busy}
            />
          </label>
        </div>
        {draft.chapters.map((chapter, index) => (
          <fieldset key={index}>
            <legend>
              {index + 1} · {say(language, "Chapter text", "章节文字")}
            </legend>
            {(["framing", "explanation"] as const).map((key) => (
              <label key={key}>
                {say(
                  language,
                  key === "framing"
                    ? "Scene / question"
                    : "Explanation after testing",
                  key === "framing" ? "情境 / 问题" : "实验后的解释",
                )}
                <textarea
                  value={chapter[key][language]}
                  onChange={(e) => editChapter(index, key, e.target.value)}
                  maxLength={key === "framing" ? 180 : 260}
                  rows={3}
                  disabled={busy}
                />
              </label>
            ))}
          </fieldset>
        ))}
      </details>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {canRequest && (
        <section className="revision-section">
          <label htmlFor={`${formId}-revision`}>
            {say(language, "Ask Muse to revise this draft", "让 Muse 修改草稿")}
          </label>
          <textarea
            id={`${formId}-revision`}
            value={revision}
            onChange={(e) => setRevision(e.target.value)}
            maxLength={600}
            rows={2}
            placeholder={say(
              language,
              "One change: simplify the explanation, add an output, correct an assumption…",
              "一个修改：简化解释、添加输出、修正假设…",
            )}
            disabled={busy}
          />
          <button
            className="secondary"
            disabled={busy || hasPending || !revision.trim()}
            onClick={() => onRevise(revision)}
          >
            {say(language, "Revise lesson & demo", "修改课程与演示")}
          </button>
        </section>
      )}
      {generated && (
        <label className="review-check">
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
            disabled={busy || hasPending}
          />
          <span>
            {say(
              language,
              "I reviewed the demo definition and its assumptions for this presentation.",
              "我已审阅本次演示的定义与假设。",
            )}
          </span>
        </label>
      )}
      {hasPending && (
        <p className="notice">
          {say(
            language,
            "Apply or discard definition edits before presenting, revising or exporting.",
            "演示、修改或导出前，请应用或放弃定义编辑。",
          )}
        </p>
      )}
      <div className="actions review-actions">
        <button
          disabled={busy || hasPending || (generated && !reviewed)}
          onClick={onPresent}
        >
          {say(language, "Present this lesson →", "开始演示 →")}
        </button>
        <button
          className="secondary"
          disabled={busy || hasPending}
          onClick={onExport}
        >
          {say(language, "Export lesson JSON", "导出课程 JSON")}
        </button>
      </div>
    </section>
  );
}
