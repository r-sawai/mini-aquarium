# mini-aquarium

ブラウザで動く 3D インタラクティブ水槽アプリ。
魚が自律的に泳ぎ、餌を与えると食べに来ます。

**ライブデモ**: https://r-sawai.github.io/mini-aquarium/

## 技術スタック

- **React 19** + **TypeScript**
- **React Three Fiber** / **Three.js** — 3D レンダリング
- **Vite** — ビルドツール
- **Tailwind CSS** — スタイリング
- **Tone.js** — BGM（手続き的生成音楽）
- **pnpm** — パッケージマネージャー

## 機能

- 魚が自律的に泳ぎ回る（ブラウン運動・境界回避）
- エサを与えると近くの魚が食べに来る
- BGM 再生（コード進行 + 水滴風メロディ）
- 観賞モード（UI 非表示）

## セットアップ

```bash
pnpm install
pnpm dev
```

## コマンド

| コマンド          | 説明                                    |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | 開発サーバー起動                        |
| `pnpm build`      | プロダクションビルド                    |
| `pnpm preview`    | ビルド結果のプレビュー                  |
| `pnpm lint`       | ESLint 実行                             |
| `pnpm build:ext`  | Chrome 拡張機能としてビルド             |
| `pnpm test:unit`  | Vitest によるロジック単体テスト         |
| `pnpm test:e2e`   | Playwright によるE2Eスモーク＆証跡取得  |
| `pnpm report:md`  | テスト結果と証跡からMarpレポートを生成  |
| `pnpm report:pdf` | MarpレポートをPDF（縦A4）に変換         |
| `pnpm report`     | テスト〜PDF生成までを一括実行           |

## テスト＆エビデンス資料生成

自動テストの実行結果とスクリーンショットを、そのまま資料として使えるPDF（縦A4）にまとめられます。

初回のみ、Playwright 用の Chromium をインストールしてください。

```bash
npx playwright install chromium
```

一連の流れをまとめて実行する場合:

```bash
pnpm report
```

これにより以下が実行されます。

1. `pnpm test:unit` — ロジック（`src/lib/food-detection.ts` のエサ検知判定、`useAquariumStore` のモード切り替え等）の単体テスト
2. `pnpm test:e2e` — 初期表示・エサやり・設定ダイアログ・観賞モードの4シナリオをスモークテストし、各シナリオのスクリーンショットを `e2e/evidence/screenshots/` に保存
3. `pnpm report:md` — テスト結果とスクリーンショットから `docs/evidence/report.md`（Marp形式）を生成
4. `pnpm report:pdf` — `docs/evidence/report.pdf`（縦A4、カスタムテーマ）を生成

生成物（`test-results/`, `e2e/evidence/screenshots/`, `docs/evidence/report.md`, `docs/evidence/report.pdf`）は Git 管理対象外です。

GitHub Actions の `Test Evidence Report` ワークフロー（`workflow_dispatch` のみ、手動実行）でも同様の一連の流れを実行でき、結果は Actions の Artifacts から `report.pdf` としてダウンロードできます。

## デプロイ

`main` ブランチへのプッシュで GitHub Actions が自動的に GitHub Pages へデプロイします。

## ライセンス

MIT
