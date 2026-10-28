// Typed surface of the plain-JavaScript engine next to this file. Hand-maintained;
// frontend/lib/engines.test.ts checks the lesson types against the JSON schema.
import type { Language, Post } from "../frontend/lib/types";
export function mountProviderConsole(
  root: HTMLElement,
  post: Post,
  options?: { prefix?: string },
): {
  set(props: { enabled: boolean; sessionId: string | null; language: Language }): void;
  refresh(): Promise<void>;
  destroy(): void;
};
