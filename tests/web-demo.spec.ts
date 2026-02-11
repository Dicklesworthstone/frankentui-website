import { appendFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { test, expect, type Page, type TestInfo } from "@playwright/test";

/* ─── Types ─────────────────────────────────────────────────────── */

type ConsoleEvent = {
  ts: string;
  type: string;
  text: string;
  location: { url?: string; lineNumber?: number; columnNumber?: number };
};

type RequestEvent = {
  ts: string;
  url: string;
  method: string;
  status?: number;
  contentType?: string;
  errorText?: string | null;
};

type DiagnosticRecord = Record<string, unknown>;

/* ─── Diagnostics helpers ───────────────────────────────────────── */

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";

function diagnosticsLogPath() {
  const dir = path.join(process.cwd(), "test-results", "logs");
  mkdirSync(dir, { recursive: true });
  return path.join(dir, "web-demo-e2e.jsonl");
}

function logDiag(record: DiagnosticRecord) {
  appendFileSync(diagnosticsLogPath(), `${JSON.stringify(record)}\n`, "utf8");
}

function elapsed(startMs: number) {
  return Date.now() - startMs;
}

function stepLog(step: string, startMs: number, result: "pass" | "fail" = "pass") {
  const msg = `[web-demo-test] step: ${step}, elapsed: ${elapsed(startMs)}ms, result: ${result}`;
  console.log(msg);
  return msg;
}

/* ─── Expected assets ───────────────────────────────────────────── */

const EXPECTED_WASM_ASSETS = [
  "/web/pkg/FrankenTerm.js",
  "/web/pkg/FrankenTerm_bg.wasm",
  "/web/pkg/ftui_showcase_wasm.js",
  "/web/pkg/ftui_showcase_wasm_bg.wasm",
];

const EXPECTED_FONT_ASSETS = ["/web/fonts/pragmasevka-nf-subset.woff2"];

const EXPECTED_DATA_ASSETS = [
  "/web/assets/shakespeare.txt",
  "/web/assets/sqlite3.c",
];

const ALL_EXPECTED_ASSETS = [
  ...EXPECTED_WASM_ASSETS,
  ...EXPECTED_FONT_ASSETS,
  ...EXPECTED_DATA_ASSETS,
];

/* ─── Shared test context ───────────────────────────────────────── */

function setupCapture(page: Page) {
  const consoleEvents: ConsoleEvent[] = [];
  const requestFailures: RequestEvent[] = [];
  const completedRequests: RequestEvent[] = [];

  page.on("console", (msg) => {
    consoleEvents.push({
      ts: new Date().toISOString(),
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  page.on("requestfailed", (request) => {
    requestFailures.push({
      ts: new Date().toISOString(),
      url: request.url(),
      method: request.method(),
      errorText: request.failure()?.errorText ?? null,
    });
  });

  page.on("requestfinished", (request) => {
    completedRequests.push({
      ts: new Date().toISOString(),
      url: request.url(),
      method: request.method(),
    });
  });

  return { consoleEvents, requestFailures, completedRequests };
}

async function captureFailure(page: Page, testInfo: TestInfo, label: string) {
  if (page.isClosed()) return null;
  try {
    const screenshotPath = testInfo.outputPath(`web-demo-${label}-failure.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════════════
   A. PAGE LOAD TESTS (Chromium with WebGPU)
   ═══════════════════════════════════════════════════════════════════ */

test.describe("A. Page load — Chromium (WebGPU)", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "WebGPU tests require Chromium"
  );
  test.describe.configure({ mode: "serial" });

  test("A1: GET /web returns 200", async ({ page }) => {
    const start = Date.now();
    const response = await page.goto(`${BASE_URL}/web`, {
      waitUntil: "domcontentloaded",
    });
    expect(response?.status()).toBe(200);
    stepLog("GET /web → 200", start);
  });

  test("A2: HTML contains expected DOM elements", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/web`, { waitUntil: "domcontentloaded" });

    // The WASM demo page should have these key elements
    for (const selector of ["canvas", "#error-overlay"]) {
      await expect(page.locator(selector).first()).toBeAttached();
      stepLog(`found ${selector}`, start);
    }

    // Verify WebGPU fallback div is present (injected by sync script)
    await expect(page.locator("#webgpu-fallback")).toBeAttached();
    stepLog("found #webgpu-fallback", start);
  });

  test("A3: Canvas has non-zero dimensions after load", async ({ page }) => {
    test.setTimeout(20_000);
    const start = Date.now();
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });

    // Wait for canvas to be sized (WASM init may take a moment)
    await expect
      .poll(
        async () => {
          return page.evaluate(() => {
            const c = document.querySelector("canvas");
            return c ? c.width * c.height : 0;
          });
        },
        { timeout: 15_000 }
      )
      .toBeGreaterThan(0);

    const dims = await page.evaluate(() => {
      const c = document.querySelector("canvas");
      return c ? { w: c.width, h: c.height } : null;
    });
    stepLog(`canvas dims: ${dims?.w}x${dims?.h}`, start);
  });

  test("A4: No JavaScript console errors during load", async ({ page }) => {
    const start = Date.now();
    const { consoleEvents } = setupCapture(page);
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    // Allow some time for async errors
    await page.waitForTimeout(2_000);

    const errors = consoleEvents.filter((e) => e.type === "error");
    stepLog(`console errors: ${errors.length}`, start, errors.length === 0 ? "pass" : "fail");

    logDiag({
      test: "A4",
      timestamp: new Date().toISOString(),
      console_errors: errors,
      total_console_events: consoleEvents.length,
    });

    expect(errors).toEqual([]);
  });

  test("A5: No failed network requests during load", async ({ page }) => {
    const start = Date.now();
    const { requestFailures } = setupCapture(page);
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(2_000);

    stepLog(`request failures: ${requestFailures.length}`, start, requestFailures.length === 0 ? "pass" : "fail");

    logDiag({
      test: "A5",
      timestamp: new Date().toISOString(),
      request_failures: requestFailures,
    });

    expect(requestFailures).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════════
   B. ASSET LOADING TESTS
   ═══════════════════════════════════════════════════════════════════ */

test.describe("B. Asset loading", () => {
  test("B1: All expected assets load successfully", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Asset loading test requires working WebGPU demo");
    test.setTimeout(20_000);
    const start = Date.now();
    const { completedRequests, requestFailures } = setupCapture(page);

    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(3_000); // let lazy-loaded assets settle

    const loadedUrls = completedRequests.map((r) => new URL(r.url).pathname);

    const missing: string[] = [];
    for (const asset of ALL_EXPECTED_ASSETS) {
      if (!loadedUrls.includes(asset)) {
        missing.push(asset);
      }
    }

    logDiag({
      test: "B1",
      timestamp: new Date().toISOString(),
      expected: ALL_EXPECTED_ASSETS.length,
      loaded: loadedUrls.length,
      missing,
      failures: requestFailures,
    });

    stepLog(`assets: ${ALL_EXPECTED_ASSETS.length - missing.length}/${ALL_EXPECTED_ASSETS.length} loaded`, start, missing.length === 0 ? "pass" : "fail");

    // Some assets (shakespeare.txt, sqlite3.c) may be loaded on-demand by the demo,
    // so only fail on the critical WASM/JS/font assets
    const criticalMissing = missing.filter(
      (m) => m.includes("/pkg/") || m.includes("/fonts/")
    );
    expect(criticalMissing).toEqual([]);
  });

  test("B2: WASM files served with correct Content-Type", async ({ request }) => {
    const start = Date.now();
    const results: { url: string; contentType: string | null; status: number }[] = [];

    for (const wasmPath of EXPECTED_WASM_ASSETS.filter((p) => p.endsWith(".wasm"))) {
      const response = await request.get(`${BASE_URL}${wasmPath}`);
      results.push({
        url: wasmPath,
        contentType: response.headers()["content-type"] ?? null,
        status: response.status(),
      });
    }

    logDiag({ test: "B2", timestamp: new Date().toISOString(), results });

    for (const r of results) {
      expect(r.status).toBe(200);
      expect(r.contentType).toContain("application/wasm");
      stepLog(`${r.url} → ${r.contentType}`, start);
    }
  });

  test("B3: Font served with correct Content-Type", async ({ request }) => {
    const start = Date.now();
    const response = await request.get(`${BASE_URL}${EXPECTED_FONT_ASSETS[0]}`);
    const ct = response.headers()["content-type"] ?? null;
    expect(response.status()).toBe(200);
    // woff2 files can be served as font/woff2 or application/font-woff2
    expect(ct).toMatch(/woff2|font|octet-stream/);
    stepLog(`font content-type: ${ct}`, start);
  });

  test("B4: Static assets have cache headers", async ({ request }) => {
    const start = Date.now();
    const results: { url: string; cacheControl: string | null }[] = [];

    // Test a pkg file and a font file
    for (const assetPath of [EXPECTED_WASM_ASSETS[0], EXPECTED_FONT_ASSETS[0]]) {
      const response = await request.get(`${BASE_URL}${assetPath}`);
      results.push({ url: assetPath, cacheControl: response.headers()["cache-control"] ?? null });
    }

    logDiag({ test: "B4", timestamp: new Date().toISOString(), results });

    for (const r of results) {
      expect(r.cacheControl).toBeTruthy();
      expect(r.cacheControl).toContain("max-age=");
      stepLog(`${r.url} cache: ${r.cacheControl}`, start);
    }
  });
});

/* ═══════════════════════════════════════════════════════════════════
   C. BROWSER COMPATIBILITY TESTS
   ═══════════════════════════════════════════════════════════════════ */

test.describe("C. Browser compatibility", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Only Chromium has WebGPU — skip in other browsers"
  );

  test("C1: Chromium (WebGPU) — fallback div stays hidden", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(1_000);

    // With WebGPU available (Chromium + flags), the fallback should not be visible
    const isVisible = await page.evaluate(() => {
      const fb = document.getElementById("webgpu-fallback");
      return fb?.classList.contains("visible") ?? false;
    });

    stepLog(`webgpu-fallback visible: ${isVisible}`, start, isVisible ? "fail" : "pass");
    expect(isVisible).toBe(false);
  });
});

// Firefox/WebKit-specific tests — only run in those browser projects
test.describe("C. Browser compat — no WebGPU", () => {
  test.skip(
    ({ browserName }) => browserName === "chromium",
    "Skipped in Chromium — WebGPU is available"
  );

  test("C2: Firefox/WebKit — fallback page shown", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(2_000);

    // Without WebGPU, the fallback div should become visible
    const fallbackState = await page.evaluate(() => {
      const fb = document.getElementById("webgpu-fallback");
      if (!fb) return { exists: false, visible: false, hasContent: false };
      return {
        exists: true,
        visible: fb.classList.contains("visible"),
        hasContent: fb.textContent?.includes("WebGPU") ?? false,
      };
    });

    stepLog(`fallback state: ${JSON.stringify(fallbackState)}`, start);

    logDiag({
      test: "C2",
      timestamp: new Date().toISOString(),
      fallbackState,
    });

    expect(fallbackState.exists).toBe(true);
    expect(fallbackState.visible).toBe(true);
    expect(fallbackState.hasContent).toBe(true);
  });

  test("C3: Firefox/WebKit — fallback has nav links", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(2_000);

    const links = await page.evaluate(() => {
      const fb = document.getElementById("webgpu-fallback");
      if (!fb) return [];
      return Array.from(fb.querySelectorAll("a")).map((a) => ({
        href: a.getAttribute("href"),
        text: a.textContent?.trim(),
      }));
    });

    stepLog(`fallback links: ${links.length}`, start);

    logDiag({ test: "C3", timestamp: new Date().toISOString(), links });

    // Should have "Back to FrankenTUI" and "View Screenshots" links
    expect(links.length).toBeGreaterThanOrEqual(2);
    expect(links.some((l) => l.href === "/")).toBe(true);
    expect(links.some((l) => l.href === "/showcase")).toBe(true);
  });
});

