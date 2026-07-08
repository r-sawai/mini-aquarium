import fs from "fs";
import path from "path";
import { EVIDENCE_SCENARIOS, SCREENSHOTS_DIR } from "../e2e/evidence.config";

const ROOT = process.cwd();
const UNIT_RESULTS_PATH = path.join(ROOT, "test-results/unit.json");
const E2E_RESULTS_PATH = path.join(ROOT, "test-results/e2e.json");
const OUTPUT_MD_PATH = path.join(ROOT, "docs/evidence/report.md");
const SCREENSHOTS_ABS_DIR = path.join(ROOT, SCREENSHOTS_DIR);

type TestSummary = { total: number; passed: number; failed: number };

type UnitTestCase = { description: string; passed: boolean; note: string };

type UnitTestGroup = {
  title: string;
  description: string;
  cases: UnitTestCase[];
};

/**
 * テスト対象ファイルごとに「何のロジックを検証しているか」を補足する説明。
 * ここに無いファイルはファイル名をそのままタイトルとして表示する。
 */
const UNIT_TEST_GROUP_META: Record<
  string,
  { title: string; description: string }
> = {
  "src/lib/food-detection.test.ts": {
    title: "エサ検知ロジック",
    description:
      "魚が検知半径・視野角内のエサを正しく検出し、最も近いエサを選択し、食べられる距離かどうかを判定できることを確認する。",
  },
  "src/hooks/use-aquarium-store.test.ts": {
    title: "表示モード切り替えロジック",
    description:
      "アプリの表示モード（通常/観賞など）が初期状態から正しく切り替えられることを確認する。",
  },
};

function readUnitResults(): { summary: TestSummary; groups: UnitTestGroup[] } {
  if (!fs.existsSync(UNIT_RESULTS_PATH)) {
    throw new Error(
      `Vitestの結果が見つかりません: ${UNIT_RESULTS_PATH}\n先に \`pnpm test:unit\` を実行してください。`,
    );
  }
  const raw = JSON.parse(fs.readFileSync(UNIT_RESULTS_PATH, "utf-8"));

  const groups: UnitTestGroup[] = raw.testResults.map(
    (fileResult: {
      name: string;
      assertionResults: {
        title: string;
        status: string;
        failureMessages: string[];
      }[];
    }) => {
      const relPath = toPosixRelative(ROOT, fileResult.name);
      const meta = UNIT_TEST_GROUP_META[relPath];
      const cases: UnitTestCase[] = fileResult.assertionResults.map(
        (assertion) => ({
          description: assertion.title,
          passed: assertion.status === "passed",
          note:
            assertion.status === "passed"
              ? "期待どおりの結果を確認"
              : (assertion.failureMessages[0]?.split("\n")[0] ?? "失敗"),
        }),
      );
      return {
        title: meta?.title ?? relPath,
        description: meta?.description ?? "",
        cases,
      };
    },
  );

  return {
    summary: {
      total: raw.numTotalTests,
      passed: raw.numPassedTests,
      failed: raw.numFailedTests,
    },
    groups,
  };
}

function readE2ESummary(): TestSummary {
  if (!fs.existsSync(E2E_RESULTS_PATH)) {
    throw new Error(
      `Playwrightの結果が見つかりません: ${E2E_RESULTS_PATH}\n先に \`pnpm test:e2e\` を実行してください。`,
    );
  }
  const raw = JSON.parse(fs.readFileSync(E2E_RESULTS_PATH, "utf-8"));
  const stats = raw.stats;
  return {
    total: stats.expected + stats.unexpected + stats.skipped + stats.flaky,
    passed: stats.expected,
    failed: stats.unexpected,
  };
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toPosixRelative(from: string, to: string): string {
  return path.relative(from, to).split(path.sep).join("/");
}

function buildMarkdown(
  unit: TestSummary,
  unitGroups: UnitTestGroup[],
  e2e: TestSummary,
): string {
  const generatedAt = formatTimestamp(new Date());
  const outputDir = path.dirname(OUTPUT_MD_PATH);

  const slides: string[] = [];

  slides.push(`<!-- _class: title -->

# mini-aquarium
## テスト実行エビデンスレポート

生成日時: ${generatedAt}`);

  slides.push(`## テスト結果サマリー

| 種別 | 件数 | 成功 | 失敗 |
| --- | --- | --- | --- |
| ロジック単体テスト (Vitest) | ${unit.total} | ${unit.passed} | ${unit.failed} |
| E2Eスモークテスト (Playwright) | ${e2e.total} | ${e2e.passed} | ${e2e.failed} |`);

  for (const group of unitGroups) {
    const rows = group.cases
      .map(
        (c) =>
          `| ${c.description} | ${c.passed ? "✅ 成功" : "❌ 失敗"} | ${c.note} |`,
      )
      .join("\n");

    slides.push(`## ${group.title}

<p class="description">${group.description}</p>

| 確認内容 | 判定 | 備考 |
| --- | --- | --- |
${rows}`);
  }

  for (const scenario of EVIDENCE_SCENARIOS) {
    const screenshotAbsPath = path.join(SCREENSHOTS_ABS_DIR, scenario.file);
    if (!fs.existsSync(screenshotAbsPath)) {
      throw new Error(
        `証跡スクリーンショットが見つかりません: ${screenshotAbsPath}\n先に \`pnpm test:e2e\` を実行してください。`,
      );
    }
    const relImagePath = toPosixRelative(outputDir, screenshotAbsPath);

    slides.push(`<!-- _class: evidence -->

## ${scenario.title}

<p class="description">${scenario.description}</p>

<div class="screenshot-frame">

![](${relImagePath})

</div>`);
  }

  const frontMatter = `---
marp: true
theme: evidence
paginate: true
html: true
---

`;

  return frontMatter + slides.join("\n\n---\n\n") + "\n";
}

function main() {
  const { summary: unit, groups: unitGroups } = readUnitResults();
  const e2e = readE2ESummary();
  const markdown = buildMarkdown(unit, unitGroups, e2e);

  fs.mkdirSync(path.dirname(OUTPUT_MD_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_MD_PATH, markdown, "utf-8");

  console.log(`レポートを生成しました: ${OUTPUT_MD_PATH}`);
}

main();
