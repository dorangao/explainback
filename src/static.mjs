import { readFile } from "node:fs/promises";
export const brandFiles = new Map([
  ["/favicon.svg", "image/svg+xml"],
  ["/favicon.ico", "image/x-icon"],
  ["/apple-touch-icon.png", "image/png"],
  ["/brand/mark.svg", "image/svg+xml"],
  ["/brand/share.png", "image/png"],
  ["/gallery/pendulum-sketch.png", "image/png"],
]);
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
export async function serveBrand(req, res, extraHeaders = {}) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  const path = new URL(req.url, "http://localhost").pathname,
    type = brandFiles.get(path);
  if (!type) return false;
  try {
    const data = await readFile(new URL("../public" + path, import.meta.url));
    res.writeHead(200, { ...headers, ...extraHeaders, "Content-Type": type });
    res.end(req.method === "HEAD" ? undefined : data);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
export async function serveFrontend(req, res, extraHeaders = {}) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;
  if (await serveBrand(req, res, extraHeaders)) return true;
  const path = new URL(req.url, "http://localhost").pathname;
  // One flat generated assets directory. No encoded separators, dot segments, maps or arbitrary repository paths.
  const asset = /^\/assets\/[a-zA-Z0-9_-]+\.(js|css|woff2|png|svg)$/.exec(path);
  if (
    path !== "/" &&
    path !== "/index.html" &&
    path !== "/robots.txt" &&
    !asset
  )
    return false;
  const type =
    path === "/robots.txt"
      ? "text/plain; charset=utf-8"
      : asset
        ? {
            js: "text/javascript; charset=utf-8",
            css: "text/css; charset=utf-8",
            woff2: "font/woff2",
            png: "image/png",
            svg: "image/svg+xml",
          }[asset[1]]
        : "text/html; charset=utf-8";
  try {
    const data = await readFile(
      new URL(
        "../dist" + (path === "/" ? "/index.html" : path),
        import.meta.url,
      ),
    );
    res.writeHead(200, { ...headers, ...extraHeaders, "Content-Type": type });
    res.end(req.method === "HEAD" ? undefined : data);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}