/* ═══════════════════════════════════════════════════════════════════
   D. RESPONSIVE TESTS
   ═══════════════════════════════════════════════════════════════════ */

test.describe("D. Responsive", () => {
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "Responsive error checks require WebGPU (Chromium)"
  );

  test("D1: Small viewport — no crash", async ({ page }) => {
    const start = Date.now();
    const { consoleEvents } = setupCapture(page);

    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(2_000);

    const pageErrors = consoleEvents.filter((e) => e.type === "error");
    stepLog(`small viewport errors: ${pageErrors.length}`, start, pageErrors.length === 0 ? "pass" : "fail");
    expect(pageErrors).toEqual([]);
  });

  test("D2: Large viewport — no crash", async ({ page }) => {
    const start = Date.now();
    const { consoleEvents } = setupCapture(page);

    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(2_000);

    const pageErrors = consoleEvents.filter((e) => e.type === "error");
    stepLog(`large viewport errors: ${pageErrors.length}`, start, pageErrors.length === 0 ? "pass" : "fail");
    expect(pageErrors).toEqual([]);
  });
});

/* ═══════════════════════════════════════════════════════════════════
   E. PERFORMANCE TESTS
   ═══════════════════════════════════════════════════════════════════ */

test.describe("E. Performance", () => {
  test("E1: Page loads within 15 seconds", async ({ page }) => {
    test.setTimeout(20_000);
    const start = Date.now();
    const { completedRequests } = setupCapture(page);

    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    const loadTime = elapsed(start);

    stepLog(`page load time: ${loadTime}ms`, start);

    logDiag({
      test: "E1",
      timestamp: new Date().toISOString(),
      load_time_ms: loadTime,
      request_count: completedRequests.length,
    });

    expect(loadTime).toBeLessThan(15_000);
  });

  test("E2: Page weight — log total transferred bytes", async ({ page }) => {
    test.setTimeout(20_000);
    const start = Date.now();
    const responseSizes: { url: string; size: number }[] = [];

    page.on("response", (response) => {
      void response.body().then(
        (buf) => {
          responseSizes.push({
            url: new URL(response.url()).pathname,
            size: buf.length,
          });
        },
        () => {
          /* response body not available for some requests */
        }
      );
    });

    await page.goto(`${BASE_URL}/web`, { waitUntil: "load" });
    await page.waitForTimeout(3_000);

    const totalBytes = responseSizes.reduce((sum, r) => sum + r.size, 0);
    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

    stepLog(`total page weight: ${totalMB}MB (${responseSizes.length} resources)`, start);

    logDiag({
      test: "E2",
      timestamp: new Date().toISOString(),
      total_bytes: totalBytes,
      total_mb: totalMB,
      resource_count: responseSizes.length,
      top_resources: responseSizes
        .sort((a, b) => b.size - a.size)
        .slice(0, 10)
        .map((r) => ({ path: r.url, size_kb: (r.size / 1024).toFixed(1) })),
    });

    // Just log — don't enforce a strict limit since WASM bundles are large
    test.info().annotations.push({
      type: "page_weight",
      description: `${totalMB}MB across ${responseSizes.length} resources`,
    });
  });
});

