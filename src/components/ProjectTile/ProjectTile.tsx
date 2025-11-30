import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../types/Project';
import { PROJECT_TEXTS } from '../../config/projectTexts';
import { getDisplayImage, getFallbackImage, normalizeImagePath } from '../../utils/imagePathUtils';
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
  const [imageSrc, setImageSrc] = useState<string>(project.img);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get gallery images for this project as fallbacks
  const projectText = PROJECT_TEXTS.find(p => p.id === project.id);
  const galleryImages = projectText?.gallery || [];

  // Initialize image source from gallery - use gallery as single source of truth
  useEffect(() => {
    if (galleryImages.length > 0) {
      // Use getDisplayImage which prefers .webp and handles normalization
      const displayImage = getDisplayImage(galleryImages);
      setImageSrc(displayImage);
    } else {
      // Fallback to project.img if no gallery (shouldn't happen, but be safe)
      setImageSrc(normalizeImagePath(project.img));
    }
    setFallbackIndex(0);
    setImageLoaded(false);
  }, [project.id, project.img, galleryImages]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    // Try fallback images from gallery
    if (galleryImages.length > fallbackIndex + 1) {
      const nextFallback = galleryImages[fallbackIndex + 1];
      if (nextFallback) {
        setFallbackIndex(fallbackIndex + 1);
        setImageSrc(normalizeImagePath(nextFallback));
        setImageLoaded(false);
        return;
      }
    }
    
    // If all fallbacks failed, try to use a default image based on project
    // At minimum, mark as loaded to show something
    setImageLoaded(true);
  };

  const handleClick = () => {
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
        src={imageSrc} 
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
        key={`${project.id}-${fallbackIndex}`}
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
