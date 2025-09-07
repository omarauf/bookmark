import { Input } from "@workspace/ui/components/input";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  className?: string;
  threshold?: number;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function DebounceInput({ value, placeholder, threshold = 300, className, onChange }: Props) {
  const [_value, _setValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== _value) onChange(_value);
    }, threshold);

    return () => clearTimeout(timeout);
  }, [_value, onChange, threshold, value]);

  useEffect(() => {
    _setValue(value);
  }, [value]);

  return (
    <Input
      placeholder={placeholder}
      value={_value}
      className={className}
      onChange={(e) => _setValue(e.target.value)}
    />
  );
}
