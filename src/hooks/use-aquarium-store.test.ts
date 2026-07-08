import { describe, it, expect, beforeEach } from "vitest";
import { useAquariumStore } from "./use-aquarium-store";

describe("useAquariumStore", () => {
  beforeEach(() => {
    useAquariumStore.setState({ currentMode: "normal" });
  });

  it("初期モードは normal である", () => {
    expect(useAquariumStore.getState().currentMode).toBe("normal");
  });

  it("setCurrentMode で party に切り替えられる", () => {
    useAquariumStore.getState().setCurrentMode("party");
    expect(useAquariumStore.getState().currentMode).toBe("party");
  });

  it("setCurrentMode で normal に戻せる", () => {
    useAquariumStore.getState().setCurrentMode("party");
    useAquariumStore.getState().setCurrentMode("normal");
    expect(useAquariumStore.getState().currentMode).toBe("normal");
  });
});
