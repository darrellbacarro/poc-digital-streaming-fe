import type { MutableRefObject, UIEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from "react";

export enum ScrollDirection {
  Vertical = "vertical",
  Horizontal = "horizontal",
}

export const useScroll = <T = HTMLElement>(dir = ScrollDirection.Vertical): [MutableRefObject<T>, number[]] => {
  const ref: any= useRef<T | null>(null);
  const [position, setPosition] = useState([0, 0, 0]);

  const handleScroll = useCallback((e: UIEvent<T>) => {
    const el = e.target as EventTarget & HTMLElement;
    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, offsetWidth, offsetHeight } = el;
    const scrollPosition = dir === ScrollDirection.Vertical
      ? [scrollTop, scrollHeight, offsetHeight]
      : [scrollLeft, scrollWidth, offsetWidth];
    setPosition(scrollPosition);
  }, [dir]);

  useEffect(() => {
    const node: any = ref.current;
    if (node) {
      node.addEventListener('scroll', handleScroll);
      return () => {
        node.removeEventListener('scroll', handleScroll);
      };
    }
  }, [ref, handleScroll]);

  return [ref, position];
};