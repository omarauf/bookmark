import type { Post } from "@workspace/contracts/post";
import { createContext, useContext } from "react";

export type PostContextState = {
  post: Post;
};

type PostContextType = PostContextState | null;

export const PostContext = createContext<PostContextType>(null);

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within PostContextProvider");
  }
  return context;
}
