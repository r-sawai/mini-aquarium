import { defineConfig } from "@playwright/test";

const PORT = 4319;
const BASE_URL = `http://localhost:${PORT}/mini-aquarium/`;

// 環境によっては playwright install 済みの Chromium パスが異なる場合があるため、
// PLAYWRIGHT_CHROMIUM_EXECUTABLE で明示的に上書きできるようにする。
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  retries: 0,
  // outputDir はテスト実行のたびに中身が削除されるため、Vitest の結果(test-results/unit.json)を
  // 巻き込んで消さないよう test-results 直下ではなくサブディレクトリに退避する。
  outputDir: "test-results/playwright-artifacts",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/e2e.json" }],
  ],
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  webServer: {
    command: `pnpm exec vite dev --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
