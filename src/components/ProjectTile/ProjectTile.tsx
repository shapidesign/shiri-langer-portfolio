import React, { useState, useRef } from 'react';
import { Project } from '../../types/Project';
import './ProjectTile.css';

interface ProjectTileProps {
  left: number;
  top: number;
  width: number;
  height: number;
  project: Project;
  onOpen: (id: number) => void;
}

/**
 * ProjectTile - Individual project tile component
 * Single responsibility: Render and handle interactions for a single project tile
 * 
 * Click vs Drag detection:
 * - Click: Pointer down and up with minimal movement (< 5px) = opens modal
 * - Drag: Pointer down, move > 5px, then up = scrolls canvas, doesn't open modal
 * 
 * The parent container handles all drag interactions immediately.
 * Tiles only track movement to determine if it was a click or drag.
 */
export const ProjectTile: React.FC<ProjectTileProps> = ({
  left,
  top,
  width,
  height,
  project,
  onOpen
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  
  // Track pointer state for click vs drag detection
  const pointerState = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    dragThreshold: 5 // pixels of movement to consider it a drag
  });

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    // If image fails to load, still show it to avoid blank spaces
    setImageLoaded(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle left mouse button or primary touch
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    
    // Track pointer down position for click vs drag detection
    pointerState.current.isDown = true;
    pointerState.current.startX = e.clientX;
    pointerState.current.startY = e.clientY;
    pointerState.current.hasMoved = false;
    
    // Don't capture pointer or stop propagation - let parent handle drag immediately
    // Parent will handle all drag interactions, we just track movement
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerState.current.isDown) return;
    
    // Calculate distance moved
    const dx = Math.abs(e.clientX - pointerState.current.startX);
    const dy = Math.abs(e.clientY - pointerState.current.startY);
    const distance = Math.hypot(dx, dy);
    
    // If movement exceeds threshold, it's a drag (don't open modal)
    if (distance > pointerState.current.dragThreshold) {
      pointerState.current.hasMoved = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerState.current.isDown) return;
    
    const wasClick = !pointerState.current.hasMoved;
    const hadMoved = pointerState.current.hasMoved;
    
    // Reset state
    pointerState.current.isDown = false;
    pointerState.current.hasMoved = false;
    
    // Only open modal if it was a click (no drag movement)
    if (wasClick && !hadMoved) {
      // Prevent event from bubbling to parent drag handler
      e.preventDefault();
      e.stopPropagation();
      // Small delay to ensure drag events have finished
      setTimeout(() => {
        onOpen(project.id);
      }, 10);
    }
    // If it was a drag, let parent handle it naturally (don't prevent default)
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if it was a drag (backup handler)
    if (pointerState.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Click handler is now redundant - we use pointer events
    // But keep it as fallback
  };

  return (
    <div 
      ref={tileRef}
      className="project-tile" 
      style={{ 
        position: 'absolute', 
        left, 
        top, 
        width: width, 
        height: height,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        touchAction: 'none', // Prevent default touch behaviors
        pointerEvents: 'auto' // Ensure pointer events work
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      <img 
        ref={imgRef}
        src={project.img} 
        alt={project.title}
        className="project-tile-img"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: imageLoaded ? 1 : 0.5,
          transition: 'opacity 0.1s ease',
          borderRadius: 8,
          display: 'block'
        }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="eager"
      />
      
      {/* Project info overlay - only show on hover */}
      <div className="project-tile-overlay">
        <div className="project-tile-title">{project.title}</div>
        <div className="project-tile-year">{project.year}</div>
      </div>
    </div>
  );
};

export default ProjectTile;
