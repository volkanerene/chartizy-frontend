import * as PIXI from "pixi.js";
import type { CustomPathLayer } from "../../chartizy-dsl";
import { colorToPixi, applyEffects } from "../effects";

export function renderCustomPathLayer(
  layer: CustomPathLayer,
  container: PIXI.Container,
  width: number,
  height: number
): void {
  if (!container || !container.parent) {
    console.warn("[CustomPathLayer] Container invalid, skipping render");
    return;
  }

  const graphics = new PIXI.Graphics();
  const color = colorToPixi(layer.color);

  // Parse SVG path and draw
  // This is a simplified parser - for full SVG path support, consider using a library
  const pathCommands = layer.path.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];

  let currentX = 0;
  let currentY = 0;

  pathCommands.forEach((command) => {
    const type = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    switch (type.toLowerCase()) {
      case "m": // Move to (absolute)
        if (coords.length >= 2) {
          currentX = coords[0];
          currentY = coords[1];
          graphics.moveTo(currentX, currentY);
        }
        break;

      case "l": // Line to (absolute)
        if (coords.length >= 2) {
          currentX = coords[0];
          currentY = coords[1];
          graphics.lineTo(currentX, currentY);
        }
        break;

      case "h": // Horizontal line (absolute)
        if (coords.length >= 1) {
          currentX = coords[0];
          graphics.lineTo(currentX, currentY);
        }
        break;

      case "v": // Vertical line (absolute)
        if (coords.length >= 1) {
          currentY = coords[0];
          graphics.lineTo(currentX, currentY);
        }
        break;

      case "z": // Close path
        graphics.closePath();
        break;

      // Add more path commands as needed
    }
  });

  if (layer.fill) {
    graphics.beginFill(color);
  }

  if (layer.stroke) {
    graphics.lineStyle(layer.strokeWidth, color, 1);
  }

  // Apply effects
  if (layer.effects) {
    applyEffects(graphics, layer.effects);
  }

  if (container && container.parent) {
    container.addChild(graphics);
  }
}
