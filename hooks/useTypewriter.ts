"use client";

import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 100, restartDelay = 1200) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;
    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      setDisplayed(text.substring(0, index));
      if (index < text.length) {
        index += 1;
        timeout = setTimeout(tick, speed);
      } else {
        timeout = setTimeout(() => {
          index = 0;
          tick();
        }, restartDelay);
      }
    }

    tick();
    return () => clearTimeout(timeout);
  }, [text, speed, restartDelay]);

  return displayed;
}
