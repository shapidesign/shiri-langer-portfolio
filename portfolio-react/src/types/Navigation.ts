// Navigation Types
export interface NavigationConfig {
  stepSize: number;
  shiftStepSize: number;
  animationDuration: number;
}

export interface NavigationState {
  isModalOpen: boolean;
  offset: { x: number; y: number };
}

export interface NavigationHandlers {
  onKeyDown: (e: KeyboardEvent) => void;
  cleanup: () => void;
}
