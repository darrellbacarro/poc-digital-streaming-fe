import { useEffect, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// listen history change and store it
export function useHistoryStack() {
  const [stack, setStack] = useState<string[]>([]);
  const { pathname } = useLocation();
  const type = useNavigationType();
  useEffect(() => {
    if (type === "POP") {
      setStack((stack) => stack.slice(0, stack.length - 1));
    } else if (type === "PUSH") {
      setStack((stack) => [...stack, pathname]);
    } else {
      setStack((stack) => [...stack.slice(0, stack.length - 1), pathname]);
    }
  }, [pathname, type]);

  return stack;
}