import { useState, useCallback } from "react";

export const useToggle = (initialValue = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle];
};
