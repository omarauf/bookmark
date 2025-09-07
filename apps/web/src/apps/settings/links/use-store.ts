import { create, type StateCreator } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

type LinkSettingStore = {
  popup: boolean;
  setPopup: (popup: boolean) => void;
};

const linkSettingStore: StateCreator<LinkSettingStore> = (set) => ({
  popup: false,
  setPopup: (popup) => set(() => ({ popup })),
});

export const useLinkSettingStore = create<LinkSettingStore>()(
  subscribeWithSelector(persist(linkSettingStore, { name: "link-setting-storage" })),
);
