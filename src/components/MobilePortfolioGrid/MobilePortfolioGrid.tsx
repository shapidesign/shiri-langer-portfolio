import React from 'react';
import { PROJECT_TEXTS } from '../../config/projectTexts';
import { OptimizedImage } from '../OptimizedImage/OptimizedImage';
import './MobilePortfolioGrid.css';

interface MobilePortfolioGridProps {
  onProjectClick: (id: number) => void;
}

export const MobilePortfolioGrid: React.FC<MobilePortfolioGridProps> = ({ onProjectClick }) => {
  // Filter out About Me (ID 17) and map to render
  const projects = PROJECT_TEXTS.filter(p => p.id !== 17);

  return (
    <div className="mobile-portfolio-grid">
      <div className="mobile-grid-content">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className="mobile-project-card"
            onClick={() => onProjectClick(project.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onProjectClick(project.id);
              }
            }}
          >
            <div className="mobile-card-image-container">
              <OptimizedImage
                src={project.gallery[0]}
                alt={project.title}
                className="mobile-card-image"
                loading={index < 2 ? "eager" : "lazy"}
                priority={index < 2}
                width={600}
                height={450}
              />
              <div className="mobile-card-overlay">
                <h3 className="mobile-card-title">{project.title}</h3>
                <p className="mobile-card-subtitle">{project.subtitle}</p>
                <span className="mobile-card-year">{project.year}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mobile-grid-footer">
            <p>© {new Date().getFullYear()} Shiri Langer</p>
        </div>
      </div>
    </div>
  );
};
