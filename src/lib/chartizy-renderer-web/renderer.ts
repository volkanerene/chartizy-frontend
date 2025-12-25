import * as PIXI from "pixi.js";
import type { ChartizyDSL } from "../chartizy-dsl";
import { createScales, type D3Scale } from "./scales";
import { colorToPixi } from "./effects";

export interface RendererOptions {
  width: number;
  height: number;
  antialias?: boolean;
  resolution?: number;
  backgroundColor?: number;
}

export class ChartizyRenderer {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private dsl: ChartizyDSL | null = null;
  private xScale: D3Scale | null = null;
  private yScale: D3Scale | null = null;

  constructor(options: RendererOptions) {
    // Create PixiJS application
    this.app = new PIXI.Application({
      width: options.width,
      height: options.height,
      antialias: options.antialias ?? true,
      resolution: options.resolution ?? window.devicePixelRatio || 1,
      backgroundColor: options.backgroundColor ?? 0xffffff,
      autoDensity: true,
    });

    // Create main container
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
  }

  /**
   * Gets the PixiJS application
   */
  getApplication(): PIXI.Application {
    return this.app;
  }

  /**
   * Gets the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.app.canvas;
  }

  /**
   * Gets the container - ensures it's always in the stage
   */
  getContainer(): PIXI.Container {
    // Ensure container is always in the stage
    if (!this.container.parent && this.app && this.app.stage) {
      try {
        if (!this.app.stage.children.includes(this.container)) {
          this.app.stage.addChild(this.container);
        }
      } catch (e) {
        console.warn("[ChartizyRenderer] Failed to add container to stage in getContainer():", e);
      }
    }
    return this.container;
  }

  /**
   * Gets the current DSL
   */
  getDSL(): ChartizyDSL | null {
    return this.dsl;
  }

  /**
   * Gets the X scale
   */
  getXScale(): D3Scale | null {
    return this.xScale;
  }

  /**
   * Gets the Y scale
   */
  getYScale(): D3Scale | null {
    return this.yScale;
  }

  /**
   * Resizes the renderer
   */
  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  /**
   * Sets the DSL and prepares scales
   */
  setDSL(dsl: ChartizyDSL): void {
    this.dsl = dsl;

    // Create scales
    const { xScale, yScale } = createScales(
      dsl.scales,
      dsl.canvas.width,
      dsl.canvas.height,
      dsl.canvas.padding
    );

    this.xScale = xScale;
    this.yScale = yScale;

    // Set background
    if (dsl.canvas.background === "transparent") {
      this.app.renderer.backgroundColor = 0x000000;
      this.app.renderer.backgroundAlpha = 0;
    } else {
      this.app.renderer.backgroundColor = colorToPixi(dsl.canvas.background);
      this.app.renderer.backgroundAlpha = 1;
    }
  }

  /**
   * Clears the container - with robust error handling
   */
  clear(): void {
    if (!this.container) {
      return;
    }
    
    // Check if container is still valid and has parent
    try {
      if (this.container.parent && this.container.children) {
        this.container.removeChildren();
      } else if (this.container.children) {
        // Container not in stage but has children - clear them anyway
        const children = [...this.container.children];
        children.forEach(child => {
          try {
            this.container.removeChild(child);
          } catch (e) {
            // Ignore errors when removing children
          }
        });
      }
      
      // Ensure container is re-added to stage if it was lost
      if (!this.container.parent && this.app && this.app.stage) {
        try {
          if (!this.app.stage.children.includes(this.container)) {
            this.app.stage.addChild(this.container);
          }
        } catch (e) {
          console.warn("[ChartizyRenderer] Failed to re-add container to stage in clear():", e);
        }
      }
    } catch (e) {
      console.warn("[ChartizyRenderer] Error clearing container:", e);
      // Try to recreate container if it's broken
      if (this.app && this.app.stage) {
        try {
          this.container = new PIXI.Container();
          if (!this.app.stage.children.includes(this.container)) {
            this.app.stage.addChild(this.container);
          }
        } catch (e2) {
          console.error("[ChartizyRenderer] Failed to recreate container:", e2);
        }
      }
    }
  }

  /**
   * Renders the chart
   */
  render(): void {
    if (!this.dsl) {
      throw new Error("DSL not set. Call setDSL() first.");
    }

    this.clear();

    // Render layers in order
    for (const layer of this.dsl.layers) {
      // Layer rendering will be handled by individual layer renderers
      // This is a placeholder - actual rendering happens in the component
    }

    this.app.render();
  }

  /**
   * Destroys the renderer
   */
  destroy(): void {
    this.app.destroy(true, {
      children: true,
      texture: true,
      baseTexture: true,
    });
  }
}
