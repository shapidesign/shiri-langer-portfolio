import React from 'react';
import { PROJECT_TEXTS } from '../../config/projectTexts';
import { OptimizedImage } from '../OptimizedImage/OptimizedImage';
import './MobilePortfolioGrid.css';

interface MobilePortfolioGridProps {
  onProjectClick: (id: number) => void;
}

export const MobilePortfolioGrid: React.FC<MobilePortfolioGridProps> = ({ onProjectClick }) => {
  // Filter out About Me (ID 17)
  const projects = PROJECT_TEXTS.filter(p => p.id !== 17);

  const handleCardClick = (projectId: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onProjectClick(projectId);
  };

  return (
    <div className="mobile-portfolio-grid">
      <div className="mobile-grid-content">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="mobile-project-card"
            onClick={handleCardClick(project.id)}
            onTouchEnd={handleCardClick(project.id)}
          >
            <div className="mobile-card-image-wrapper">
              <OptimizedImage
                src={project.gallery[0]}
                alt={project.title}
                className="mobile-card-image"
                loading={index < 4 ? "eager" : "lazy"}
                priority={index < 4}
                width={300}
                height={300}
              />
              <div className="mobile-card-info">
                <h3 className="mobile-card-title">{project.title}</h3>
                <span className="mobile-card-year">{project.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mobile-grid-footer">
        <p>© {new Date().getFullYear()} Shiri Langer. All rights reserved.</p>
      </div>
    </div>
  );
};
