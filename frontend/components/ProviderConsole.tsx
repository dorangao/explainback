import { useEffect, useRef, useState, useId } from "react";
import { mountProviderConsole } from "../../public/provider-console.mjs";
import type { Language, Post } from "../lib/types";
export function ProviderConsole({
  post,
  language,
  enabled,
  sessionId,
  busy,
}: {
  post: Post;
  language: Language;
  enabled: boolean;
  sessionId: string | null;
  busy: boolean;
}) {
  const prefix = "studio-trace-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const active = enabled && pageVisible;
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const element = useRef<HTMLDetailsElement>(null);
  const controller = useRef<ReturnType<typeof mountProviderConsole> | null>(
    null,
  );
  useEffect(() => {
    if (!element.current) return;
    const mounted = mountProviderConsole(element.current, post, {
      prefix,
    });
    controller.current = mounted;
    return () => {
      mounted.destroy();
      controller.current = null;
    };
  }, [post]);
  useEffect(() => {
    controller.current?.set({ enabled: active, sessionId, language });
    if (active && sessionId) void controller.current?.refresh();
  }, [active, sessionId, language, busy]);
  useEffect(() => {
    if (!busy || !active || !sessionId) return;
    const id = setInterval(() => void controller.current?.refresh(), 1000);
    return () => clearInterval(id);
  }, [busy, active, sessionId]);
  return (
    <details
      ref={element}
      className="provider-console react-console"
      hidden={!enabled}
    />
  );
}
