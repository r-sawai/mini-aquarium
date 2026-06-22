import { create } from "zustand";

/** 水槽の状態管理用ストア */
interface AquariumState {
  /** 水槽の現在のモード */
  currentMode: "normal" | "party";

  /** 水槽のモードを切り替える関数 */
  setCurrentMode: (mode: "normal" | "party") => void;
}

/** Zustand を使った水槽の状態管理ストア */
export const useAquariumStore = create<AquariumState>((set) => ({
  /** 水槽の現在のモード */
  currentMode: "party",
  /** 水槽のモードを切り替える関数 */
  setCurrentMode: (mode) => set({ currentMode: mode }),
}));
