"use client";

import { cn } from "../lib/utils";
import React, { useEffect, useState } from "react";

interface MeteorsProps {
  number?: number;
  className?: string;
}

export const Meteors = ({
  number = 20,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>(
    [],
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const styles = [...new Array(number)].map(() => ({
      top: "-10%",
      left: `${Math.floor(Math.random() * 1200)}px`,
      animationDelay: Math.random() * 1.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          style={style}
          className={cn(
            "pointer-events-none absolute size-1 rotate-[215deg] animate-meteor rounded-full bg-blue-500 shadow-[0_0_0_1px_#ffffff10]",
            className,
          )}
        >
          <div className="pointer-events-none absolute -z-20 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-blue-500 to-transparent" />
        </span>
      ))}
    </>
  );
}; 