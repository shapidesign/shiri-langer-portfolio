// Drag and Inertia Types
export interface DragState {
  dragging: boolean;
  x: number;
  y: number;
  t: number;
  lastX: number;
  lastY: number;
  lastT: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface DragOffset {
  x: number;
  y: number;
}

export interface DragConfig {
  friction: number;
  minSpeed: number;
  maxVelocity: number;
  resistance: number;
}

export interface DragHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}
