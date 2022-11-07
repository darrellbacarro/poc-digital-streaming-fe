import { MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

export function useHover<T>(): [MutableRefObject<T>, EventTarget & T | null, boolean] {
  const [value, setValue] = useState<boolean>(false);
  const [el, setEl] = useState<EventTarget & T | null>(null);
  const ref: any = useRef<T | null>(null);
  const handleMouseOver = useCallback((e: MouseEvent<T>): void => {
    setValue(true);
    setEl(e.target as EventTarget & T);
  }, [])
  const handleMouseOut = useCallback((): void => {
    setValue(false);
    setEl(null);
  }, []);
  useEffect(
    () => {
      const node: any = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref, handleMouseOut, handleMouseOver] // Recall only if ref changes
  );
  return [ref, el, value];
}