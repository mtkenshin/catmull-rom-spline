import { BezierCurveAnimator} from "./catmull-rom-spline";
import { IPoint } from "./interfaces";

const points: IPoint[] = [
  { x: 100, y: 50 }, { x: 170, y: 90 }, { x: 50, y: 130 },
  { x: 220, y: 170 }, { x: 100, y: 210 }, { x: 60, y: 250 },
  { x: 230, y: 290 }, { x: 310, y: 330 }, { x: 280, y: 370 },
  { x: 360, y: 680 }
];
const animator = new BezierCurveAnimator("myCanvas", points, 1);
animator.draw();