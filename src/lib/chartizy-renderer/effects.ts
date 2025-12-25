import type { Color, Gradient, Effects } from "@/lib/chartizy-dsl";

const namedColors: Record<string, string> = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  transparent: "rgba(0,0,0,0)",
};

export const colorToCanvas = (color: Color | undefined): string => {
  if (!color) return "#000000";
  if (typeof color === "string") {
    if (color.startsWith("#") || color.startsWith("rgb")) {
      return color;
    }
    return namedColors[color.toLowerCase()] || "#000000";
  }
  return "#000000";
};

export const createGradient = (
  ctx: CanvasRenderingContext2D,
  gradient: Gradient,
  width: number,
  height: number
) => {
  if (gradient.type === "linear") {
    const startX = (gradient.start?.x ?? 0) * width;
    const startY = (gradient.start?.y ?? 0) * height;
    const endX = (gradient.end?.x ?? 1) * width;
    const endY = (gradient.end?.y ?? 1) * height;
    const canvasGradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.colors.forEach((stop) => {
      canvasGradient.addColorStop(stop.offset, stop.color);
    });
    return canvasGradient;
  }

  const centerX = (gradient.center?.x ?? 0.5) * width;
  const centerY = (gradient.center?.y ?? 0.5) * height;
  const radius = gradient.radius ?? Math.min(width, height) * 0.5;
  const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.colors.forEach((stop) => {
    radialGradient.addColorStop(stop.offset, stop.color);
  });
  return radialGradient;
};

export const applyEffects = (
  ctx: CanvasRenderingContext2D,
  effects?: Effects
) => {
  if (!effects) {
    ctx.globalAlpha = 1;
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    return;
  }

  ctx.globalAlpha = typeof effects.opacity === "number" ? effects.opacity : 1;

  if (effects.shadow) {
    ctx.shadowColor = colorToCanvas(effects.shadow.color);
    ctx.shadowBlur = effects.shadow.blur ?? 0;
    ctx.shadowOffsetX = effects.shadow.offsetX ?? 0;
    ctx.shadowOffsetY = effects.shadow.offsetY ?? 0;
  } else {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
};
