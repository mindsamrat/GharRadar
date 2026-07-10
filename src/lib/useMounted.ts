"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * Returns true once mounted on the client, false during SSR.
 * Uses useSyncExternalStore (the React-recommended client-detection pattern)
 * so it never sets state inside an effect.
 */
export function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
