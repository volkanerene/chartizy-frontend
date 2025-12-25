import * as PIXI from "pixi.js";
import type { ImageLayer } from "../../chartizy-dsl";

export function renderImageLayer(
  layer: ImageLayer,
  container: PIXI.Container,
  width: number,
  height: number
): void {
  if (!container || !container.parent) {
    console.warn("[ImageLayer] Container invalid, skipping render");
    return;
  }

  // Load image texture
  const texture = PIXI.Texture.from(layer.src);

  const sprite = new PIXI.Sprite(texture);

  sprite.x = layer.x;
  sprite.y = layer.y;
  sprite.alpha = layer.opacity;

  if (layer.width) {
    sprite.width = layer.width;
  }
  if (layer.height) {
    sprite.height = layer.height;
  }

  // Set blend mode
  const blendModeMap: Record<string, PIXI.BLEND_MODES> = {
    normal: PIXI.BLEND_MODES.NORMAL,
    multiply: PIXI.BLEND_MODES.MULTIPLY,
    screen: PIXI.BLEND_MODES.SCREEN,
    overlay: PIXI.BLEND_MODES.OVERLAY,
    darken: PIXI.BLEND_MODES.DARKEN,
    lighten: PIXI.BLEND_MODES.LIGHTEN,
  };

  sprite.blendMode = blendModeMap[layer.blendMode] || PIXI.BLEND_MODES.NORMAL;

  if (container && container.parent) {
    container.addChild(sprite);
  }
}
