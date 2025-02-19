"use strict";

import { IPoint } from "./interfaces";

export class BezierCurveAnimator {
    private canvasWrapper: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private points: IPoint[];
    private tension: number;
    private currentSegment: number;
    private t: number;
    private drawnSegments: { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x2: number; y2: number }[];
    private scaleX: number;
    private scaleY: number;

    constructor(canvasId: string, points: IPoint[], tension: number = 1) {
        this.canvasWrapper = document.getElementById(canvasId) as HTMLDivElement;
        this.canvas = document.querySelector(`#${canvasId} canvas`) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.points = points;
        this.tension = tension;
        this.currentSegment = 0;
        this.t = 0;
        this.drawnSegments = [];
        this.scaleX = 1;
        this.scaleY = 1;

        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    private resizeCanvas(): void {
        const { width, height } = this.canvasWrapper.getBoundingClientRect();
        this.scaleX = (width / this.canvas.width);
        this.scaleY = (height / this.canvas.height);
        this.canvas.width *= this.scaleX;
        this.canvas.height *= this.scaleY;
        
        this.points.forEach(point => {
            point.x *= this.scaleX;
            point.y *= this.scaleY;
        });
        this.draw();
    }

    private invertY(y: number): number {
        return this.canvas.height - y;
    }

    private getControlPoints(i: number) {
        let x0 = i > 0 ? this.points[i - 1].x : this.points[0].x;
        let y0 = i > 0 ? this.invertY(this.points[i - 1].y) : this.invertY(this.points[0].y);

        let x1 = this.points[i].x;
        let y1 = this.invertY(this.points[i].y);

        let x2 = this.points[i + 1].x;
        let y2 = this.invertY(this.points[i + 1].y);

        let x3 = i < this.points.length - 2 ? this.points[i + 2].x : x2;
        let y3 = i < this.points.length - 2 ? this.invertY(this.points[i + 2].y) : y2;

        let cp1x = x1 + (x2 - x0) / 6 * this.tension;
        let cp1y = y1 + (y2 - y0) / 6 * this.tension;

        let cp2x = x2 - (x3 - x1) / 6 * this.tension;
        let cp2y = y2 - (y3 - y1) / 6 * this.tension;

        return { cp1x, cp1y, cp2x, cp2y, x1, y1, x2, y2 };
    }

    private getPointOnBezierCurve(t: number, p0: IPoint, cp1: IPoint, cp2: IPoint, p3: IPoint) {
        const x = 
            (1 - t) ** 3 * p0.x +
            3 * (1 - t) ** 2 * t * cp1.x +
            3 * (1 - t) * t ** 2 * cp2.x +
            t ** 3 * p3.x;

        const y = 
            (1 - t) ** 3 * p0.y +
            3 * (1 - t) ** 2 * t * cp1.y +
            3 * (1 - t) * t ** 2 * cp2.y +
            t ** 3 * p3.y;

        return { x, y };
    }

    private drawDots(): void { 
        this.ctx.globalCompositeOperation = 'destination-over';
        this.ctx.fillStyle = "yellow";

        this.points.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, this.invertY(point.y), 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    private drawAnimatedCurve(): void {
        if (this.currentSegment >= this.points.length - 1) return;
    
        let { cp1x, cp1y, cp2x, cp2y, x1, y1, x2, y2 } = this.getControlPoints(this.currentSegment);
    
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.moveTo(x1, y1);
        this.ctx.strokeStyle = "red";
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
    
        const resolution = 1000; // Increase the resolution for smoother curves
        for (let i = 0; i <= this.t * resolution; i++) {
            let progressT = i / resolution;
            let { x, y } = this.getPointOnBezierCurve(progressT, { x: x1, y: y1 }, { x: cp1x, y: cp1y }, { x: cp2x, y: cp2y }, { x: x2, y: y2 });
            this.ctx.lineTo(x, y);
        }
    
        this.ctx.stroke();
        this.t += 0.02;
    
        if (this.t >= 1) {
            this.t = 0;
            this.drawnSegments.push({ cp1x, cp1y, cp2x, cp2y, x2, y2 });
            this.currentSegment++;
        }
    
        requestAnimationFrame(() => this.drawAnimatedCurve());
    }

    public draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawAnimatedCurve();
        this.drawDots();
    }
}