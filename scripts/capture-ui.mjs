// Local, synthetic screenshots for reviewing the production bundle. Never contacts a provider.
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
const server = spawn(process.execPath, ["scripts/browser-test-server.mjs"], {
  stdio: "ignore",
});
let browser;
try {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const response = await fetch("http://127.0.0.1:4187/api/auth");
      if (response.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await mkdir("output/ui-review", { recursive: true });
  await page.goto("http://127.0.0.1:4187/");
  await page
    .getByRole("heading", { name: "Find a question. Try it for yourself." })
    .waitFor();
  await page.screenshot({
    path: "output/ui-review/library-desktop-en.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Language / 语言").selectOption("zh");
  await page.screenshot({
    path: "output/ui-review/library-mobile-zh.png",
    fullPage: true,
  });
  await page.locator(".lesson-link").first().click();
  await page.locator(".lesson-player").waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "output/ui-review/player-mobile-zh.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel("Language / 语言").selectOption("en");
  await page.goto("http://127.0.0.1:4187/#invite:BROWSER-TEST-CODE");
  await page.getByLabel("What would you like to explore?").waitFor();
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "output/ui-review/create-desktop-en.png",
    fullPage: true,
  });
  if (errors.length) throw Error(errors.join("\n"));
  console.log("Captured four UI screens without browser errors.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
