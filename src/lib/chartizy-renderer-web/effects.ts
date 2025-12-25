import * as PIXI from "pixi.js";
import type { Gradient, Shadow, Glow, Effects, Color } from "../chartizy-dsl";

/**
 * Formats a value using a format string (simple implementation)
 */
export function formatValue(value: number | string, format?: string): string {
  if (!format) {
    return String(value);
  }
  if (format.includes("%d")) {
    return format.replace("%d", String(Math.floor(Number(value))));
  }
  if (format.includes("%.2f")) {
    return format.replace("%.2f", Number(value).toFixed(2));
  }
  if (format.includes("%f")) {
    return format.replace("%f", String(Number(value)));
  }
  if (format.includes("%s")) {
    return format.replace("%s", String(value));
  }
  return format.replace(/\{value\}/g, String(value));
}

/**
 * Converts a color string to a PIXI color number
 */
export function colorToPixi(color: Color): number {
  if (typeof color !== "string") {
    return 0x000000;
  }

  // Hex color
  if (color.startsWith("#")) {
    return PIXI.utils.string2hex(color);
  }

  // RGB/RGBA
  if (color.startsWith("rgb")) {
    const match = color.match(/\d+/g);
    if (match) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1] || "0");
      const b = parseInt(match[2] || "0");
      const a = match[3] ? parseFloat(match[3]) : 1;
      return PIXI.utils.rgb2hex([r / 255, g / 255, b / 255]) | (Math.floor(a * 255) << 24);
    }
  }

  // Named colors - use a simple mapping
  const namedColors: Record<string, number> = {
    black: 0x000000,
    white: 0xffffff,
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
    yellow: 0xffff00,
    cyan: 0x00ffff,
    magenta: 0xff00ff,
    transparent: 0x000000,
  };

  return namedColors[color.toLowerCase()] || 0x000000;
}

/**
 * Creates a PIXI gradient fill
 */
export function createGradient(
  gradient: Gradient,
  width: number,
  height: number
): PIXI.FillGradient {
  const pixiGradient = new PIXI.FillGradient();

  if (gradient.type === "linear") {
    const startX = (gradient.start?.x ?? 0) * width;
    const startY = (gradient.start?.y ?? 0) * height;
    const endX = (gradient.end?.x ?? 1) * width;
    const endY = (gradient.end?.y ?? 1) * height;

    pixiGradient.addColorStop(0, gradient.colors[0].color);
    gradient.colors.forEach((stop) => {
      pixiGradient.addColorStop(stop.offset, stop.color);
    });
    pixiGradient.addColorStop(1, gradient.colors[gradient.colors.length - 1].color);
  } else {
    // Radial gradient
    const centerX = (gradient.center?.x ?? 0.5) * width;
    const centerY = (gradient.center?.y ?? 0.5) * height;
    const radius = gradient.radius ?? Math.min(width, height) * 0.5;

    // PIXI doesn't have native radial gradients, so we'll use a workaround
    // For now, create a linear gradient as fallback
    pixiGradient.addColorStop(0, gradient.colors[0].color);
    gradient.colors.forEach((stop) => {
      pixiGradient.addColorStop(stop.offset, stop.color);
    });
  }

  return pixiGradient;
}

/**
 * Applies shadow effect to a graphics object
 */
export function applyShadow(
  graphics: PIXI.Graphics,
  shadow: Shadow
): void {
  // PIXI doesn't have built-in shadow filters, so we use filters
  const dropShadowFilter = new PIXI.filters.DropShadowFilter({
    color: colorToPixi(shadow.color),
    alpha: shadow.opacity,
    blur: shadow.blur,
    offset: { x: shadow.offsetX, y: shadow.offsetY },
  });

  graphics.filters = graphics.filters || [];
  graphics.filters.push(dropShadowFilter);
}

/**
 * Applies glow effect to a graphics object
 */
export function applyGlow(
  graphics: PIXI.Graphics,
  glow: Glow
): void {
  const glowFilter = new PIXI.filters.GlowFilter({
    color: colorToPixi(glow.color),
    distance: glow.radius,
    outerStrength: glow.intensity,
    innerStrength: 0,
  });

  graphics.filters = graphics.filters || [];
  graphics.filters.push(glowFilter);
}

/**
 * Applies blur effect to a graphics object
 */
export function applyBlur(
  graphics: PIXI.Graphics,
  blur: number
): void {
  if (blur > 0) {
    const blurFilter = new PIXI.filters.BlurFilter(blur);
    graphics.filters = graphics.filters || [];
    graphics.filters.push(blurFilter);
  }
}

/**
 * Gets PIXI blend mode from string
 */
export function getBlendMode(
  blendMode: Effects["blendMode"]
): PIXI.BLEND_MODES {
  const modeMap: Record<string, PIXI.BLEND_MODES> = {
    normal: PIXI.BLEND_MODES.NORMAL,
    multiply: PIXI.BLEND_MODES.MULTIPLY,
    screen: PIXI.BLEND_MODES.SCREEN,
    overlay: PIXI.BLEND_MODES.OVERLAY,
    darken: PIXI.BLEND_MODES.DARKEN,
    lighten: PIXI.BLEND_MODES.LIGHTEN,
    "color-dodge": PIXI.BLEND_MODES.COLOR_DODGE,
    "color-burn": PIXI.BLEND_MODES.COLOR_BURN,
    "hard-light": PIXI.BLEND_MODES.HARD_LIGHT,
    "soft-light": PIXI.BLEND_MODES.SOFT_LIGHT,
    difference: PIXI.BLEND_MODES.DIFFERENCE,
    exclusion: PIXI.BLEND_MODES.EXCLUSION,
  };

  return modeMap[blendMode] || PIXI.BLEND_MODES.NORMAL;
}

/**
 * Applies all effects to a graphics object
 */
export function applyEffects(
  graphics: PIXI.Graphics,
  effects: Effects
): void {
  // Set opacity
  graphics.alpha = effects.opacity;

  // Set blend mode
  graphics.blendMode = getBlendMode(effects.blendMode);

  // Apply filters
  if (effects.shadow) {
    applyShadow(graphics, effects.shadow);
  }

  if (effects.glow) {
    applyGlow(graphics, effects.glow);
  }

  if (effects.blur > 0) {
    applyBlur(graphics, effects.blur);
  }
}
