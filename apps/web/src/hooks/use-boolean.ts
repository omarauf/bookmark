import { useCallback, useMemo, useState } from "react";

// ----------------------------------------------------------------------

export type UseBooleanReturn = {
  value: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onToggle: () => void;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useBoolean(defaultValue = false): UseBooleanReturn {
  const [value, setValue] = useState(defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      value,
      onTrue,
      onFalse,
      onToggle,
      setValue,
    }),
    [value, onTrue, onFalse, onToggle],
  );

  return memoizedValue;
}
