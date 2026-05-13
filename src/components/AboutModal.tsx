import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePortfolioData } from '../context/PortfolioDataContext';
import type { AboutSection } from '../config/siteContentDefaults';
import './AboutModal.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
  onOpenProject?: (projectId: number) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact, onOpenProject }) => {
  const { aboutData, getProjectById } = usePortfolioData();
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [showScrollButton, setShowScrollButton] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const sectionCount = aboutData.sections.length + 1;

  useEffect(() => {
    if (!isOpen) {
      setVisibleSections(new Set());
      setShowScrollButton(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setVisibleSections((prev) => new Set(Array.from(prev).concat(index)));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isOpen, sectionCount]);

  useEffect(() => {
    if (!isOpen || !modalContentRef.current) return;

    const handleScroll = () => {
      const modalContent = modalContentRef.current;
      if (!modalContent) return;

      const scrollTop = modalContent.scrollTop;
      const scrollHeight = modalContent.scrollHeight;
      const clientHeight = modalContent.clientHeight;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowScrollButton(!isAtBottom);
    };

    const modalContent = modalContentRef.current;
    modalContent.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      modalContent.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const renderSection = (section: AboutSection, index: number) => {
    const refCb = (el: HTMLDivElement | null) => {
      sectionRefs.current[index] = el;
    };
    const sectionClass = `about-section ${visibleSections.has(index) ? 'visible' : ''}`;

    if (section.variant === 'expertise' && section.expertiseItems?.length) {
      return (
        <div key={section.id} ref={refCb} className={sectionClass}>
          <h3>{section.title}</h3>
          <div className="expertise-grid">
            {section.expertiseItems.map((item, j) => (
              <div key={`${section.id}-${j}`} className="expertise-item">
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.variant === 'highlights' && section.highlights?.length) {
      const visibleHighlights = section.highlights.filter((h) => getProjectById(h.projectId));
      return (
        <div key={section.id} ref={refCb} className={sectionClass}>
          <h3>{section.title}</h3>
          <div className="project-highlights">
            {visibleHighlights.map((h) => (
              <div
                key={`${h.projectId}-${h.title}`}
                className="highlight-item clickable"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenProject?.(h.projectId);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenProject?.(h.projectId);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProject?.(h.projectId);
                  }
                }}
              >
                <div className="highlight-preview">
                  <img src={h.imageUrl} alt={h.title} />
                </div>
                <div className="highlight-content">
                  <h4>
                    {h.title} ({h.year})
                  </h4>
                  <p>{h.description}</p>
                  {h.award ? <div className="project-award">{h.award}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.variant === 'tools' && section.toolTags?.length) {
      return (
        <div key={section.id} ref={refCb} className={sectionClass}>
          <h3>{section.title}</h3>
          <div className="tools-list">
            {section.toolTags.map((tag) => (
              <span key={tag} className="tool-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div key={section.id} ref={refCb} className={sectionClass}>
        <h3>{section.title}</h3>
        {(section.body ?? '')
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((para, j) => (
            <p key={j}>{para}</p>
          ))}
      </div>
    );
  };

  if (!isOpen) return null;

  const ctaIndex = aboutData.sections.length;

  return createPortal(
    <div
      className="about-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="about-modal-content">
        <button
          className="about-modal-close"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          type="button"
          aria-label="Close about modal"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div
          className="about-modal-scrollable"
          ref={modalContentRef}
          onWheel={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="about-modal-header">
            <div className="about-hero-image">
              <img src={aboutData.heroImage} alt={aboutData.heroImageAlt} />
            </div>
            <div className="about-hero-content">
              <h1>{aboutData.heroTitle}</h1>
              <h2>{aboutData.heroSubtitle}</h2>
              <div className="about-intro" style={{ whiteSpace: 'pre-line' }}>
                {aboutData.intro}
              </div>
            </div>
          </div>

          <div className="about-modal-body">
            {aboutData.sections.map((section, i) => renderSection(section, i))}

            <div
              ref={(el) => {
                sectionRefs.current[ctaIndex] = el;
              }}
              className={`about-section ${visibleSections.has(ctaIndex) ? 'visible' : ''}`}
            >
              <h3>{aboutData.ctaTitle}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{aboutData.ctaBody}</p>
              <div className="about-cta">
                <button
                  className="cta-button secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                    onOpenContact();
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                    onOpenContact();
                  }}
                  type="button"
                >
                  {aboutData.ctaTitle}
                </button>
              </div>
            </div>
          </div>

          {showScrollButton && (
            <button
              className="scroll-down-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const last = document.querySelector('.about-modal-scrollable .about-section:last-of-type');
                if (last) {
                  last.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const last = document.querySelector('.about-modal-scrollable .about-section:last-of-type');
                if (last) {
                  last.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }}
              aria-label="Scroll to bottom section"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AboutModal;
