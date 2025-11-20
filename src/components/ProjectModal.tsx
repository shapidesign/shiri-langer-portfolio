import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const processImageRefs = useRef<Map<HTMLImageElement, { src: string; rect: DOMRect }>>(new Map());
  
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
  
  // Handle thumbnail click - memoized to prevent recreation
  const handleThumbnailClick = useCallback((index: number, enlarge: boolean = false) => {
    setCurrentImageIndex(index);
    if (enlarge) {
      setIsImageMaximized(true);
    }
  }, []);

  // Initialize pinch zoom on maximized image
  useEffect(() => {
    if (isImageMaximized && imageRef.current) {
      initPinchZoom(imageRef.current);
    }
  }, [isImageMaximized, initPinchZoom]);



  // Initialize inline image sliders
  useEffect(() => {
    if (!isOpen || !project?.bodyText) return;

    const clickHandlers: Array<{ 
      element: HTMLImageElement; 
      handler: (e: Event) => void;
    }> = [];
    const escHandlers: Array<{ handler: (e: KeyboardEvent) => void }> = [];

    const initInlineSliders = () => {
      const sliders = document.querySelectorAll('.process-image-slider');
      sliders.forEach(slider => {
        const sliderElement = slider as HTMLElement;
        const images = slider.querySelectorAll('.process-image-inline');
        
          // Add click handlers to process images to enlarge them
        images.forEach((img) => {
          const imageElement = img as HTMLImageElement;
          
          // Set high z-index and pointer-events on the image element itself
          imageElement.style.position = 'relative';
          imageElement.style.zIndex = '10005';
          imageElement.style.pointerEvents = 'auto';
          imageElement.style.cursor = 'pointer';
          
          // Store reference for global handler
          processImageRefs.current.set(imageElement, {
            src: imageElement.src,
            rect: imageElement.getBoundingClientRect()
          });
          
          // Enhanced click handler
          const enhancedClickHandler = (e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Always use openProcessImagePopup - it will handle gallery state
            openProcessImagePopup(imageElement.src);
          };
          
          // Use capture phase AND normal phase for maximum reliability
          imageElement.addEventListener('click', enhancedClickHandler, { capture: true });
          imageElement.addEventListener('click', enhancedClickHandler, { capture: false });
          
          clickHandlers.push({ 
            element: imageElement, 
            handler: enhancedClickHandler
          });
          
          const openProcessImagePopup = (imageSrc: string) => {
            // Clean up any existing popups first
            const existingBackdrop = document.querySelector('.process-image-popup-backdrop');
            const existingImg = document.querySelector('.process-image-popup-img');
            const existingCloseBtn = document.querySelector('.process-image-popup-close');
            if (existingBackdrop) existingBackdrop.remove();
            if (existingImg) existingImg.remove();
            if (existingCloseBtn) existingCloseBtn.remove();
            
            // Find if this image is in the project gallery
            const galleryIndex = project?.gallery.findIndex(galleryImg => {
              const galleryFileName = galleryImg.split('/').pop() || '';
              const srcFileName = imageSrc.split('/').pop() || '';
              return srcFileName.includes(galleryFileName) || galleryFileName.includes(srcFileName.split('.')[0]);
            });
            
            if (galleryIndex !== undefined && galleryIndex >= 0) {
              // If image is in gallery, use gallery system
              handleThumbnailClick(galleryIndex, true);
            } else {
              // If not in gallery, create a temporary enlarged view with proper styling
              const backdrop = document.createElement('div');
              backdrop.className = 'process-image-popup-backdrop';
              backdrop.style.position = 'fixed';
              backdrop.style.top = '0';
              backdrop.style.left = '0';
              backdrop.style.width = '100vw';
              backdrop.style.height = '100vh';
              backdrop.style.background = 'rgba(0, 0, 0, 0.85)';
              backdrop.style.zIndex = '10002';
              backdrop.style.cursor = 'pointer';
              backdrop.style.backdropFilter = 'blur(4px)';
              backdrop.style.animation = 'backdropFadeIn 0.3s ease-out';
              
              const tempImg = document.createElement('img');
              tempImg.className = 'process-image-popup-img';
              tempImg.src = imageSrc;
              tempImg.style.position = 'fixed';
              tempImg.style.top = '50%';
              tempImg.style.left = '50%';
              tempImg.style.transform = 'translate(-50%, -50%)';
              tempImg.style.maxWidth = '90vw';
              tempImg.style.maxHeight = '90vh';
              tempImg.style.width = 'auto';
              tempImg.style.height = 'auto';
              tempImg.style.objectFit = 'contain';
              tempImg.style.borderRadius = '12px';
              tempImg.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.8)';
              tempImg.style.cursor = 'pointer';
              tempImg.style.zIndex = '10003';
              tempImg.style.display = 'block';
              tempImg.style.backgroundColor = 'white';
              tempImg.style.padding = '20px';
              tempImg.style.animation = 'imagePopupFadeIn 0.3s ease-out';
              
              // Close button for process images
              const closeBtn = document.createElement('button');
              closeBtn.className = 'process-image-popup-close';
              closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
              closeBtn.style.position = 'fixed';
              closeBtn.style.top = '20px';
              closeBtn.style.right = '20px';
              closeBtn.style.background = 'rgba(255, 255, 255, 0.95)';
              closeBtn.style.border = 'none';
              closeBtn.style.borderRadius = '50%';
              closeBtn.style.width = '40px';
              closeBtn.style.height = '40px';
              closeBtn.style.cursor = 'pointer';
              closeBtn.style.display = 'flex';
              closeBtn.style.alignItems = 'center';
              closeBtn.style.justifyContent = 'center';
              closeBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
              closeBtn.style.transition = 'all 0.2s ease';
              closeBtn.style.zIndex = '10004';
              closeBtn.style.animation = 'imagePopupFadeIn 0.3s ease-out';
              
              closeBtn.onmouseenter = () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 1)';
                closeBtn.style.transform = 'scale(1.1)';
              };
              closeBtn.onmouseleave = () => {
                closeBtn.style.background = 'rgba(255, 255, 255, 0.95)';
                closeBtn.style.transform = 'scale(1)';
              };
              
              const closePopup = () => {
                backdrop.style.animation = 'backdropFadeOut 0.2s ease-out';
                tempImg.style.animation = 'imagePopupFadeOut 0.2s ease-out';
                closeBtn.style.animation = 'imagePopupFadeOut 0.2s ease-out';
                setTimeout(() => {
                  if (document.body.contains(backdrop)) {
                    document.body.removeChild(backdrop);
                  }
                  if (document.body.contains(tempImg)) {
                    document.body.removeChild(tempImg);
                  }
                  if (document.body.contains(closeBtn)) {
                    document.body.removeChild(closeBtn);
                  }
                }, 200);
              };
              
              // Handle ESC key
              const handleEsc = (e: KeyboardEvent) => {
                if (e.key === 'Escape' && document.body.contains(backdrop)) {
                  closePopup();
                  document.removeEventListener('keydown', handleEsc);
                }
              };
              
              tempImg.onclick = closePopup;
              backdrop.onclick = closePopup;
              closeBtn.onclick = closePopup;
              document.addEventListener('keydown', handleEsc);
              escHandlers.push({ handler: handleEsc });
              
              document.body.appendChild(backdrop);
              document.body.appendChild(tempImg);
              document.body.appendChild(closeBtn);
            }
          };
          
        });
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
    
    return () => {
      clearTimeout(timer);
      // Clean up click handlers
      clickHandlers.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler, { capture: true });
        element.removeEventListener('click', handler, { capture: false });
        element.onclick = null;
        // Reset styles
        element.style.position = '';
        element.style.zIndex = '';
        element.style.pointerEvents = '';
        element.style.cursor = '';
        // Remove from refs
        processImageRefs.current.delete(element);
      });
      // Clean up ESC handlers
      escHandlers.forEach(({ handler }) => {
        document.removeEventListener('keydown', handler);
      });
      // Clean up any existing popups
      const existingBackdrop = document.querySelector('.process-image-popup-backdrop');
      const existingImg = document.querySelector('.process-image-popup-img');
      const existingCloseBtn = document.querySelector('.process-image-popup-close');
      if (existingBackdrop) existingBackdrop.remove();
      if (existingImg) existingImg.remove();
      if (existingCloseBtn) existingCloseBtn.remove();
    };
  }, [isOpen, project?.bodyText, project?.gallery, handleThumbnailClick, setIsImageMaximized]);

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

  // Reset image index and maximize state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
      setIsImageMaximized(false);
    }
  }, [isOpen]);

  // Document-level click handler for when gallery backdrop is active
  useEffect(() => {
    if (!isImageMaximized) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if click is on a process image
      if (target.classList.contains('process-image-inline')) {
        e.preventDefault();
        e.stopPropagation();
        
        const processImg = target as HTMLImageElement;
        const imageSrc = processImg.src;
        
        // Close gallery first
        setIsImageMaximized(false);
        
        // Wait for backdrop removal, then open process image
        const openProcessImage = () => {
          const backdropStillThere = document.querySelector('.maximized-image-backdrop');
          if (backdropStillThere) {
            requestAnimationFrame(openProcessImage);
          } else {
            // Trigger click on the process image to open it
            setTimeout(() => {
              processImg.click();
            }, 50);
          }
        };
        
        requestAnimationFrame(openProcessImage);
        return;
      }
      
      // Check if clicking on gallery image or close button - they handle their own clicks
      if (target.closest('.maximized-image-popup') || 
          target.closest('button[style*="z-index: 10001"]')) {
        return;
      }
      
      // Check if clicking on backdrop itself or empty space using elementFromPoint
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      
      // If element at point is backdrop or body (empty space), close gallery
      if (elementAtPoint?.classList.contains('maximized-image-backdrop') ||
          elementAtPoint === document.body ||
          elementAtPoint === document.documentElement) {
        setIsImageMaximized(false);
      }
    };

    // Use capture phase to catch clicks before they propagate
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isImageMaximized, setIsImageMaximized]);


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
          {/* Visual backdrop - non-interactive so clicks pass through */}
          <div 
            className="maximized-image-backdrop"
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              width: '100vw', 
              height: '100vh', 
              background: 'rgba(0, 0, 0, 0.9)', 
              zIndex: 9999,
              backdropFilter: 'blur(4px)',
              animation: 'backdropFadeIn 0.3s ease-out',
              pointerEvents: 'none' // Allow clicks to pass through to process images
            }}
          />
          {/* Invisible clickable overlay for closing gallery - only handles empty space */}
          <div
            onClick={(e) => {
              // Only close if clicking directly on this overlay (empty space)
              if (e.target === e.currentTarget) {
                setIsImageMaximized(false);
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9998, // Below backdrop but still handles clicks
              background: 'transparent',
              pointerEvents: 'auto'
            }}
          />
          {/* Close button - positioned independently */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent backdrop click
              setIsImageMaximized(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation(); // Prevent overlay click
            }}
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
              animation: 'imagePopupFadeIn 0.3s ease-out',
              pointerEvents: 'auto' // Ensure close button is clickable
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
            onClick={(e) => {
              e.stopPropagation(); // Prevent backdrop click
              setIsImageMaximized(false);
              resetZoom();
            }}
            onMouseDown={(e) => {
              e.stopPropagation(); // Prevent overlay click
            }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: project.gallery[currentImageIndex]?.endsWith('.gif') ? '100vw' : '90vw',
              maxHeight: project.gallery[currentImageIndex]?.endsWith('.gif') ? '100vh' : '90vh',
              width: project.gallery[currentImageIndex]?.endsWith('.gif') ? '100vw' : 'auto',
              height: project.gallery[currentImageIndex]?.endsWith('.gif') ? '100vh' : 'auto',
              objectFit: project.gallery[currentImageIndex]?.endsWith('.gif') ? 'cover' : 'contain',
              borderRadius: project.gallery[currentImageIndex]?.endsWith('.gif') ? '0' : '12px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
              cursor: 'pointer',
              display: 'block',
              zIndex: 10000,
              animation: 'imagePopupFadeIn 0.3s ease-out',
              transition: 'transform 0.2s ease',
              willChange: 'transform',
              touchAction: 'pan-x pan-y pinch-zoom',
              pointerEvents: 'auto' // Ensure gallery image is clickable
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
                    onClick={(e) => {
                      e.stopPropagation();
                      if (index === currentImageIndex) {
                        // If clicking the already active thumbnail, enlarge it
                        handleImageClick(e as any);
                      } else {
                        // If clicking a different thumbnail, switch and enlarge
                        handleThumbnailClick(index, true);
                      }
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
