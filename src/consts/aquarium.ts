export const TANK_WIDTH = 30;
export const TANK_HEIGHT = 16;
export const TANK_DEPTH = 18;

export const FISH_COLORS = [
  0xff5733, 0xffbd33, 0x33ff57, 0x3357ff, 0xf333ff, 0x33fff0,
] as const;

/** エサの検知半径 */
export const FOOD_DETECTION_RADIUS = 15;
/** エサ検知の視野角（進行方向から左右何ラジアンまで検知するか） */
export const FOOD_DETECTION_HALF_ANGLE = Math.PI / 3; // 左右60度、合計視野角120度
/** エサを食べたと判定する距離 */
export const FOOD_EATING_DISTANCE = 1.0;

/** アクアリウムのモード */
export const AQUARIUM_MODES = {
  normal: "ノーマル",
  party: "パーティー",
} as const;
