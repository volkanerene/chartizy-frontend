import type { ChartizyDSL, Data } from "@/lib/chartizy-dsl";
import { createScales, type D3Scale } from "./scales";
import {
  renderGridLayer,
  renderAxisLayer,
  renderBarsLayer,
  renderLineLayer,
  renderAreaLayer,
  renderPointsLayer,
} from "./layers";

export class ChartizyCanvasRenderer {
  private ctx: CanvasRenderingContext2D | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private dsl: ChartizyDSL | null = null;
  private data: Data | undefined;
  private xScale: D3Scale | null = null;
  private yScale: D3Scale | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  setDSL(dsl: ChartizyDSL, data?: Data) {
    if (!this.canvas || !this.ctx) return;
    this.dsl = dsl;
    this.data = data;

    const { xScale, yScale } = createScales(
      dsl.scales,
      this.canvas.width,
      this.canvas.height,
      dsl.canvas.padding
    );
    this.xScale = xScale;
    this.yScale = yScale;
  }

  render() {
    if (!this.canvas || !this.ctx || !this.dsl || !this.xScale || !this.yScale) return;

    const ctx = this.ctx;
    ctx.save();
    if (this.dsl.canvas.background === "transparent") {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      ctx.fillStyle = this.dsl.canvas.background || "#ffffff";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    ctx.restore();

    const padding = this.dsl.canvas.padding;
    const { width, height } = this.canvas;
    const chartData = this.data ?? this.dsl.data;

    this.dsl.layers.forEach((layer) => {
      switch (layer.type) {
        case "grid":
          renderGridLayer(ctx, layer, this.xScale!, this.yScale!, width, height, padding);
          break;
        case "axis-x":
        case "axis-y":
          renderAxisLayer(ctx, layer, width, height, padding);
          break;
        case "bars":
          renderBarsLayer(ctx, layer, chartData, this.xScale!, this.yScale!);
          break;
        case "line":
          renderLineLayer(ctx, layer, chartData, this.xScale!, this.yScale!);
          break;
        case "area":
          renderAreaLayer(ctx, layer, chartData, this.xScale!, this.yScale!, width, height, padding);
          break;
        case "points":
          renderPointsLayer(ctx, layer, chartData, this.xScale!, this.yScale!);
          break;
        default:
          break;
      }
    });
  }
}
