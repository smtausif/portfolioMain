"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { portfolioTheme } from "@/lib/theme";

export type WebcamPixelGridProps = {
  gridCols?: number;
  gridRows?: number;
  maxElevation?: number;
  motionSensitivity?: number;
  elevationSmoothing?: number;
  colorMode?: "webcam" | "monochrome";
  monochromeColor?: string;
  backgroundColor?: string;
  mirror?: boolean;
  gapRatio?: number;
  invertColors?: boolean;
  darken?: number;
  borderColor?: string;
  borderOpacity?: number;
  className?: string;
  /** Background shown until the camera is ready, and after it is disabled. */
  fallback?: ReactNode;
  onWebcamError?: (error: Error) => void;
  onWebcamReady?: () => void;
};

type PixelData = {
  r: number;
  g: number;
  b: number;
  motion: number;
  targetElevation: number;
  currentElevation: number;
};

function parseColor(color: string) {
  const hex = color.replace("#", "");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

/** Aceternity's supplied pixel renderer, with camera access explicitly opt-in. */
export function WebcamPixelGrid({
  gridCols = 64,
  gridRows = 48,
  maxElevation = 15,
  motionSensitivity = 0.4,
  elevationSmoothing = 0.1,
  colorMode = "webcam",
  monochromeColor = portfolioTheme.accent,
  backgroundColor = portfolioTheme.background,
  mirror = true,
  gapRatio = 0.1,
  invertColors = false,
  darken = 0,
  borderColor = portfolioTheme.border,
  borderOpacity = 0.08,
  className,
  fallback,
  onWebcamError,
  onWebcamReady,
}: WebcamPixelGridProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const processingCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);
  const pixelDataRef = useRef<PixelData[][]>([]);
  const mountedRef = useRef(false);
  const requestingRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const monoRGB = useMemo(() => parseColor(monochromeColor), [monochromeColor]);
  const borderRGB = useMemo(() => parseColor(borderColor), [borderColor]);

  useEffect(() => {
    previousFrameRef.current = null;
    pixelDataRef.current = Array.from({ length: gridRows }, () =>
      Array.from({ length: gridCols }, () => ({
        r: 30, g: 30, b: 30, motion: 0,
        targetElevation: 0, currentElevation: 0,
      })),
    );
  }, [gridCols, gridRows]);

  // No permission request on mount. Release streams that resolve after unmount.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const requestCameraAccess = useCallback(async () => {
    if (requestingRef.current || streamRef.current) return;
    requestingRef.current = true;
    setIsRequesting(true);
    setError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access requires a supported browser and HTTPS or localhost.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user",
        },
        audio: false,
      });
      const video = videoRef.current;
      if (!mountedRef.current || !video) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      video.srcObject = stream;
      await video.play();
      if (!mountedRef.current) return;
      setIsReady(true);
      onWebcamReady?.();
    } catch (cause) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (!mountedRef.current) return;
      const cameraError = cause instanceof Error ? cause : new Error("Webcam access denied");
      setError(cameraError.message);
      onWebcamError?.(cameraError);
    } finally {
      requestingRef.current = false;
      if (mountedRef.current) setIsRequesting(false);
    }
  }, [onWebcamError, onWebcamReady]);

  const disableCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    previousFrameRef.current = null;
    setIsReady(false);
  };

  useEffect(() => {
    if (!isReady) return;
    let animationFrame = 0;

    function render() {
      const video = videoRef.current;
      const processingCanvas = processingCanvasRef.current;
      const displayCanvas = displayCanvasRef.current;
      if (!video || !processingCanvas || !displayCanvas || video.readyState < 2) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      const procCtx = processingCanvas.getContext("2d", { willReadFrequently: true });
      const dispCtx = displayCanvas.getContext("2d");
      if (!procCtx || !dispCtx) {
        animationFrame = requestAnimationFrame(render);
        return;
      }

      if (processingCanvas.width !== gridCols) processingCanvas.width = gridCols;
      if (processingCanvas.height !== gridRows) processingCanvas.height = gridRows;
      procCtx.save();
      if (mirror) {
        procCtx.scale(-1, 1);
        procCtx.drawImage(video, -gridCols, 0, gridCols, gridRows);
      } else {
        procCtx.drawImage(video, 0, 0, gridCols, gridRows);
      }
      procCtx.restore();

      const currentData = procCtx.getImageData(0, 0, gridCols, gridRows).data;
      const previousData = previousFrameRef.current;
      const pixels = pixelDataRef.current;
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const idx = (row * gridCols + col) * 4;
          const r = currentData[idx];
          const g = currentData[idx + 1];
          const b = currentData[idx + 2];
          const pixel = pixels[row]?.[col];
          if (!pixel) continue;

          let motion = 0;
          if (previousData) {
            const diff = Math.abs(r - previousData[idx]) +
              Math.abs(g - previousData[idx + 1]) + Math.abs(b - previousData[idx + 2]);
            motion = Math.min(1, diff / 255 / motionSensitivity);
          }
          pixel.motion = pixel.motion * 0.7 + motion * 0.3;

          let finalR = r;
          let finalG = g;
          let finalB = b;
          if (colorMode === "monochrome") {
            const brightness = (r + g + b) / 3 / 255;
            finalR = Math.round(monoRGB.r * brightness);
            finalG = Math.round(monoRGB.g * brightness);
            finalB = Math.round(monoRGB.b * brightness);
          }
          if (invertColors) {
            finalR = 255 - finalR;
            finalG = 255 - finalG;
            finalB = 255 - finalB;
          }
          if (darken > 0) {
            const darkenFactor = 1 - darken;
            finalR = Math.round(finalR * darkenFactor);
            finalG = Math.round(finalG * darkenFactor);
            finalB = Math.round(finalB * darkenFactor);
          }
          pixel.r = finalR;
          pixel.g = finalG;
          pixel.b = finalB;
          pixel.targetElevation = pixel.motion * maxElevation;
          pixel.currentElevation +=
            (pixel.targetElevation - pixel.currentElevation) * elevationSmoothing;
        }
      }
      previousFrameRef.current = new Uint8ClampedArray(currentData);

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = displayCanvas.clientWidth;
      const displayHeight = displayCanvas.clientHeight;
      const width = Math.round(displayWidth * dpr);
      const height = Math.round(displayHeight * dpr);
      if (displayCanvas.width !== width) displayCanvas.width = width;
      if (displayCanvas.height !== height) displayCanvas.height = height;
      dispCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dispCtx.fillStyle = backgroundColor;
      dispCtx.fillRect(0, 0, displayWidth, displayHeight);

      const cellSize = Math.max(displayWidth / gridCols, displayHeight / gridRows);
      const gap = cellSize * gapRatio;
      const offsetXGrid = (displayWidth - cellSize * gridCols) / 2;
      const offsetYGrid = (displayHeight - cellSize * gridRows) / 2;

      // Original isometric projection, shadows, side faces, highlights and borders.
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const pixel = pixels[row]?.[col];
          if (!pixel) continue;
          const x = offsetXGrid + col * cellSize;
          const y = offsetYGrid + row * cellSize;
          const elevation = pixel.currentElevation;
          const offsetX = -elevation * 1.2;
          const offsetY = -elevation * 1.8;

          if (elevation > 0.5) {
            dispCtx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.6, elevation * 0.04)})`;
            dispCtx.fillRect(x + gap / 2 + elevation * 1.5,
              y + gap / 2 + elevation * 2.0, cellSize - gap, cellSize - gap);

            dispCtx.fillStyle = `rgb(${Math.max(0, pixel.r - 80)}, ${Math.max(0, pixel.g - 80)}, ${Math.max(0, pixel.b - 80)})`;
            dispCtx.beginPath();
            dispCtx.moveTo(x + cellSize - gap / 2 + offsetX, y + gap / 2 + offsetY);
            dispCtx.lineTo(x + cellSize - gap / 2, y + gap / 2);
            dispCtx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
            dispCtx.lineTo(x + cellSize - gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
            dispCtx.closePath();
            dispCtx.fill();

            dispCtx.fillStyle = `rgb(${Math.max(0, pixel.r - 50)}, ${Math.max(0, pixel.g - 50)}, ${Math.max(0, pixel.b - 50)})`;
            dispCtx.beginPath();
            dispCtx.moveTo(x + gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
            dispCtx.lineTo(x + gap / 2, y + cellSize - gap / 2);
            dispCtx.lineTo(x + cellSize - gap / 2, y + cellSize - gap / 2);
            dispCtx.lineTo(x + cellSize - gap / 2 + offsetX, y + cellSize - gap / 2 + offsetY);
            dispCtx.closePath();
            dispCtx.fill();
          }

          const brightness = 1 + elevation * 0.05;
          dispCtx.fillStyle = `rgb(${Math.min(255, Math.round(pixel.r * brightness))}, ${Math.min(255, Math.round(pixel.g * brightness))}, ${Math.min(255, Math.round(pixel.b * brightness))})`;
          dispCtx.fillRect(x + gap / 2 + offsetX, y + gap / 2 + offsetY,
            cellSize - gap, cellSize - gap);
          dispCtx.strokeStyle = `rgba(${borderRGB.r}, ${borderRGB.g}, ${borderRGB.b}, ${borderOpacity + elevation * 0.008})`;
          dispCtx.lineWidth = 0.5;
          dispCtx.strokeRect(x + gap / 2 + offsetX, y + gap / 2 + offsetY,
            cellSize - gap, cellSize - gap);
        }
      }
      animationFrame = requestAnimationFrame(render);
    }

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [isReady, gridCols, gridRows, mirror, motionSensitivity, colorMode, monoRGB,
    maxElevation, elevationSmoothing, backgroundColor, gapRatio, invertColors,
    darken, borderRGB, borderOpacity]);

  return (
    <div className={cn("relative h-full w-full", className)} style={{ backgroundColor }}>
      {!isReady && fallback}
      <video ref={videoRef} aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0" playsInline muted />
      <canvas ref={processingCanvasRef} aria-hidden="true" className="pointer-events-none absolute h-0 w-0 opacity-0" />
      <canvas ref={displayCanvasRef} aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 block h-full w-full transition-opacity duration-1000", isReady ? "opacity-100" : "opacity-0")}
        style={{ backgroundColor }} />

      <div className="absolute top-6 right-6 z-20 flex max-w-[calc(100%-3rem)] flex-col items-end gap-3 sm:top-8 sm:right-8">
        <button type="button" onClick={isReady ? disableCamera : requestCameraAccess}
          disabled={isRequesting} aria-pressed={isReady} aria-describedby="camera-status"
          className="camera-control inline-flex min-h-11 items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 font-mono text-xs text-foreground transition-colors hover:border-accent/50 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60">
          <svg aria-hidden="true" width="16" height="16" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {isRequesting ? "Connecting…" : isReady ? "Disable Camera" : "Enable Camera"}
        </button>
        <p id="camera-status" role="status" className="camera-status max-w-72 text-right text-xs leading-relaxed text-secondary">
          {error ? "Camera unavailable. You can continue without it or try again." :
            isReady ? "Camera on · processed locally in your browser" :
              "Optional · bring the background to life"}
        </p>
      </div>
    </div>
  );
}
