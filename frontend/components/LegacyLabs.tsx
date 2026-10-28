import { useEffect, useRef } from "react";
import type { Language, Post, Status } from "../lib/types";
import { say } from "../lib/types";
import { mountPhysicsLab } from "../../public/physics-controller.mjs";
import { mountQuantumLab } from "../../public/quantum-view.mjs";
import physicsMarkup from "../legacy/physics.html?raw";
export function LegacyLabs({
  kind,
  language,
  visible,
  status,
  post,
  onBusy,
  onLanguage,
}: {
  kind: "physics" | "quantum";
  language: Language;
  visible: boolean;
  status: Status;
  post: Post;
  onBusy: (v: boolean) => void;
  onLanguage: (v: Language) => void;
}) {
  type Controller = {
    set: (props: Record<string, unknown>) => void;
    destroy: () => void;
  };
  const mountPhysics = mountPhysicsLab as unknown as (
    root: HTMLElement,
    props: {
      post: Post;
      onBusy: (v: boolean) => void;
      onLanguage: (v: Language) => void;
    },
  ) => Controller;
  const mountQuantum = mountQuantumLab as unknown as (
    root: HTMLElement,
    props: { post: Post; onBusy: (v: boolean) => void },
  ) => Controller;
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<{
    set: (props: Record<string, unknown>) => void;
    destroy: () => void;
  } | null>(null);
  useEffect(() => {
    if (!root.current) return;
    if (kind === "physics") {
      root.current.innerHTML = physicsMarkup;
      controller.current = mountPhysics(root.current, {
        post,
        onBusy,
        onLanguage,
      });
    } else
      controller.current = mountQuantum(root.current, {
        post,
        onBusy,
      }) as unknown as typeof controller.current;
    return () => {
      controller.current?.destroy();
      controller.current = null;
    };
  }, [kind, post, onBusy, onLanguage]);
  useEffect(() => {
    controller.current?.set({
      visible,
      language,
      authenticated: true,
      traceEnabled: status.traceEnabled,
      targets: status.models,
      defaultModel: status.defaultModel,
      problems: status.problems,
    });
  }, [visible, language, status]);
  return (
    <section className="legacy-workspace" hidden={!visible}>
      <div className="workspace-heading">
        <div>
          <p className="eyebrow">
            {say(language, "THE EXPERIMENT BENCH", "实验工作台")}
          </p>
          <h1>
            {say(
              language,
              kind === "physics" ? "Physics & math" : "Quantum computing",
              kind === "physics" ? "物理与数学" : "量子计算",
            )}
          </h1>
        </div>
        <a className="back-link" href="#studio">
          {say(language, "Explore lessons", "探索课程")} ↗
        </a>
      </div>
      <div
        ref={root}
        className={
          kind === "quantum" ? "quantum-area legacy-root" : "legacy-root"
        }
      />
    </section>
  );
}
