"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles.module.css";
import Markdown from "react-markdown";

type WaitingTextProps = {
  text: string;
  intervalMs?: number;
  maxDots?: number;
  className?: string;
};

export default function WaitingText({
  text,
  intervalMs = 500,
  maxDots = 3,
  className,
}: WaitingTextProps) {
  const [tick, setTick] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTick((t) => t + 1);
    }, intervalMs);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [intervalMs]);

  const content = useMemo(() => {
    const dots = ".".repeat((tick % (maxDots + 1)) as number);
    return `${text}${dots}`;
  }, [text, tick, maxDots]);

  return (
    <div className={`${styles.message} ${styles.thinking}`}>
      <Markdown>{`_${content}_`}</Markdown>
    </div>
  );
}
