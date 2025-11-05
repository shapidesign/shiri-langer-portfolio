import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ProjectText, getProjectText } from '../config/projectTexts';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { usePinchZoom } from '../hooks/usePinchZoom';
import './ProjectModal.css';

interface ProjectModalProps {
  isOpen: boolean;
  projectId: number | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, projectId, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const project = projectId ? getProjectText(projectId) : null;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageMaximized, setIsImageMaximized] = useState(false);
  
  // Swipe navigation for gallery
  useSwipeNavigation(galleryRef, {
    onSwipeLeft: () => {
      if (project && project.gallery.length > 1) {
        setCurrentImageIndex((prev) => 
          prev < project.gallery.length - 1 ? prev + 1 : 0
        );
      }
    },
    onSwipeRight: () => {
      if (project && project.gallery.length > 1) {
        setCurrentImageIndex((prev) => 
          prev > 0 ? prev - 1 : project.gallery.length - 1
        );
      }
    },
    enabled: isOpen && isImageMaximized
  });
  
  // Pinch-to-zoom for maximized images
  const { initialize: initPinchZoom, handlePinch, startPinch, resetZoom } = usePinchZoom({
    minScale: 1,
    maxScale: 3,
    onZoomEnd: () => {
      // Reset zoom when closing
      if (!isImageMaximized) {
        resetZoom();
      }
    }
  });
  
  // Initialize pinch zoom on maximized image
  useEffect(() => {
    if (isImageMaximized && imageRef.current) {
      initPinchZoom(imageRef.current);
    }
  }, [isImageMaximized, initPinchZoom]);

  // Initialize inline image sliders
  useEffect(() => {
    if (!isOpen || !project?.bodyText) return;

    const initInlineSliders = () => {
      const sliders = document.querySelectorAll('.process-image-slider');
      sliders.forEach(slider => {
        const sliderElement = slider as HTMLElement;
        const images = slider.querySelectorAll('.process-image-inline');
        if (images.length > 1) {
          // Calculate if images fit within container width
          const containerWidth = sliderElement.offsetWidth;
          const isMobile = window.innerWidth <= 768;
          const imageWidth = (isMobile ? 150 : 200) + 8; // Fixed width + gap (8px)
          const totalImagesWidth = images.length * imageWidth;
          const needsNavigation = totalImagesWidth > containerWidth;
          
          if (needsNavigation) {
            // Remove existing buttons if any
            const existingBtns = slider.querySelectorAll('.inline-slider-nav-btn');
            existingBtns.forEach(btn => btn.remove());
            
            // Create navigation buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'inline-slider-nav-btn inline-slider-prev';
            prevBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"></polyline></svg>';
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'inline-slider-nav-btn inline-slider-next';
            nextBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6"></polyline></svg>';
            
            // Add buttons to slider
            sliderElement.style.position = 'relative';
            sliderElement.appendChild(prevBtn);
            sliderElement.appendChild(nextBtn);
            
            // Navigation logic
            let currentIndex = 0;
            const maxIndex = images.length - 1;
            
            const updateSlider = () => {
              const maxScroll = Math.max(0, (images.length * imageWidth) - containerWidth);
              const scrollPosition = Math.min(currentIndex * imageWidth, maxScroll);
              sliderElement.scrollTo({ left: scrollPosition, behavior: 'smooth' });
              
              // Update button visibility
              prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
              nextBtn.style.display = currentIndex < maxIndex ? 'flex' : 'none';
            };
            
            prevBtn.addEventListener('click', () => {
              if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
              }
            });
            
            nextBtn.addEventListener('click', () => {
              if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
              }
            });
            
            // Initial setup
            setTimeout(updateSlider, 100);
          }
        }
      });
    };

    // Initialize after a short delay to ensure DOM is ready
    const timer = setTimeout(initInlineSliders, 100);
    
    return () => clearTimeout(timer);
  }, [isOpen, project?.bodyText]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !project) return;

      switch (e.key) {
        case 'Escape':
          if (isImageMaximized) {
            setIsImageMaximized(false);
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentImageIndex((prev: number) => 
            prev > 0 ? prev - 1 : project.gallery.length - 1
          );
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentImageIndex((prev: number) => 
            prev < project.gallery.length - 1 ? prev + 1 : 0
          );
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, project]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isImageMaximized) {
      onClose();
    }
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Reset image index and maximize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsImageMaximized(false);
    }
  }, [isOpen]);


  // Handle image click to maximize/minimize
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal backdrop click
    setIsImageMaximized(!isImageMaximized);
  };

  if (!isOpen || !project) return null;

  return (
    <>
      {/* Maximized image - rendered as portal to document body */}
      {isImageMaximized && createPortal(
        <>
          <div 
            className="maximized-image-backdrop"
            onClick={() => setIsImageMaximized(false)}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              background: 'rgba(0, 0, 0, 0.9)', 
              zIndex: 9999,
              backdropFilter: 'blur(4px)',
              animation: 'backdropFadeIn 0.3s ease-out'
            }}
          />
          {/* Close button - positioned independently */}
          <button
            onClick={() => setIsImageMaximized(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease',
              zIndex: 10001,
              animation: 'imagePopupFadeIn 0.3s ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          {/* Image - positioned independently with pinch zoom support */}
          <img 
            src={project.gallery[currentImageIndex]} 
            alt={project.title}
            className="maximized-image-popup"
            onClick={() => {
              setIsImageMaximized(false);
              resetZoom();
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '90vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              cursor: 'pointer',
              display: 'block',
              zIndex: 10000,
              animation: 'imagePopupFadeIn 0.3s ease-out',
              transition: 'transform 0.2s ease',
              willChange: 'transform',
              touchAction: 'pan-x pan-y pinch-zoom'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
            }}
          />
        </>,
        document.body
      )}
      
      <div 
        className="project-modal-backdrop" 
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
      <div className="project-modal-container" ref={modalRef}>
        {/* Modal Header */}
        <div className="project-modal-header">
          <div className="project-header-info">
            <h2 id="project-modal-title" className="project-modal-title">{project.title}</h2>
            <p className="project-modal-subtitle">{project.subtitle}</p>
            <div className="project-meta">
              <span className="project-year">{project.year}</span>
              {project.client && (
                <span 
                  className="project-client"
                  data-award={project.client.toLowerCase().includes('shortlisted') || 
                             project.client.toLowerCase().includes('award') || 
                             project.client.toLowerCase().includes('winner') || 
                             project.client.toLowerCase().includes('nomination') ? 'true' : 'false'}
                >
                  {project.client}
                </span>
              )}
            </div>
          </div>
          <button 
            className="project-modal-close-btn" 
            onClick={onClose}
            aria-label="Close project modal"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div 
          className="project-modal-content"
          onWheel={(e) => {
            // Allow scrolling in modal - stop propagation to prevent PortfolioGrid from handling it
            e.stopPropagation();
          }}
        >
          {/* Project Gallery */}
          <div className="project-gallery" ref={galleryRef}>
            <div className="gallery-main">
              {project.gallery.length > 1 && (
                <button 
                  className="gallery-nav-btn gallery-nav-prev"
                  onClick={() => setCurrentImageIndex((prev: number) => 
                    prev > 0 ? prev - 1 : project.gallery.length - 1
                  )}
                  aria-label="Previous image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </button>
              )}
              <img 
                ref={imageRef}
                src={project.gallery[currentImageIndex]} 
                alt={project.title}
                className="gallery-main-image"
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
                title="Click to enlarge"
              />
              {project.gallery.length > 1 && (
                <button 
                  className="gallery-nav-btn gallery-nav-next"
                  onClick={() => setCurrentImageIndex((prev: number) => 
                    prev < project.gallery.length - 1 ? prev + 1 : 0
                  )}
                  aria-label="Next image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </button>
              )}
            </div>
            {project.gallery.length > 1 && (
              <div className="gallery-thumbnails">
                {project.gallery.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${project.title} - Image ${index + 1}`}
                    className={`gallery-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => {
                      handleThumbnailClick(index);
                      setIsImageMaximized(false); // Reset maximize when switching images
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="project-details">
            {/* Body Text with Process Images */}
            {project.bodyText ? (
              <div className="project-body-text">
                <div 
                  className="body-text-content"
                  dangerouslySetInnerHTML={{ __html: project.bodyText }}
                />
              </div>
            ) : (
              /* Fallback to structured content if no body text */
              <>
                {/* Description */}
                <div className="project-section">
                  <h3 className="section-title">About This Project</h3>
                  <p className="project-description">{project.fullDescription}</p>
                </div>

                {/* Challenges */}
                <div className="project-section">
                  <h3 className="section-title">Challenges</h3>
                  <p className="project-text">{project.challenges}</p>
                </div>

                {/* Solutions */}
                <div className="project-section">
                  <h3 className="section-title">Solutions</h3>
                  <p className="project-text">{project.solutions}</p>
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-section">
                    <h3 className="section-title">Technologies & Tools</h3>
                    <div className="technologies-list">
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="technology-item">{tech}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Results */}
                {project.results && (
                  <div className="project-section">
                    <h3 className="section-title">Results</h3>
                    <p className="project-text">{project.results}</p>
                  </div>
                )}

                {/* Testimonial */}
                {project.testimonial && (
                  <div className="project-section testimonial-section">
                    <h3 className="section-title">Client Testimonial</h3>
                    <blockquote className="testimonial">
                      <p className="testimonial-text">"{project.testimonial.text}"</p>
                      <cite className="testimonial-author">
                        <span className="author-name">{project.testimonial.author}</span>
                        <span className="author-role">{project.testimonial.role}</span>
                      </cite>
                    </blockquote>
                  </div>
                )}
              </>
            )}

            {/* Links */}
            {project.links && (
              <div className="project-section">
                <h3 className="section-title">View Project</h3>
                <div className="project-links">
                  {project.links.live && (
                    <a 
                      href={project.links.live} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link primary"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15,3 21,3 21,9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      View Live Site
                    </a>
                  )}
                  {project.links.behance && (
                    <a 
                      href={project.links.behance} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                        <path d="M8 12h8"/>
                        <path d="M12 8v8"/>
                      </svg>
                      Behance
                    </a>
                  )}
                  {project.links.dribbble && (
                    <a 
                      href={project.links.dribbble} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
                      </svg>
                      Dribbble
                    </a>
                  )}
                  {project.links.github && (
                    <a 
                      href={project.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Tags - moved to bottom */}
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProjectModal;
