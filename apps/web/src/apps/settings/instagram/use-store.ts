import { create, type StateCreator } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type InstagramSettingStore = {
  virtual: boolean;
  setVirtual: (virtual: boolean) => void;
};

const instagramSettingStore: StateCreator<InstagramSettingStore> = (set) => ({
  virtual: false,
  setVirtual: (virtual) => set(() => ({ virtual })),
});

export const useInstagramSettingStore = create<InstagramSettingStore>()(
  subscribeWithSelector(persist(instagramSettingStore, { name: "instagram-setting-storage" })),
);
