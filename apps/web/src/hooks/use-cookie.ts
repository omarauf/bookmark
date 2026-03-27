import { useState } from "react";

export function useCookie<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof document === "undefined") {
      return initialValue;
    }
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
    return match ? JSON.parse(match[2]) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    if (typeof document !== "undefined") {
      // biome-ignore lint/suspicious/noDocumentCookie: This is a client-side hook, so document.cookie is safe to use.
      document.cookie = `${key}=${JSON.stringify(value)}; path=/; max-age=31536000`;
    }
  };

  return [storedValue, setValue] as const;
}
