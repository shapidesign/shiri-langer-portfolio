import React, { useCallback, useState } from 'react';
import CircularGallery from '../CircularGallery/CircularGallery';
import ContactModal from '../ContactModal';
import ProjectModal from '../ProjectModal';
import AboutModal from '../AboutModal';
import './PortfolioGrid.css';

const PortfolioGrid: React.FC = () => {
  // ── Modal state ───────────────────────────────────────────────────────────
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleProjectClick = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
    setIsProjectModalOpen(true);
  }, []);

  return (
    <div
      className="portfolio-container"
      style={{
        position: 'relative',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        background: 'var(--color-background)',
        color: 'var(--color-text)',
      } as React.CSSProperties}
    >
      {/* 3D Circular Gallery */}
      <div className="cg-carousel-section">
        <CircularGallery onOpen={handleProjectClick} />
      </div>

      {/* About Me Button */}
      <button
        className="about-btn"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsAboutModalOpen(true); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsAboutModalOpen(true); }}
        aria-label="Open about me modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        About
      </button>

      {/* Contact Button */}
      <button
        className="contact-btn"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsContactModalOpen(true); }}
        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setIsContactModalOpen(true); }}
        aria-label="Open contact modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Contact
      </button>

      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      <ProjectModal
        isOpen={isProjectModalOpen}
        projectId={selectedProjectId}
        onClose={() => { setIsProjectModalOpen(false); setSelectedProjectId(null); }}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenProject={(projectId) => { setSelectedProjectId(projectId); setIsProjectModalOpen(true); }}
      />

      {/* Developer credit */}
      <div className="dev-credit">
        website by{' '}
        <a href="https://www.shapidesign.com/" target="_blank" rel="noopener noreferrer">
          Yehonatan Shapira
        </a>
      </div>
    </div>
  );
};

export default PortfolioGrid;
