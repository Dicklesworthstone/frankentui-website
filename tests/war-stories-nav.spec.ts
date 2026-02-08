import { test, expect } from "@playwright/test";

test("navbar: /architecture -> /war-stories renders without refresh", async ({ page }) => {
  const baseUrl = process.env.BASE_URL ?? "http://localhost:3100";

  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto(`${baseUrl}/architecture`, { waitUntil: "domcontentloaded" });
  // Historically this navigation failed when leaving the page while scrolled.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(250);

  await page.locator("header").first().getByRole("link", { name: "War Stories" }).click();

  await expect(page).toHaveURL(/\/war-stories\/?$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /war\s+stories/i }).first()
  ).toBeVisible();

  // If navigation "silently fails" due to a runtime exception, this will catch it.
  expect(errors).toEqual([]);
});
