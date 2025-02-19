# BezierCurveAnimator Documentation

## Overview
The `BezierCurveAnimator` class is responsible for animating a Bézier curve on an HTML5 canvas. It takes a set of points, calculates control points for smooth interpolation, and draws the curve dynamically.

## Table of Contents
- [Constructor](#constructor)
- [Methods](#methods)
  - [resizeCanvas](#resizecanvas)
  - [invertY](#inverty)
  - [getControlPoints](#getcontrolpoints)
  - [getPointOnBezierCurve](#getpointonbeziercurve)
  - [drawDots](#drawdots)
  - [drawAnimatedCurve](#drawanimatedcurve)
  - [draw](#draw)
- [Usage Example](#usage-example)
## Constructor

```typescript
constructor(canvasId: string, points: IPoint[], tension: number = 1)
```

### Parameters:

- **canvasId** (string): The ID of the HTML `<div>` containing the canvas.
- **points** (IPoint[]): An array of points representing the curve.
- **tension** (number, optional): Controls the smoothness of the curve. Default is 1.

### Properties

- **canvasWrapper:** The parent `<div>` containing the canvas.
- **canvas:** The HTML `<canvas>` element.
- **ctx:** The 2D rendering context of the canvas.
- **points:** Array of IPoint objects defining the curve.
- **tension:** Affects the shape of the curve.
- **currentSegment:** Tracks the current segment being drawn.
- **t:** Progress factor (0 to 1) for animation.
- **drawnSegments:** Stores already drawn curve segments.
- **scaleX:** Horizontal scaling factor.
- **scaleY:** Vertical scaling factor.

## Methods
### resizeCanvas
```typescript
private resizeCanvas(): void
```
Resizes the canvas to match its container dimensions, adjusting point positions accordingly.

### invertY
```typescript
private invertY(y: number): number
```
Inverts the Y-coordinate to align with the canvas coordinate system.

### getControlPoints
```typescript
private getControlPoints(i: number)
```
Computes control points for the Bézier curve segment using a Catmull-Rom spline approach.

**Returns:**

``` typescript
{ cp1x: number, cp1y: number, cp2x: number, cp2y: number, x1: number, y1: number, x2: number, y2: number }
```

### getPointOnBezierCurve

```typescript
private getPointOnBezierCurve(t: number, p0: IPoint, cp1: IPoint, cp2: IPoint, p3: IPoint)
```
Computes a point on the Bézier curve using the parameter t (0 to 1).

**Returns:**
```typescript
{ x: number, y: number }
```
### drawDots
```typescript
private drawDots(): void
```
Draws small yellow circles at the control points.

`drawAnimatedCurve()`

```typescript
private drawAnimatedCurve(): void
```
Draws the Bézier curve segment by segment using an animation loop.

### draw

```typescript
public draw(): void
```
Clears the canvas and starts the drawing animation.


## Usage Example
``` typescript
const points: IPoint[] = [
    { x: 50, y: 150 },
    { x: 150, y: 50 },
    { x: 250, y: 150 },
    { x: 350, y: 50 }
];

const animator = new BezierCurveAnimator("canvas-container", points);
animator.draw();
```

## Notes
- The class automatically resizes the canvas when the window resizes.
- Uses quadratic Bézier curves for smooth transitions.
- The animation progresses segment by segment.

## Dependencies

Requires an HTML `<canvas>` element inside a `<div>` container.

Assumes the IPoint interface is defined as:
``` typescript
interface IPoint {
    x: number;
    y: number;
}
```