import React, { useState, useRef } from 'react';
import { Project } from '../../types/Project';
import { OptimizedImage } from '../OptimizedImage/OptimizedImage';
import './ProjectTile.css';

interface ProjectTileProps {
  left: number;
  top: number;
  width: number;
  height: number;
  project: Project;
  onOpen: (id: number) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  wasDragging?: () => boolean;
}

/**
 * ProjectTile - Individual project tile component
 * Single responsibility: Render and handle interactions for a single project tile
 */
export const ProjectTile: React.FC<ProjectTileProps> = ({
  left,
  top,
  width,
  height,
  project,
  onOpen,
  onMouseDown,
  wasDragging
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

  const handleClick = (e: React.MouseEvent) => {
    // If we were dragging, don't open the modal
    if (wasDragging && wasDragging()) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onOpen(project.id);
  };

  return (
    <div 
      className="project-tile" 
      style={{ 
        position: 'absolute', 
        left, 
        top, 
        width: width, 
        height: height,
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px'
      }}
      onClick={handleClick}
      onMouseDown={onMouseDown}
    >
      <OptimizedImage
        src={project.img}
        alt={project.title}
        width={width - 20} // Account for padding
        height={height - 20}
        className="project-tile-img"
        loading="lazy"
        priority={false}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          borderRadius: 8,
        }}
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
