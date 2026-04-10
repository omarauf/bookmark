import type { Post } from "@workspace/contracts/post";
import type { StateCreator } from "zustand";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type PreviewState = {
  post?: Post;
};

type PreviewActions = {
  setSelectedPost: (post?: Post) => void;
};

const initialState: PreviewState = {
  post: undefined,
};

const previewStore: StateCreator<PreviewState & PreviewActions> = (set) => ({
  ...initialState,

  setSelectedPost: (post) => set({ post }),
});

export const usePreviewStore = create<PreviewState & PreviewActions>()(
  subscribeWithSelector(previewStore),
);
