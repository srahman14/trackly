const FETCH_TIMEOUT_MS = 8000;
// guard against huge/malicious responses
const MAX_HTML_BYTES = 3_000_000; 

export type FetchPageResult =
  | { ok: true; html: string; finalUrl: string }
  | { ok: false; reason: "timeout" | "http_error" | "not_html" | "network_error"; status?: number };

export async function fetchPage(url: string): Promise<FetchPageResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "TracklyBot/1.0 (+privacy-policy analysis; portfolio project)",
        Accept: "text/html",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return { ok: false, reason: "http_error", status: res.status };

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return { ok: false, reason: "not_html" };
    }

    const html = await res.text();
    if (html.length > MAX_HTML_BYTES) {
      // reuse; not worth a new variant yet
      return { ok: false, reason: "not_html" }; 
    }

    return { ok: true, html, finalUrl: res.url };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === "AbortError") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "network_error" };
  }
}