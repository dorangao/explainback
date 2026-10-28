import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { Studio } from "./Studio";
import type { Post, Status } from "../lib/types";
import { coolingLesson, processLesson } from "../../test-support/generated-lessons.mjs";

afterEach(cleanup);
const status: Status = {
  configured: true,
  models: [{ id: "meta:test", label: "Test", provider: "meta", model: "test", configured: true, timeoutMs: 100 }],
  defaultModel: "meta:test",
  traceEnabled: false,
  access: null,
  problems: [],
};
function mount(overrides: Partial<Parameters<typeof Studio>[0]> = {}, post?: Post) {
  const calls: string[] = [];
  const fakePost: Post =
    post ??
    (async (path) => {
      calls.push(path);
      return { records: [] } as never;
    });
  const props = {
    language: "en" as const,
    authenticated: false,
    status: null,
    post: fakePost,
    visible: true,
    view: "studio" as const,
    lessonId: null,
    starter: 0,
    onBusy: () => {},
    onRequestAccess: () => {},
    ...overrides,
  };
  const view = render(<Studio {...props} />);
  return { ...view, calls, props, rerender: (next: Partial<typeof props>) => view.rerender(<Studio {...props} {...next} />) };
}

describe("Studio gallery playback", () => {
  it("opens a reviewed lesson signed out, completes it locally and keeps progress across a language change", async () => {
    const { calls, rerender } = mount({ lessonId: "web-cache" });
    expect(await screen.findByRole("heading", { name: /Loading a web page with a cache/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^Disagree$/ }));
    fireEvent.click(screen.getByRole("button", { name: /Test this claim/ }));
    fireEvent.click(screen.getByRole("button", { name: /Show final state/ }));
    fireEvent.click(screen.getByRole("button", { name: /Explain the result/ }));
    expect(screen.queryByRole("button", { name: /Ask the model/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Try a fresh case/ }));
    rerender({ language: "zh" });
    expect(screen.getByRole("heading", { name: /使用缓存加载网页/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /^发送条件请求/ }));
    expect(await screen.findByText(/与本模型的结果相符/)).toBeTruthy();
    expect(calls.filter((c) => c.startsWith("/api/studio"))).toEqual([]);
  });
});

