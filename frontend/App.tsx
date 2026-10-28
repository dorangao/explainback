import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./lib/api";
import type { Area, Language } from "./lib/types";
import { say } from "./lib/types";
import { galleryIdFromHash } from "./lib/shared";
import { Brand } from "./components/Brand";
import { Studio } from "./components/Studio";
import { AccessPanel } from "./components/AccessPanel";
const Labs = lazy(() =>
  import("./components/labs/Labs").then((module) => ({
    default: module.Labs,
  })),
);

function readRoute() {
  const hash = location.hash;
  return {
    area: (["#physics", "#quantum", "#create"].includes(hash)
      ? hash.slice(1)
      : "studio") as Area,
    lessonId: galleryIdFromHash(hash) as string | null,
  };
}
export function App() {
  const auth = useAuth();
  const [language, setLanguage] = useState<Language>(() => {
      try {
        return localStorage.getItem("explainback-language") === "zh"
          ? "zh"
          : "en";
      } catch {
        return "en";
      }
    }),
    [route, setRoute] = useState(readRoute),
    [showAccess, setShowAccess] = useState(false),
    [starter, setStarter] = useState(0),
    [libraryVisit, setLibraryVisit] = useState(0),
    [studioBusy, setStudioBusy] = useState(false),
    [physicsBusy, setPhysicsBusy] = useState(false),
    [quantumBusy, setQuantumBusy] = useState(false);
  const invite = useRef<string | null>(null),
    handledInvite = useRef(""),
    firstAuth = useRef(false),
    main = useRef<HTMLElement>(null),
    accessRef = useRef<HTMLDivElement>(null);
  const setLang = useCallback((value: Language) => setLanguage(value), []);
  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = say(
      language,
      "ExplainBack · Learn by explaining",
      "ExplainBack 讲给我听 · 在实验中理解",
    );
    try {
      localStorage.setItem("explainback-language", language);
    } catch {}
  }, [language]);
  useEffect(() => {
    const update = () => {
      const code = /^#invite:([A-Za-z0-9-]{8,64})$/.exec(location.hash)?.[1];
      if (code) {
        invite.current = code;
        history.replaceState(null, "", "#create");
      }
      setRoute(readRoute());
    };
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);
  useEffect(() => {
    if (auth.loading) return;
    const code = invite.current;
    if (!code || handledInvite.current === code) return;
    handledInvite.current = code;
    invite.current = null;
    if (auth.info.authenticated) {
      setStarter((n) => n + 1);
      return;
    }
    if (auth.info.codes)
      void auth.login({ code }).then((ok) => {
        if (ok) {
          setStarter((n) => n + 1);
          setShowAccess(false);
        } else setShowAccess(true);
      });
    else setShowAccess(true);
  }, [
    auth.loading,
    auth.info.authenticated,
    auth.info.codes,
    auth.login,
    route,
  ]);
  useEffect(() => {
    if (auth.info.authenticated) {
      firstAuth.current = true;
      setShowAccess(false);
    } else if (firstAuth.current) {
      setRoute({ area: "studio", lessonId: null });
      history.replaceState(null, "", "#studio");
      firstAuth.current = false;
      setStudioBusy(false);
      setPhysicsBusy(false);
      setQuantumBusy(false);
    }
  }, [auth.info.authenticated]);
  const openAccess = useCallback(() => {
    setShowAccess(true);
    setTimeout(() => accessRef.current?.querySelector("input")?.focus(), 0);
  }, []);
  const login = async (body: unknown) => {
    const ok = await auth.login(body);
    if (ok) {
      setShowAccess(false);
      setRoute({ area: "create", lessonId: null });
      history.replaceState(null, "", "#create");
      setStarter((n) => n + 1);
    }
    return ok;
  };
  const [visited, setVisited] = useState({ physics: false, quantum: false });
  useEffect(() => {
    if (!auth.info.authenticated) {
      setVisited({ physics: false, quantum: false });
      return;
    }
    if (route.area === "physics" || route.area === "quantum")
      setVisited((previous) => ({ ...previous, [route.area]: true }));
  }, [auth.info.authenticated, route.area]);
  const focusRoute = useRef(`${route.area}/${route.lessonId}/${libraryVisit}`);
  useEffect(() => {
    const key = `${route.area}/${route.lessonId}/${libraryVisit}`;
    if (key === focusRoute.current) return;
    focusRoute.current = key;
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [route.area, route.lessonId, libraryVisit]);
  const area = route.area;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {say(language, "Skip to content", "跳到主要内容")}
      </a>
      <header className="site-header">
        <a
          href="#studio"
          onClick={() => setLibraryVisit((n) => n + 1)}
          className="brand-link"
          aria-label="ExplainBack home"
        >
          <Brand />
        </a>
        <nav
          aria-label={say(language, "Main navigation", "主导航")}
          className="main-nav"
        >
          <a
            href="#studio"
            onClick={() => setLibraryVisit((n) => n + 1)}
            aria-current={area === "studio" ? "page" : undefined}
          >
            {say(language, "Explore", "探索")}
          </a>
          <a
            href="#create"
            onClick={() => setLibraryVisit((n) => n + 1)}
            aria-current={area === "create" ? "page" : undefined}
          >
            {say(language, "Create", "创建")}
          </a>
          {auth.info.authenticated && (
            <>
              <a
                href="#physics"
                aria-current={area === "physics" ? "page" : undefined}
              >
                {say(language, "Physics", "物理")}
              </a>
              <a
                href="#quantum"
                aria-current={area === "quantum" ? "page" : undefined}
              >
                {say(language, "Quantum", "量子")}
              </a>
            </>
          )}
        </nav>
        <div className="header-tools">
          <label className="language-switch">
            <span className="sr-only">Language / 语言</span>
            <select
              value={language}
              onChange={(event) => setLang(event.target.value as Language)}
              aria-label="Language / 语言"
            >
              <option value="en">EN · English</option>
              <option value="zh">中 · 中文</option>
            </select>
          </label>
          {auth.info.authenticated && !auth.info.open ? (
            <button
              className="text-button"
              disabled={auth.working}
              onClick={() => void auth.logout()}
            >
              {say(language, "Sign out", "退出登录")}
            </button>
          ) : (
            !auth.info.authenticated && (
              <button
                className="text-button"
                onClick={openAccess}
                disabled={auth.loading}
              >
                {say(language, "Preview access", "预览权限")}
              </button>
            )
          )}
        </div>
      </header>
      {auth.info.authenticated && (auth.status?.access || auth.info.open) && (
        <div className="access-strip" role="status">
          {auth.info.open
            ? say(
                language,
                "Local development · open access",
                "本地开发 · 开放访问",
              )
            : `${auth.status?.access?.label} · ${auth.status?.access?.remaining}/${auth.status?.access?.quota} ${say(language, "live requests left this hour", "次模型请求剩余 / 小时")}`}
          {auth.status?.access?.expiresAt && (
            <span>
              {" "}
              · {say(language, "Expires", "到期")}{" "}
              {new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
                dateStyle: "medium",
              }).format(auth.status.access.expiresAt)}
            </span>
          )}
        </div>
      )}
      <main id="main-content" ref={main} tabIndex={-1}>
        {auth.loading && (
          <p className="connection-note" role="status">
            {say(
              language,
              "Opening your learning studio…",
              "正在打开学习工作室…",
            )}
          </p>
        )}
        <Studio
          key={auth.identity}
          language={language}
          authenticated={auth.info.authenticated}
          status={auth.status}
          post={auth.post}
          visible={!route.lessonId && (area === "studio" || area === "create")}
          view={area === "create" ? "create" : "studio"}
          lessonId={null}
          starter={starter}
          onBusy={setStudioBusy}
          onRequestAccess={openAccess}
        />
        {route.lessonId && (
          <Studio
            key={`gallery-${auth.identity}-${route.lessonId}`}
            language={language}
            authenticated={auth.info.authenticated}
            status={auth.status}
            post={auth.post}
            visible={area === "studio"}
            view="studio"
            lessonId={route.lessonId}
            starter={0}
            onBusy={setStudioBusy}
            onRequestAccess={openAccess}
          />
        )}
        {auth.info.authenticated && auth.status && (
          <Suspense
            fallback={
              <p role="status">
                {say(
                  language,
                  "Opening the experiment bench…",
                  "正在打开实验工作台…",
                )}
              </p>
            }
          >
            {visited.physics && (
              <Labs
                key={`physics-${auth.identity}`}
                kind="physics"
                language={language}
                visible={area === "physics"}
                status={auth.status}
                post={auth.post}
                onBusy={setPhysicsBusy}
                onLanguage={setLang}
              />
            )}
            {visited.quantum && (
              <Labs
                key={`quantum-${auth.identity}`}
                kind="quantum"
                language={language}
                visible={area === "quantum"}
                status={auth.status}
                post={auth.post}
                onBusy={setQuantumBusy}
                onLanguage={setLang}
              />
            )}
          </Suspense>
        )}
        {!auth.loading &&
          !auth.info.authenticated &&
          (area === "physics" || area === "quantum") && (
            <section className="creation-locked">
              <h1>
                {say(language, "Open the experiment bench", "打开实验工作台")}
              </h1>
              <p>
                {say(
                  language,
                  "These guided labs need preview access. Reviewed lessons are open to everyone.",
                  "这些引导演示需要预览权限，经审阅的课程对所有人开放。",
                )}
              </p>
              <button onClick={openAccess}>
                {say(language, "Preview access", "预览权限")}
              </button>
              <a href="#studio">
                {say(language, "Explore lessons", "探索课程")}
              </a>
            </section>
          )}
        {showAccess && (
          <div ref={accessRef}>
            <AccessPanel
              language={language}
              info={auth.info}
              working={auth.working}
              error={auth.error}
              onLogin={login}
              onClose={() => setShowAccess(false)}
            />
          </div>
        )}
        {auth.error && !showAccess && (
          <p className="notice" role="status">
            {say(
              language,
              auth.error === "TESTER_REQUIRED"
                ? "Your session ended. Reviewed lessons remain available."
                : "Connection needs attention. The learning library is still available.",
              auth.error === "TESTER_REQUIRED"
                ? "会话已结束，经审阅的课程仍可使用。"
                : "连接需要检查，互动课程库仍可使用。",
            )}{" "}
            <button className="text-button" onClick={openAccess}>
              {say(language, "Sign in", "登录")}
            </button>
          </p>
        )}
      </main>
      <footer className="site-footer">
        <Brand compact />
        <p>
          {say(
            language,
            "A little curiosity. A clearer explanation.",
            "一点好奇，更清晰的理解。",
          )}
        </p>
        <span>
          {say(
            language,
            "Independent learning prototype",
            "独立开发的学习原型",
          )}
          <br />
          {say(
            language,
            "Synthetic examples · Temporary sessions",
            "虚构示例 · 临时会话",
          )}
        </span>
      </footer>
    </div>
  );
}
