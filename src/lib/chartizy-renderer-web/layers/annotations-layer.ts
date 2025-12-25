import * as PIXI from "pixi.js";
import type { AnnotationsLayer } from "../../chartizy-dsl";
import { colorToPixi, applyEffects } from "../effects";

export function renderAnnotationsLayer(
  layer: AnnotationsLayer,
  container: PIXI.Container,
  width: number,
  height: number
): void {
  if (!container || !container.parent) {
    console.warn("[AnnotationsLayer] Container invalid, skipping render");
    return;
  }

  layer.items.forEach((annotation) => {
    if (!container || !container.parent) return;

    const graphics = new PIXI.Graphics();
    const color = colorToPixi(annotation.color);

    switch (annotation.type) {
      case "callout":
        // Draw callout box
        if (annotation.text && container && container.parent) {
          const text = new PIXI.Text(annotation.text, {
            fontSize: annotation.fontSize,
            fill: color,
            wordWrap: true,
            wordWrapWidth: 200,
          });

          const padding = 8;
          const boxWidth = text.width + padding * 2;
          const boxHeight = text.height + padding * 2;

          graphics.beginFill(color, 0.1);
          graphics.lineStyle(2, color, 1);
          graphics.drawRoundedRect(
            annotation.x - boxWidth / 2,
            annotation.y - boxHeight / 2,
            boxWidth,
            boxHeight,
            4
          );
          graphics.endFill();

          text.anchor.set(0.5, 0.5);
          text.x = annotation.x;
          text.y = annotation.y;

          container.addChild(graphics);
          container.addChild(text);
        }
        break;

      case "arrow":
        if (annotation.arrow) {
          graphics.lineStyle(2, color, 1);
          graphics.moveTo(annotation.arrow.from.x, annotation.arrow.from.y);
          graphics.lineTo(annotation.arrow.to.x, annotation.arrow.to.y);

          // Draw arrowhead
          const dx = annotation.arrow.to.x - annotation.arrow.from.x;
          const dy = annotation.arrow.to.y - annotation.arrow.from.y;
          const angle = Math.atan2(dy, dx);
          const arrowLength = 10;
          const arrowAngle = Math.PI / 6;

          graphics.lineTo(
            annotation.arrow.to.x - arrowLength * Math.cos(angle - arrowAngle),
            annotation.arrow.to.y - arrowLength * Math.sin(angle - arrowAngle)
          );
          graphics.moveTo(annotation.arrow.to.x, annotation.arrow.to.y);
          graphics.lineTo(
            annotation.arrow.to.x - arrowLength * Math.cos(angle + arrowAngle),
            annotation.arrow.to.y - arrowLength * Math.sin(angle + arrowAngle)
          );

          if (container && container.parent) {
            container.addChild(graphics);
          }
        }
        break;

      case "icon":
        // For icons, we'd need to load a texture
        // For now, draw a simple shape
        if (annotation.icon) {
          graphics.beginFill(color);
          graphics.drawCircle(annotation.x, annotation.y, 8);
          graphics.endFill();

          if (container && container.parent) {
            container.addChild(graphics);
          }
        }
        break;

      case "text":
        if (annotation.text && container && container.parent) {
          const text = new PIXI.Text(annotation.text, {
            fontSize: annotation.fontSize,
            fill: color,
          });

          text.anchor.set(0.5, 0.5);
          text.x = annotation.x;
          text.y = annotation.y;

          container.addChild(text);
        }
        break;
    }

    // Apply effects
    if (annotation.effects && container && container.parent) {
      applyEffects(graphics, annotation.effects);
    }
  });
}
