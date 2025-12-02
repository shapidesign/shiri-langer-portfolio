// Spotlight Effect Types
export interface SpotlightPosition {
  x: number;
  y: number;
}

export interface SpotlightConfig {
  duration: number;
  ease: string;
  overlayOpacity: number;
  fadeOpacity: number;
}

export interface SpotlightHandlers {
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
}
