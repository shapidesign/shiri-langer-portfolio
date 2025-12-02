import React, { useState, useRef, memo, useCallback } from 'react';
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
 * Memoized for performance optimization
 */
export const ProjectTile: React.FC<ProjectTileProps> = memo(({
  left,
  top,
  width,
  height,
  project,
  onOpen
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    // If image fails to load, still show it to avoid blank spaces
    setImageLoaded(true);
  };

  const handleClick = useCallback(() => {
    onOpen(project.id);
  }, [onOpen, project.id]);

  return (
    <div 
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
        padding: '10px'
      }}
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
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      
      {/* Project info overlay - only show on hover */}
      <div className="project-tile-overlay">
        <div className="project-tile-title">{project.title}</div>
        <div className="project-tile-year">{project.year}</div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if props actually change
  return (
    prevProps.left === nextProps.left &&
    prevProps.top === nextProps.top &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.project.id === nextProps.project.id &&
    prevProps.onOpen === nextProps.onOpen
  );
});

ProjectTile.displayName = 'ProjectTile';

export default ProjectTile;
