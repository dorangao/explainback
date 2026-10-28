import { useState } from "react";
import type { AuthInfo, Language } from "../lib/types";
import { say } from "../lib/types";
export function AccessPanel({
  language,
  info,
  working,
  error,
  onLogin,
  onClose,
}: {
  language: Language;
  info: AuthInfo;
  working: boolean;
  error: string;
  onLogin: (body: unknown) => Promise<boolean>;
  onClose: () => void;
}) {
  const [code, setCode] = useState(""),
    [username, setUsername] = useState(""),
    [password, setPassword] = useState("");
  const errors: Record<string, [string, string]> = {
    NETWORK: ["Could not connect. Please try again.", "无法连接，请重试。"],
    TESTER_CREDENTIALS: [
      "That username or password did not match.",
      "用户名或密码不匹配。",
    ],
    ACCESS_CODE: [
      "This code is invalid or has expired.",
      "访问码无效或已过期。",
    ],
    TESTER_REQUIRED: [
      "Your session ended. Sign in to continue creating.",
      "会话已结束，登录后继续创建。",
    ],
    TESTER_RATE: [
      "Too many attempts. Try again in a minute.",
      "尝试次数过多，请一分钟后重试。",
    ],
    TESTER_CAPACITY: [
      "Preview sessions are full. Please try again later.",
      "预览会话已满，请稍后重试。",
    ],
  };
  return (
    <section className="access-panel" aria-labelledby="access-title">
      <button
        className="text-button close-access"
        onClick={onClose}
        aria-label={say(language, "Close sign-in", "关闭登录")}
      >
        ×
      </button>
      <p className="eyebrow">
        {say(language, "YOUR NEXT QUESTION", "你的下一个问题")}
      </p>
      <h2 id="access-title">
        {say(
          language,
          "Make a lesson of your own.",
          "把你的问题，变成一堂课。",
        )}
      </h2>
      <p>
        {say(
          language,
          "Creating with Muse needs preview access. The learning library is always open.",
          "使用 Muse 创建课程需要预览权限，互动课程库始终开放。",
        )}
      </p>
      {info.codes && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (await onLogin({ code: code.trim() })) setCode("");
          }}
        >
          <label htmlFor="reviewer-code">
            {say(language, "Reviewer access code", "评审访问码")}
          </label>
          <div className="code-row">
            <input
              id="reviewer-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={64}
              required
              disabled={working}
            />
            <button disabled={working}>
              {say(
                language,
                working ? "Signing in…" : "Open Studio →",
                working ? "正在登录…" : "进入工作室 →",
              )}
            </button>
          </div>
        </form>
      )}
      {info.configured && (
        <details className="account-details" open={!info.codes}>
          <summary>
            {say(language, "Sign in with a tester account", "使用测试账号登录")}
          </summary>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await onLogin({ username, password });
              setPassword("");
              if (ok) setUsername("");
            }}
          >
            <label htmlFor="username">
              {say(language, "Username", "用户名")}
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              maxLength={80}
              required
              disabled={working}
            />
            <label htmlFor="password">
              {say(language, "Password", "密码")}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              maxLength={512}
              required
              disabled={working}
            />
            <button disabled={working}>
              {say(
                language,
                working ? "Signing in…" : "Sign in",
                working ? "正在登录…" : "登录",
              )}
            </button>
          </form>
        </details>
      )}
      {!info.codes && !info.configured && (
        <p className="notice">
          {say(
            language,
            "Creation access is not configured on this server. You can still explore every reviewed lesson.",
            "此服务尚未配置创建权限，你仍可探索所有经审阅的课程。",
          )}
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {(errors[error] ?? errors.NETWORK)[language === "zh" ? 1 : 0]}
        </p>
      )}
      <p className="fine">
        {say(
          language,
          "Use synthetic examples. Keep personal and student information out.",
          "请使用虚构示例，不输入真实个人或学生资料。",
        )}
      </p>
    </section>
  );
}
