import * as THREE from "three";
import {
  FOOD_DETECTION_RADIUS,
  FOOD_DETECTION_HALF_ANGLE,
  FOOD_EATING_DISTANCE,
} from "@/consts/aquarium";

// 視野角の判定に使うcos値（モジュールスコープで一度だけ算出）
const FOOD_DETECTION_COS = Math.cos(FOOD_DETECTION_HALF_ANGLE);

export type ClosestFood = {
  id: number;
  distance: number;
  position: THREE.Vector3;
};

/**
 * 進行方向を基準とした視野角と検知半径の両方を満たす、最も近いエサを探す。
 * どちらの条件も満たすエサがなければ null を返す。
 */
export function findClosestFoodInSight(
  fromPos: THREE.Vector3,
  forward: THREE.Vector3 | null,
  foodPositions: Map<number, THREE.Vector3>,
): ClosestFood | null {
  let closestId = -1;
  let minDist = FOOD_DETECTION_RADIUS;
  let closestFoodPos: THREE.Vector3 | null = null;

  for (const [fid, foodPos] of foodPositions) {
    const toFood = new THREE.Vector3().subVectors(foodPos, fromPos);
    const dist = toFood.length();
    if (dist >= minDist) continue;

    if (forward && forward.dot(toFood.normalize()) < FOOD_DETECTION_COS) {
      continue; // 視野角の外にあるエサは無視する
    }

    minDist = dist;
    closestId = fid;
    closestFoodPos = foodPos;
  }

  if (!closestFoodPos || closestId < 0) return null;

  return { id: closestId, distance: minDist, position: closestFoodPos };
}

/** エサを食べたと判定できる距離かどうか */
export function isEatingDistance(distance: number): boolean {
  return distance < FOOD_EATING_DISTANCE;
}