/* ═══════════════════════════════════════════════════════════════════
   F. INTEGRATION WITH MAIN SITE
   ═══════════════════════════════════════════════════════════════════ */

test.describe("F. Main site integration", () => {
  test("F1: /web link exists in site header nav", async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    const demoLink = page.locator('header a[href="/web"]');
    await expect(demoLink.first()).toBeAttached();
    stepLog("Live Demo nav link found", start);
  });

  test("F2: Navigating /web from main site works", async ({ page }) => {
    test.setTimeout(15_000);
    const start = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });

    // The /web link navigates to a static HTML page (full page nav, not SPA)
    // Use Promise.all to handle navigation + click together
    await Promise.all([
      page.waitForURL("**/web**", { timeout: 10_000 }),
      page.locator('header a[href="/web"]').first().click(),
    ]);

    expect(page.url()).toContain("/web");
    await expect(page.locator("canvas").first()).toBeAttached({ timeout: 10_000 });
    stepLog("navigation from main site to /web works", start);
  });

  test("F3: version.json is accessible", async ({ page }) => {
    const start = Date.now();
    const response = await page.goto(`${BASE_URL}/web/version.json`);
    expect(response?.status()).toBe(200);

    const json = await response?.json();
    expect(json).toHaveProperty("synced_at");
    expect(json).toHaveProperty("file_count");
    expect(json).toHaveProperty("files");
    stepLog(`version.json: ${json?.file_count} files, synced ${json?.synced_at}`, start);
  });
});