describe("Studio authoring", () => {
  it("creates a draft through one explicit request, needs review before presenting, and edits revoke review", async () => {
    const posted: { path: string; body: unknown }[] = [];
    const post: Post = async (path, body) => {
      posted.push({ path, body });
      if (path === "/api/studio/session") return { sessionId: "s1", attemptsRemaining: 8 } as never;
      if (path === "/api/studio/compose")
        return { status: "ready", lesson: coolingLesson(), message: { en: "Ready", zh: "已就绪" }, attemptsRemaining: 7, model: "test", elapsedMs: 1200, usage: { input: 10, output: 20 } } as never;
      return { records: [] } as never;
    };
    mount({ authenticated: true, status, view: "create" }, post);
    fireEvent.change(screen.getByLabelText(/What would you like to explore/), { target: { value: "Cooling coffee" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a lesson/ }));
    expect(await screen.findByText(/Draft ready/)).toBeTruthy();
    expect(posted.map((p) => p.path)).toEqual(["/api/studio/session", "/api/studio/compose"]);
    const present = await screen.findByRole("button", { name: /Present/ });
    await waitFor(() => expect(document.body.textContent).toMatch(/test drafted this lesson · 1\.2 s · 1 request · 10 tokens in \/ 20 out/));
    expect((present as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("checkbox", { name: /reviewed/i }));
    expect((present as HTMLButtonElement).disabled).toBe(false);
    const title = screen.getByLabelText(/Lesson title/);
    fireEvent.change(title, { target: { value: "Revised title" } });
    expect((screen.getByRole("button", { name: /Present/ }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("shows what a revision changed, field by field, and dismisses it", async () => {
    let n = 0;
    const post: Post = async (path) => {
      if (path === "/api/studio/session") return { sessionId: "s1", attemptsRemaining: 8 } as never;
      if (path === "/api/studio/compose") {
        n++;
        const lesson = coolingLesson();
        if (n === 2) {
          lesson.title.en = "Why coffee cooling slows down";
          lesson.chapters[0].demo.inputs[0].max = 95;
        }
        return { status: "ready", lesson, message: { en: "", zh: "" }, attemptsRemaining: 8 - n, model: "test", elapsedMs: 900, usage: null } as never;
      }
      return { records: [] } as never;
    };
    mount({ authenticated: true, status, view: "create" }, post);
    fireEvent.change(screen.getByLabelText(/What would you like to explore/), { target: { value: "Cooling" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a lesson/ }));
    await screen.findByText(/Draft ready/);
    fireEvent.change(screen.getByLabelText(/Ask Muse to revise/i), { target: { value: "Rename the title and cap the initial temperature." } });
    fireEvent.click(screen.getByRole("button", { name: /Revise/ }));
    const summary = await screen.findByRole("heading", { name: /2 fields changed/ });
    const panel = summary.closest("section")!;
    expect(within(panel).getByText("Lesson title")).toBeTruthy();
    expect(within(panel).getByText("Cooling coffee")).toBeTruthy();
    expect(within(panel).getByText("Why coffee cooling slows down")).toBeTruthy();
    expect(within(panel).getByText("Input initial max")).toBeTruthy();
    expect(panel.textContent).toMatch(/test revised this lesson · 0\.9 s · 1 request/);
    fireEvent.click(within(panel).getByRole("button", { name: /Dismiss/ }));
    expect(screen.queryByRole("heading", { name: /fields changed/ })).toBeNull();
  });
  it("discards a late compose reply after the language changes and keeps no draft", async () => {
    let release: (() => void) | null = null;
    const post: Post = async (path) => {
      if (path === "/api/studio/session") return { sessionId: "s1", attemptsRemaining: 8 } as never;
      if (path === "/api/studio/compose") {
        await new Promise<void>((r) => (release = r));
        return { status: "ready", lesson: processLesson(), message: { en: "", zh: "" }, attemptsRemaining: 7 } as never;
      }
      return { records: [] } as never;
    };
    const { rerender } = mount({ authenticated: true, status, view: "create" }, post);
    fireEvent.change(screen.getByLabelText(/What would you like to explore/), { target: { value: "Web" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a lesson/ }));
    await waitFor(() => expect(release).not.toBeNull());
    rerender({ language: "zh" });
    expect(await screen.findByText(/语言已切换/)).toBeTruthy();
    await act(async () => {
      release!();
      await Promise.resolve();
    });
    expect(screen.queryByRole("button", { name: /开始演示|Present/ })).toBeNull();
    expect(screen.getByLabelText(/你想探索什么/)).toBeTruthy();
  });
});

describe("Studio generated lesson player", () => {
  it("changing a parameter resets the prediction and keeps the value across a language change", async () => {
    const post: Post = async (path) => {
      if (path === "/api/studio/session") return { sessionId: "s1", attemptsRemaining: 8 } as never;
      if (path === "/api/studio/compose") return { status: "ready", lesson: coolingLesson(), message: { en: "", zh: "" }, attemptsRemaining: 7 } as never;
      return { records: [] } as never;
    };
    const { rerender } = mount({ authenticated: true, status, view: "create" }, post);
    fireEvent.change(screen.getByLabelText(/What would you like to explore/), { target: { value: "Cooling" } });
    fireEvent.click(screen.getByRole("button", { name: /Create a lesson/ }));
    await screen.findByText(/Draft ready/);
    fireEvent.click(await screen.findByRole("checkbox", { name: /reviewed/i }));
    fireEvent.click(screen.getByRole("button", { name: /Present this lesson/ }));
    fireEvent.click(await screen.findByRole("button", { name: /^Agree$/ }));
    fireEvent.click(screen.getByRole("button", { name: /Test this claim/ }));
    const initial = screen.getByRole("spinbutton", { name: /Initial temperature/ });
    // Numeric inputs commit on blur so a half-typed value never resets the prediction.
    fireEvent.change(initial, { target: { value: "90" } });
    fireEvent.blur(initial, { target: { value: "90" } });
    expect(await screen.findByRole("button", { name: /^Agree$/ })).toBeTruthy();
    rerender({ language: "zh" });
    expect((screen.getByRole("spinbutton", { name: /初始温度/ }) as HTMLInputElement).value).toBe("90");
  });
});
vi.stubGlobal("scrollTo", () => {});
