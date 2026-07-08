export type EvidenceScenario = {
  id: string;
  file: string;
  title: string;
  description: string;
};

/** スクリーンショットの保存先（リポジトリルートからの相対パス） */
export const SCREENSHOTS_DIR = "e2e/evidence/screenshots";

/**
 * E2Eスモークテストのシナリオ定義。
 * Playwright のテスト本体とレポート生成スクリプトの両方から参照する。
 */
export const EVIDENCE_SCENARIOS: EvidenceScenario[] = [
  {
    id: "initial-load",
    file: "01-initial-load.png",
    title: "初期表示",
    description: "アプリを開き、水槽（3Dキャンバス）とUIが表示されることを確認する。",
  },
  {
    id: "feeding",
    file: "02-feeding.png",
    title: "エサやり",
    description:
      "「エサをあげる」ボタンをクリックし、エサが投下されて魚が反応することを確認する。",
  },
  {
    id: "settings-dialog",
    file: "03-settings-dialog.png",
    title: "設定ダイアログ",
    description:
      "設定ボタンをクリックし、BGM音量・魚の数・モードを変更できる設定ダイアログが開くことを確認する。",
  },
  {
    id: "view-mode",
    file: "04-view-mode.png",
    title: "観賞モード（UI非表示）",
    description:
      "観賞モードボタンをクリックし、操作UIが非表示になり水槽のみが表示されることを確認する。",
  },
];
