"use client";

import { useEffect, useRef, useState } from "react";
import type { ChartizyDSL, Data } from "@/lib/chartizy-dsl";
import { ChartizyRenderer } from "@/lib/chartizy-renderer-web";
import {
  renderGridLayer,
  renderAxisLayer,
  renderBarsLayer,
  renderLineLayer,
  renderAreaLayer,
  renderPointsLayer,
  renderLabelsLayer,
  renderAnnotationsLayer,
  renderImageLayer,
  renderCustomPathLayer,
} from "@/lib/chartizy-renderer-web";

export interface ChartizyCanvasProps {
  definition: ChartizyDSL;
  data?: Data;
  width?: number;
  height?: number;
  responsive?: boolean;
  onInteraction?: (type: string, data: unknown) => void;
}

export function ChartizyCanvas({
  definition,
  data,
  width,
  height,
  responsive = true,
  onInteraction,
}: ChartizyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<ChartizyRenderer | null>(null);
  const [dimensions, setDimensions] = useState({
    width: width || definition.canvas.width,
    height: height || definition.canvas.height,
  });

  // Initialize renderer
  useEffect(() => {
    if (!containerRef.current) return;

    const canvasWidth = width || definition.canvas.width;
    const canvasHeight = height || definition.canvas.height;

    const renderer = new ChartizyRenderer({
      width: canvasWidth,
      height: canvasHeight,
      antialias: true,
      backgroundColor: definition.canvas.background === "transparent" 
        ? 0x000000 
        : undefined,
    });

    renderer.setDSL(definition);
    rendererRef.current = renderer;

    // Append canvas to container
    containerRef.current.appendChild(renderer.getCanvas());

    // Handle responsive resize
    if (responsive && !width && !height) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          if (newWidth > 0 && newHeight > 0) {
            setDimensions({ width: newWidth, height: newHeight });
            renderer.resize(newWidth, newHeight);
          }
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        renderer.destroy();
      };
    }

    return () => {
      renderer.destroy();
    };
  }, []);

  // Update DSL when definition changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setDSL(definition);
      render();
    }
  }, [definition]);

  // Render layers
  const render = () => {
    if (!rendererRef.current || !data) return;

    const renderer = rendererRef.current;
    const container = renderer.getContainer();
    const dsl = renderer.getDSL();
    const xScale = renderer.getXScale();
    const yScale = renderer.getYScale();

    if (!dsl || !xScale || !yScale) return;

    renderer.clear();

    const canvasWidth = dimensions.width;
    const canvasHeight = dimensions.height;
    const padding = dsl.canvas.padding;

    // Render layers in order
    dsl.layers.forEach((layer) => {
      switch (layer.type) {
        case "grid":
          renderGridLayer(layer, container, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "axis-x":
        case "axis-y":
          renderAxisLayer(layer, container, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "bars":
          renderBarsLayer(layer, container, data, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "line":
          renderLineLayer(layer, container, data, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "area":
          renderAreaLayer(layer, container, data, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "points":
          renderPointsLayer(layer, container, data, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "labels":
          renderLabelsLayer(layer, container, data, xScale, yScale, canvasWidth, canvasHeight, padding);
          break;
        case "annotations":
          renderAnnotationsLayer(layer, container, canvasWidth, canvasHeight);
          break;
        case "image":
          renderImageLayer(layer, container, canvasWidth, canvasHeight);
          break;
        case "customPath":
          renderCustomPathLayer(layer, container, canvasWidth, canvasHeight);
          break;
      }
    });

    renderer.getApplication().render();
  };

  // Re-render when data or dimensions change
  useEffect(() => {
    render();
  }, [data, dimensions]);

  return (
    <div
      ref={containerRef}
      style={{
        width: responsive && !width ? "100%" : dimensions.width,
        height: responsive && !height ? "100%" : dimensions.height,
        position: "relative",
      }}
    />
  );
}
