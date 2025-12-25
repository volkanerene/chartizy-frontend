"use client";

const DEFAULT_COLOR = "#165DFC";

const structuredCloneSafe = (input: any) => {
  if (typeof structuredClone === "function") {
    try {
      return structuredClone(input);
    } catch {
      // Fallback below
    }
  }
  try {
    return JSON.parse(JSON.stringify(input));
  } catch {
    return input;
  }
};

const normalizeColorValue = (value: any, fallback = DEFAULT_COLOR) => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeColorValue(entry, fallback))
      .filter(Boolean);
  }
  if (value && typeof value === "object") {
    if (typeof value.color === "string") {
      return value.color;
    }
    if (typeof value.value === "string") {
      return value.value;
    }
    if (typeof value.start === "string") {
      return value.start;
    }
  }
  return fallback;
};

const normalizeStops = (stops: any[]): Array<{ color: string; offset: number }> => {
  if (!Array.isArray(stops) || stops.length === 0) {
    return [
      { color: DEFAULT_COLOR, offset: 0 },
      { color: "#8EC6FF", offset: 1 },
    ];
  }

  const lastIndex = Math.max(1, stops.length - 1);

  return stops.map((stop, idx) => {
    if (typeof stop === "string") {
      return {
        color: stop,
        offset: lastIndex === 0 ? 0 : idx / lastIndex,
      };
    }
    if (stop && typeof stop === "object") {
      return {
        color: typeof stop.color === "string" ? stop.color : DEFAULT_COLOR,
        offset:
          typeof stop.offset === "number"
            ? stop.offset
            : lastIndex === 0
              ? 0
              : idx / lastIndex,
      };
    }
    return {
      color: DEFAULT_COLOR,
      offset: lastIndex === 0 ? 0 : idx / lastIndex,
    };
  });
};

const sanitizeGradient = (gradient: any) => {
  if (!gradient || typeof gradient !== "object") {
    return undefined;
  }

  const sanitized = { ...gradient };
  sanitized.colors = normalizeStops(gradient.colors || []);
  return sanitized;
};

const sanitizeShadow = (shadow: any) => {
  if (!shadow || typeof shadow !== "object") {
    return undefined;
  }
  return {
    offsetX: typeof shadow.offsetX === "number" ? shadow.offsetX : 0,
    offsetY: typeof shadow.offsetY === "number" ? shadow.offsetY : 0,
    blur: typeof shadow.blur === "number" ? shadow.blur : 4,
    color: normalizeColorValue(shadow.color),
    opacity:
      typeof shadow.opacity === "number"
        ? Math.min(1, Math.max(0, shadow.opacity))
        : 0.25,
  };
};

const sanitizeGlow = (glow: any) => {
  if (!glow || typeof glow !== "object") {
    return undefined;
  }
  return {
    radius: typeof glow.radius === "number" ? Math.max(0, glow.radius) : 10,
    color: normalizeColorValue(glow.color),
    intensity:
      typeof glow.intensity === "number"
        ? Math.min(1, Math.max(0, glow.intensity))
        : 0.5,
  };
};

const sanitizeEffects = (effects: any) => {
  if (!effects) {
    return undefined;
  }
  if (effects === true) {
    return {};
  }
  if (typeof effects !== "object") {
    return undefined;
  }
  const sanitized: any = { ...effects };
  sanitized.gradient = sanitizeGradient(effects.gradient);
  sanitized.shadow = sanitizeShadow(effects.shadow);
  sanitized.glow = sanitizeGlow(effects.glow);

  if (typeof sanitized.blur !== "number") {
    sanitized.blur = 0;
  }
  if (typeof sanitized.blendMode !== "string") {
    sanitized.blendMode = "normal";
  }
  if (typeof sanitized.opacity !== "number") {
    sanitized.opacity = 1;
  }
  return sanitized;
};

const sanitizeLayer = (layer: any) => {
  if (!layer || typeof layer !== "object") {
    return layer;
  }
  const sanitized = { ...layer };
  if ("color" in sanitized) {
    sanitized.color = normalizeColorValue(sanitized.color);
  }
  if (Array.isArray(sanitized.color)) {
    sanitized.color = sanitized.color.map((value: any) =>
      normalizeColorValue(value)
    );
  }
  if (sanitized.effects !== undefined) {
    sanitized.effects = sanitizeEffects(sanitized.effects);
  }
  return sanitized;
};

export function sanitizeDSLInput(input: any) {
  if (!input || typeof input !== "object") {
    return input;
  }

  const dsl = structuredCloneSafe(input);
  if (!dsl || typeof dsl !== "object") {
    return input;
  }

  if (dsl.theme?.effects !== undefined) {
    dsl.theme.effects = sanitizeEffects(dsl.theme.effects) || {};
  }

  if (Array.isArray(dsl.layers)) {
    dsl.layers = dsl.layers.map(sanitizeLayer);
  }

  return dsl;
}
