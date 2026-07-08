import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { findClosestFoodInSight, isEatingDistance } from "./food-detection";

describe("findClosestFoodInSight", () => {
  it("射程内・視野角内のエサを検出する", () => {
    const fromPos = new THREE.Vector3(0, 0, 0);
    const forward = new THREE.Vector3(1, 0, 0);
    const foodPositions = new Map([[1, new THREE.Vector3(5, 0, 0)]]);

    const result = findClosestFoodInSight(fromPos, forward, foodPositions);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(1);
    expect(result?.distance).toBeCloseTo(5);
  });

  it("検知半径の外にあるエサは検出しない", () => {
    const fromPos = new THREE.Vector3(0, 0, 0);
    const forward = new THREE.Vector3(1, 0, 0);
    const foodPositions = new Map([[1, new THREE.Vector3(999, 0, 0)]]);

    const result = findClosestFoodInSight(fromPos, forward, foodPositions);

    expect(result).toBeNull();
  });

  it("視野角の外（真後ろ）にあるエサは検出しない", () => {
    const fromPos = new THREE.Vector3(0, 0, 0);
    const forward = new THREE.Vector3(1, 0, 0);
    const foodPositions = new Map([[1, new THREE.Vector3(-5, 0, 0)]]);

    const result = findClosestFoodInSight(fromPos, forward, foodPositions);

    expect(result).toBeNull();
  });

  it("複数のエサがある場合は最も近いものを選ぶ", () => {
    const fromPos = new THREE.Vector3(0, 0, 0);
    const forward = new THREE.Vector3(1, 0, 0);
    const foodPositions = new Map([
      [1, new THREE.Vector3(8, 0, 0)],
      [2, new THREE.Vector3(3, 0, 0)],
      [3, new THREE.Vector3(6, 0, 0)],
    ]);

    const result = findClosestFoodInSight(fromPos, forward, foodPositions);

    expect(result?.id).toBe(2);
    expect(result?.distance).toBeCloseTo(3);
  });

  it("forward が null の場合は視野角を無視して検出する", () => {
    const fromPos = new THREE.Vector3(0, 0, 0);
    const foodPositions = new Map([[1, new THREE.Vector3(-5, 0, 0)]]);

    const result = findClosestFoodInSight(fromPos, null, foodPositions);

    expect(result?.id).toBe(1);
  });
});

describe("isEatingDistance", () => {
  it("しきい値未満なら食べたと判定する", () => {
    expect(isEatingDistance(0.5)).toBe(true);
  });

  it("しきい値以上なら食べたと判定しない", () => {
    expect(isEatingDistance(1.0)).toBe(false);
    expect(isEatingDistance(2.0)).toBe(false);
  });
});
