import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/server.mjs";

// Catches missing icons, incorrect content types and accidental repository exposure.
test("public brand assets are served without authentication with their real content types", async (t) => {
  const server = createApp();
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  t.after(() => new Promise((r) => server.close(r)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const [path, type] of [
    ["/favicon.svg", "image/svg+xml"],
    ["/favicon.ico", "image/x-icon"],
    ["/apple-touch-icon.png", "image/png"],
    ["/brand/share.png", "image/png"],
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get("content-type").startsWith(type));
    assert.ok((await response.arrayBuffer()).byteLength > 50);
  }
  for (const path of [
    "/package.json",
    "/.env.local",
    "/assets/missing.js",
    "/brand/../package.json",
    "/assets/%2e%2e%2fpackage.json",
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 404, path);
  }
});
