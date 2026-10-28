import { useMemo, useState } from "react";
import type { Language, Lesson } from "../lib/types";
import { say } from "../lib/types";
import { lessonChanges } from "../lib/lesson-diff";
import type { RequestMetrics } from "../hooks/useProviderSession";

export function RequestSummary({
  metrics,
  language,
}: {
  metrics: RequestMetrics | null;
  language: Language;
}) {
  if (!metrics) return null;
  const seconds = (metrics.elapsedMs / 1000).toFixed(1);
  const verb = {
    compose: say(language, "drafted this lesson", "起草了这堂课"),
    revise: say(language, "revised this lesson", "修改了这堂课"),
    guide: say(language, "explained this result", "解释了这个结果"),
  }[metrics.mode];
  const tokens =
    metrics.usage && (metrics.usage.input ?? metrics.usage.output) !== null
      ? ` · ${metrics.usage.input ?? "—"} ${say(language, "tokens in", "输入 token")} / ${metrics.usage.output ?? "—"} ${say(language, "out", "输出")}`
      : "";
  return (
    <p className="request-summary" role="status">
      <strong>{metrics.model}</strong> {verb} · {seconds} s · 1{" "}
      {say(language, "request", "次请求")}
      {tokens}
    </p>
  );
}

// Shows what an explicit revision changed, field by field, so the model's
// contribution is visible and reviewable. Pure comparison; no judgement of correctness.
export function RevisionSummary({
  before,
  after,
  language,
  metrics,
  onDismiss,
}: {
  before: Lesson;
  after: Lesson;
  language: Language;
  metrics: RequestMetrics | null;
  onDismiss: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const changes = useMemo(
    () => lessonChanges(before, after, language),
    [before, after, language],
  );
  const visible = showAll ? changes : changes.slice(0, 8);
  return (
    <section
      className="revision-summary"
      aria-labelledby="revision-summary-title"
    >
      <div className="revision-summary-head">
        <div>
          <p className="eyebrow">
            {say(language, "WHAT MUSE CHANGED", "MUSE 改了什么")}
          </p>
          <h2 id="revision-summary-title">
            {changes.length === 0
              ? say(
                  language,
                  "No visible change in this language",
                  "在当前语言下没有可见变化",
                )
              : `${changes.length} ${say(language, changes.length === 1 ? "field changed" : "fields changed", "处修改")}`}
          </h2>
          <RequestSummary metrics={metrics} language={language} />
        </div>
        <button type="button" className="text-button" onClick={onDismiss}>
          {say(language, "Dismiss", "关闭")}
        </button>
      </div>
      {changes.length > 0 && (
        <ul className="revision-changes">
          {visible.map((change) => (
            <li key={change.path} data-kind={change.kind}>
              <span className="revision-label">{change.label[language]}</span>
              {change.kind === "added" ? (
                <ins>{change.after}</ins>
              ) : change.kind === "removed" ? (
                <del>{change.before}</del>
              ) : (
                <>
                  <del>{change.before}</del>
                  <ins>{change.after}</ins>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {changes.length > visible.length && (
        <button
          type="button"
          className="text-button"
          onClick={() => setShowAll(true)}
        >
          {say(language, "Show all changes", "显示全部修改")} (
          {changes.length})
        </button>
      )}
      <p className="fine">
        {say(
          language,
          "Compared field by field in the current language. Switch language to compare the other translation. A listed change is not a verified improvement; review it before presenting.",
          "按当前语言逐字段比较。切换语言可比较另一种译文。列出的修改并不代表经过验证的改进，演示前请审阅。",
        )}
      </p>
    </section>
  );
}
