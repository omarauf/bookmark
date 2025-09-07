import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const state = useRouterState();

  useEffect(() => {
    const skip = state.location?.state?.skipLoadingBar;
    if (skip) return;

    if (state.status === "pending") {
      ref.current?.continuousStart();
    } else {
      ref.current?.complete();
    }
  }, [state.status, state.location?.state]);

  return <LoadingBar color="var(--muted-foreground)" ref={ref} shadow height={2} />;
}
