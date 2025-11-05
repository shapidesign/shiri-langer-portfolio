import React from 'react';
import './NavigationIndicators.css';

/**
 * NavigationIndicators Component
 * Don Norman's Signifiers: Visual cues indicating scrollable movement
 * Provides feedback that the user can explore by scrolling/dragging
 */
const NavigationIndicators: React.FC = () => {
  return (
    <div className="navigation-indicators">
      {/* Top Indicator - Points Up */}
      <div className="indicator indicator-top">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 4L20 18H4L12 4Z"
            fill="#057BC1"
            stroke="none"
            strokeWidth="0"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Right Indicator - Points Right */}
      <div className="indicator indicator-right">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 12L6 20V4L20 12Z"
            fill="#057BC1"
            stroke="none"
            strokeWidth="0"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Bottom Indicator - Points Down */}
      <div className="indicator indicator-bottom">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 20L4 6H20L12 20Z"
            fill="#057BC1"
            stroke="none"
            strokeWidth="0"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Left Indicator - Points Left */}
      <div className="indicator indicator-left">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12L18 4V20L4 12Z"
            fill="#057BC1"
            stroke="none"
            strokeWidth="0"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default NavigationIndicators;

