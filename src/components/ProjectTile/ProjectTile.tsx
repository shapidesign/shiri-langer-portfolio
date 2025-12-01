import React, { useState, useEffect, useCallback } from 'react';
import { Project } from '../../types/Project';
import { PROJECT_TEXTS } from '../../config/projectTexts';
import { getDisplayImage, normalizeImagePath } from '../../utils/imagePathUtils';
import { OptimizedImage } from '../OptimizedImage/OptimizedImage';
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
  const [imageSrc, setImageSrc] = useState<string>('');
  const [fallbackIndex, setFallbackIndex] = useState(0);

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
  }, [project.id, project.img, galleryImages]);

  // Preload adjacent project images for smoother scrolling
  const preloadAdjacentImages = useCallback(() => {
    // Find this project's index
    const currentIndex = PROJECT_TEXTS.findIndex(p => p.id === project.id);
    if (currentIndex === -1) return;

    // Preload next 3 projects (both directions for 2D scrolling)
    const preloadIndices = [
      currentIndex - 1, // Previous
      currentIndex + 1, // Next
      currentIndex - 8, // Above (assuming 8 per row)
      currentIndex + 8, // Below
      currentIndex - 9, // Diagonal
      currentIndex + 9  // Diagonal
    ];

    preloadIndices.forEach(index => {
      if (index >= 0 && index < PROJECT_TEXTS.length) {
        const adjacentProject = PROJECT_TEXTS[index];
        if (adjacentProject?.gallery?.length > 0) {
          const displayImage = getDisplayImage(adjacentProject.gallery);
          if (displayImage) {
            // Preload in background
            const img = new Image();
            img.src = displayImage;
          }
        }
      }
    });
  }, [project.id]);

  // Preload adjacent images when this tile mounts (user is likely to scroll)
  useEffect(() => {
    // Small delay to avoid blocking initial render
    const timer = setTimeout(preloadAdjacentImages, 1000);
    return () => clearTimeout(timer);
  }, [preloadAdjacentImages]);

  const handleImageError = () => {
    // Try fallback images from gallery
    if (galleryImages.length > fallbackIndex + 1) {
      const nextFallback = galleryImages[fallbackIndex + 1];
      if (nextFallback) {
        setFallbackIndex(fallbackIndex + 1);
        setImageSrc(normalizeImagePath(nextFallback));
        return;
      }
    }
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
      <OptimizedImage
        src={imageSrc}
        alt={project.title}
        width={width - 20} // Account for padding
        height={height - 20} // Account for padding
        className="project-tile-img"
        style={{
          borderRadius: 8,
        }}
        loading="eager" // Load immediately to prevent scroll lag
        priority={true} // High priority
        onError={handleImageError}
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
