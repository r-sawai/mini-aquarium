import path from "path";
import { test, expect } from "@playwright/test";
import { EVIDENCE_SCENARIOS, SCREENSHOTS_DIR } from "./evidence.config";

function screenshotPath(scenarioId: string): string {
  const scenario = EVIDENCE_SCENARIOS.find((s) => s.id === scenarioId);
  if (!scenario) throw new Error(`Unknown evidence scenario: ${scenarioId}`);
  return path.join(process.cwd(), SCREENSHOTS_DIR, scenario.file);
}

test.describe("スモークテスト & 証跡取得", () => {
  test("初期表示: 水槽が描画される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();
    // 3Dシーンの初期レンダリングが安定するまで少し待つ
    await page.waitForTimeout(1000);

    await page.screenshot({ path: screenshotPath("initial-load") });
  });

  test("エサやり: エサを投下すると魚が反応する", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "エサをあげる" }).click();
    // エサ投下後、魚が反応するまで少し待つ
    await page.waitForTimeout(1500);

    await page.screenshot({ path: screenshotPath("feeding") });
  });

  test("設定ダイアログ: 設定画面が開く", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();

    await page.getByTitle("水槽の設定").click();
    await expect(
      page.getByRole("heading", { name: "水槽の設定" }),
    ).toBeVisible();

    await page.screenshot({ path: screenshotPath("settings-dialog") });
  });

  test("観賞モード: UIを非表示にできる", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas")).toBeVisible();

    await page.getByTitle("観賞モード（UI非表示）").click();
    await expect(page.getByTitle("UIを表示する")).toBeVisible();

    await page.screenshot({ path: screenshotPath("view-mode") });
  });
});
