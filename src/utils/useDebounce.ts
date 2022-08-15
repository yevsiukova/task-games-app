import { useEffect, useState } from "react";

export default function useDebounce(
  value: string = "",
  delay: number = 0,
  minLength: number = 1
): string {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (minLength && value && value.length < minLength) {
        setDebouncedValue("");
        return;
      }
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, minLength]);

  return debouncedValue;
}
