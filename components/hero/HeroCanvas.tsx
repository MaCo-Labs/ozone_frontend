"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { FrameCache } from "./frameCache";
import styles from "./HeroCanvas.module.css";

type HeroCanvasProps = {
  cache: FrameCache;
  frameIndexRef: MutableRefObject<number>;
};

type ContainRect = { x: number; y: number; width: number; height: number };

/** "contain" fit: the largest rect of sourceAspect that fits inside boxWidth x boxHeight, centered. */
function containRect(boxWidth: number, boxHeight: number, sourceAspect: number): ContainRect {
  const boxAspect = boxWidth / boxHeight;
  if (boxAspect > sourceAspect) {
    const height = boxHeight;
    const width = height * sourceAspect;
    return { x: (boxWidth - width) / 2, y: 0, width, height };
  }
  const width = boxWidth;
  const height = width / sourceAspect;
  return { x: 0, y: (boxHeight - height) / 2, width, height };
}

export function HeroCanvas({ cache, frameIndexRef }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let destRect: ContainRect | null = null;
    let sourceAspect: number | null = null;

    function resize() {
      if (!container || !canvas) return;
      const { clientWidth, clientHeight } = container;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(clientWidth * dpr);
      canvas.height = Math.round(clientHeight * dpr);
      if (sourceAspect) {
        destRect = containRect(canvas.width, canvas.height, sourceAspect);
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let raf: number;
    let lastDrawnIndex = -1;

    const draw = () => {
      if (!cache) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const requested = frameIndexRef.current;
      const resolved = cache.nearestDecoded(requested);
      if (resolved !== null && resolved !== lastDrawnIndex) {
        const bitmap = cache.get(resolved);
        if (bitmap) {
          if (!sourceAspect) {
            sourceAspect = bitmap.width / bitmap.height;
            resize();
          }
          if (destRect) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(bitmap, destRect.x, destRect.y, destRect.width, destRect.height);
            lastDrawnIndex = resolved;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [cache, frameIndexRef]);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
