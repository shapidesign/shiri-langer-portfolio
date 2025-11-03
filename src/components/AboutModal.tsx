import React, { useEffect, useRef, useState } from 'react';
import './AboutModal.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
  onOpenProject?: (projectId: number) => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContact, onOpenProject }) => {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [showScrollButton, setShowScrollButton] = useState(true);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const modalContentRef = useRef<HTMLDivElement>(null);

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
              setVisibleSections(prev => new Set(Array.from(prev).concat(index)));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isOpen]);

  // Handle scroll detection for scroll button visibility
  useEffect(() => {
    if (!isOpen || !modalContentRef.current) return;

    const handleScroll = () => {
      const modalContent = modalContentRef.current;
      if (!modalContent) return;

      const scrollTop = modalContent.scrollTop;
      const scrollHeight = modalContent.scrollHeight;
      const clientHeight = modalContent.clientHeight;
      
      // Show button if not at bottom (with 50px threshold)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowScrollButton(!isAtBottom);
    };

    const modalContent = modalContentRef.current;
    modalContent.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();

    return () => {
      modalContent.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="about-modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="about-modal-scrollable" ref={modalContentRef}>
          <div className="about-modal-header">
          <div className="about-hero-image">
            <img src="/assets/images/Shiri.jpg" alt="Shiri Langer" />
          </div>
          <div className="about-hero-content">
            <h1>Shiri Langer</h1>
            <h2>Industrial Designer</h2>
            <p className="about-intro">
              An industrial designer based in Tel Aviv and Milan, focusing on creating <b>meaningful products</b> that improve everyday life.
              My work is driven by empathy, curiosity, and a commitment to combining creative thinking with hands-on making.
            </p>
          </div>
        </div>

        <div className="about-modal-body">
          <div 
            ref={(el) => { sectionRefs.current[0] = el; }}
            className={`about-section ${visibleSections.has(0) ? 'visible' : ''}`}
          >
            <h3>Design Philosophy</h3>
            <p>
              I believe that thoughtful design has the power to address both emotional and physical challenges that words alone cannot resolve. 
              For me, well-designed products are those that place <b>people at the center</b>, creating solutions that not only function effectively but also foster comfort, empathy, and emotional connection.
            </p>
          </div>

          <div 
            ref={(el) => { sectionRefs.current[1] = el; }}
            className={`about-section ${visibleSections.has(1) ? 'visible' : ''}`}
          >
            <h3>Areas of Expertise</h3>
            <div className="expertise-grid">
              <div className="expertise-item">
                <h4>Product Development & Manufacturing</h4>
                <p>End-to-end product development from concept to production, specializing in injection molding, CNC machining, extrusion, and innovative manufacturing technologies</p>
              </div>
              <div className="expertise-item">
                <h4>Medical & Inclusive Design</h4>
                <p>Human-centered design for healthcare and accessibility, with experience at Sheba Medical Center and consulting for JDC-Israel</p>
              </div>
              <div className="expertise-item">
                <h4>Advanced Prototyping & Fabrication</h4>
                <p>Expert in 3D modeling (SolidWorks, Rhino, Onshape), 3D printing, CNC machining, woodworking, and traditional model making</p>
              </div>
              <div className="expertise-item">
                <h4>Design Studio Leadership</h4>
                <p>Building and leading in-house design teams within manufacturing environments, driving innovation and creative excellence</p>
              </div>
              <div className="expertise-item">
                <h4>Visual Design & AI Integration</h4>
                <p>Proficient in Adobe Creative Suite and AI-powered design platforms (Vizcom, Krea, Runway, Midjourney) for visualization and rapid ideation</p>
              </div>
              <div className="expertise-item">
                <h4>Collaborative Design Thinking</h4>
                <p>Leading multidisciplinary teams through human-centered design processes, fostering creativity and excellence in both process and outcome</p>
              </div>
            </div>
          </div>

          <div 
            ref={(el) => { sectionRefs.current[2] = el; }}
            className={`about-section ${visibleSections.has(2) ? 'visible' : ''}`}
          >
            <h3>Notable Projects</h3>
            <div className="project-highlights">
              <div 
                className="highlight-item clickable"
                onClick={() => {
                  if (onOpenProject) {
                    onOpenProject(1);
                  }
                }}
              >
                <div className="highlight-preview">
                  <img src="/assets/images/tomi.jpg" alt="TOMI" />
                </div>
                <div className="highlight-content">
                  <h4>TOMI (2025)</h4>
                  <p>Graduation project, a sculptural object for parent–child interaction in stressful moments.</p>
                  <div className="project-award">Shortlisted, Isola Design Awards 2025</div>
                </div>
              </div>
              <div 
                className="highlight-item clickable"
                onClick={() => {
                  if (onOpenProject) {
                    onOpenProject(3);
                  }
                }}
              >
                <div className="highlight-preview">
                  <img src="/assets/images/3dfilters.png" alt="3D Filter" />
                </div>
                <div className="highlight-content">
                  <h4>3D FILTER (2025)</h4>
                  <p>Conceptual wearables translating digital beauty filters into physical form.</p>
                </div>
              </div>
              <div 
                className="highlight-item clickable"
                onClick={() => {
                  if (onOpenProject) {
                    onOpenProject(4);
                  }
                }}
              >
                <div className="highlight-preview">
                  <img src="/assets/images/pita.JPG" alt="PITA" />
                </div>
                <div className="highlight-content">
                  <h4>PITA (2023)</h4>
                  <p>Outdoor balance-training product for playful physical activity.</p>
                  <div className="project-award">Winner, FIT Sport Design Awards 2025</div>
                </div>
              </div>
            </div>
          </div>

          <div 
            ref={(el) => { sectionRefs.current[3] = el; }}
            className={`about-section ${visibleSections.has(3) ? 'visible' : ''}`}
          >
            <h3>Tools & Technologies</h3>
            <div className="tools-list">
              <span className="tool-tag">Adobe Illustrator</span>
              <span className="tool-tag">Adobe Photoshop</span>
              <span className="tool-tag">Adobe InDesign</span>
              <span className="tool-tag">Adobe Lightroom</span>
              <span className="tool-tag">Adobe XD</span>
              <span className="tool-tag">Adobe After Effects</span>
              <span className="tool-tag">Figma</span>
              <span className="tool-tag">Sketch</span>
              <span className="tool-tag">Principle</span>
              <span className="tool-tag">SolidWorks</span>
              <span className="tool-tag">3D Modeling</span>
              <span className="tool-tag">CAD Modeling</span>
              <span className="tool-tag">3D Printing</span>
              <span className="tool-tag">CNC Machining</span>
              <span className="tool-tag">Photography</span>
              <span className="tool-tag">Typography</span>
              <span className="tool-tag">User Research</span>
              <span className="tool-tag">Prototyping</span>
              <span className="tool-tag">Material Research</span>
              <span className="tool-tag">Web Development</span>
              <span className="tool-tag">React</span>
              <span className="tool-tag">CSS</span>
              <span className="tool-tag">Variable Fonts</span>
              <span className="tool-tag">Glyphs</span>
            </div>
          </div>

          <div 
            ref={(el) => { sectionRefs.current[4] = el; }}
            className={`about-section ${visibleSections.has(4) ? 'visible' : ''}`}
          >
            <h3>Let's Work Together</h3>
            <p>
              I'm passionate about creating meaningful products that address real human needs through 
              thoughtful design. Whether you're developing a new product from concept to production, 
              need inclusive design solutions for healthcare, or want to explore innovative manufacturing 
              approaches, I'd love to collaborate on your project. Let's combine creative thinking with 
              hands-on making to create solutions that foster comfort, empathy, and emotional connection.
            </p>
            <div className="about-cta">
              <button 
                className="cta-button secondary"
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
              >
                Let's Work Together
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Down Button */}
        {showScrollButton && (
          <button 
            className="scroll-down-btn"
            onClick={() => {
              const workTogetherSection = document.querySelector('.about-section:last-child');
              if (workTogetherSection) {
                workTogetherSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }}
            aria-label="Scroll to Let's Work Together section"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
