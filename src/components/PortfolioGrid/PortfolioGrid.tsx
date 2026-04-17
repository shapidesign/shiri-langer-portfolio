import React, { useCallback, useEffect, useState } from 'react';
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

  // ── Affordance ────────────────────────────────────────────────────────────
  const [showAffordance, setShowAffordance] = useState(true);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );

  useEffect(() => {
    const hide = () => setShowAffordance(false);
    const timer = setTimeout(hide, 5000);
    window.addEventListener('pointerdown', hide, { once: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', hide);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleProjectClick = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
    setIsProjectModalOpen(true);
  }, []);

  return (
    <div
      className="portfolio-container"
      style={{
        position: 'relative',
        height: isMobile ? 'auto' : '100vh',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        overflowY: isMobile ? 'auto' : 'hidden',
        background: 'var(--color-background)',
        color: 'var(--color-text)',
      } as React.CSSProperties}
    >
      {/* Affordance hint */}
      {showAffordance && (
        <div className="gallery-affordance is-visible" aria-hidden="true">
          <div className="gallery-affordance-pill">
            {isMobile ? (
              <div className="gallery-affordance-hand" aria-hidden="true">
                <svg viewBox="0 0 36 36" role="presentation" focusable="false" aria-hidden="true">
                  <path d="M30.74,15.19a13.66,13.66,0,0,0-6.87-3.83A26,26,0,0,0,18,10.58V5.28A3.4,3.4,0,0,0,14.5,2,3.4,3.4,0,0,0,11,5.28v10L9.4,13.7a3.77,3.77,0,0,0-5.28,0A3.67,3.67,0,0,0,3,16.33a3.6,3.6,0,0,0,1,2.56l4.66,5.52a11.53,11.53,0,0,0,1.43,4,10.12,10.12,0,0,0,2,2.54v1.92a1.07,1.07,0,0,0,1,1.08H27a1.07,1.07,0,0,0,1-1.08v-2.7a12.81,12.81,0,0,0,3-8.36v-6A1,1,0,0,0,30.74,15.19ZM29,21.86a10.72,10.72,0,0,1-2.6,7.26,1.11,1.11,0,0,0-.4.72V32H14.14V30.52a1,1,0,0,0-.44-.83,7.26,7.26,0,0,1-1.82-2.23,9.14,9.14,0,0,1-1.2-3.52,1,1,0,0,0-.23-.59L5.53,17.53a1.7,1.7,0,0,1,0-2.42,1.76,1.76,0,0,1,2.47,0l3,3v3.14l2-1V5.28A1.42,1.42,0,0,1,14.5,4,1.42,1.42,0,0,1,16,5.28v11.8l2,.43V12.59a24.27,24.27,0,0,1,2.51.18V18l1.6.35V13c.41.08.83.17,1.26.28a14.88,14.88,0,0,1,1.53.49v5.15l1.6.35V14.5A11.06,11.06,0,0,1,29,16.23Z" />
                </svg>
              </div>
            ) : (
              <div className="gallery-affordance-icons" aria-hidden="true">
                {/* Mouse scroll wheel */}
                <div className="gallery-affordance-icon-item">
                  <svg width="28" height="42" viewBox="0 0 22 34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" />
                    <rect x="8.5" y="6" width="5" height="9" rx="2.5" stroke="none" fill="currentColor" opacity="0.25" />
                    <circle className="affordance-mouse-dot" cx="11" cy="9" r="2" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="gallery-affordance-divider" />
                {/* Drag */}
                <div className="gallery-affordance-icon-item">
                  <svg width="40" height="30" viewBox="0 0 30 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1.5" y="1.5" width="27" height="19" rx="4.5" />
                    <g className="affordance-trackpad-fingers">
                      <circle cx="11" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
                      <circle cx="19" cy="11" r="2.5" fill="currentColor" stroke="none" opacity="0.9" />
                    </g>
                  </svg>
                </div>
              </div>
            )}
            <div className="gallery-affordance-text">
              {isMobile ? 'Drag to explore' : 'Scroll or drag to explore'}
            </div>
          </div>
        </div>
      )}

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
