import React from 'react';
import './ThreeDot.css';

interface ThreeDotProps {
  variant?: 'pulsate' | 'bounce' | 'rotate';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  text?: string;
  textColor?: string;
}

const ThreeDot: React.FC<ThreeDotProps> = ({
  variant = 'pulsate',
  color = '#E3FF00',
  size = 'medium',
  text = '',
  textColor = ''
}) => {
  const sizeMap = {
    small: '8px',
    medium: '12px',
    large: '16px'
  };

  const dotSize = sizeMap[size];

  return (
    <div className={`three-dot-container three-dot-${variant} three-dot-${size}`}>
      <div className="three-dot-wrapper">
        <span
          className="three-dot-dot"
          style={{
            backgroundColor: color,
            width: dotSize,
            height: dotSize
          }}
        />
        <span
          className="three-dot-dot"
          style={{
            backgroundColor: color,
            width: dotSize,
            height: dotSize
          }}
        />
        <span
          className="three-dot-dot"
          style={{
            backgroundColor: color,
            width: dotSize,
            height: dotSize
          }}
        />
      </div>
      {text && (
        <span
          className="three-dot-text"
          style={{ color: textColor || color }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default ThreeDot;

