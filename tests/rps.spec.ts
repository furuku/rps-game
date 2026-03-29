import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // mock API /api/play
  await page.route("**/api/play", async (route) => {
    const body = await route.request().postDataJSON();

    let response;

    if (body.playerAction === "ROCK") {
      response = {
        botAction: "SCISSORS",
        result: "WIN",
        nextYourScore: 1,
        nextHighScore: 1,
      };
    } else if (body.playerAction === "SCISSORS") {
      response = {
        botAction: "SCISSORS",
        result: "DRAW",
        nextYourScore: 0,
        nextHighScore: 0,
      };
    } else {
      response = {
        botAction: "SCISSORS",
        result: "LOSE",
        nextYourScore: 0,
        nextHighScore: 0,
      };
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(response),
    });
  });

  // mock initial highscore
  await page.route("**/api/highscore", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        yourScore: 0,
        highScore: 0,
      }),
    });
  });

  await page.goto(process.env.BASE_URL || "http://localhost:3000");
});

// Test: if win score up
test("should win and increase score", async ({ page }) => {
  await page.click('[data-testid="btn-rock"]');

  await page.waitForTimeout(2100);

  await expect(page.locator('[data-testid="your-score"]')).toHaveText("1");
  await expect(page.locator('[data-testid="high-score"]')).toHaveText("1");
});

// Test: if lose score reset
test("should lose and not increase score", async ({ page }) => {
  await page.click('[data-testid="btn-paper"]');

  await page.waitForTimeout(2100);

  await expect(page.locator('[data-testid="your-score"]')).toHaveText("0");
});

// Test: if draw score not change
test("should draw and keep score the same", async ({ page }) => {
  await page.click('[data-testid="btn-scissors"]');

  await page.waitForTimeout(2100);

  await expect(page.locator('[data-testid="your-score"]')).toHaveText("0");
  await expect(page.locator('[data-testid="high-score"]')).toHaveText("0");
});

// Test: spam click prevent
test("should prevent double click while waiting", async ({ page }) => {
  const button = page.locator('[data-testid="btn-rock"]');

  await button.click();
  await button.click();

  await expect(button).toBeDisabled();
});
