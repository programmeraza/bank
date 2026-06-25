'use client';

import React, { useState, useEffect } from 'react';

interface CountUpProps {
  target: number;
  duration?: number; // В миллисекундах (дефолт 1000мс = 1с)
}

export default function CountUp({ target, duration = 1000 }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}
