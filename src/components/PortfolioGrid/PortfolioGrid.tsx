import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDragInertia } from '../../hooks/useDragInertia';
import { ProjectService } from '../../managers/ProjectService';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { ProjectTile } from '../ProjectTile';
import ContactModal from '../ContactModal';
import ProjectModal from '../ProjectModal';
import AboutModal from '../AboutModal';
import { ProjectConfig } from '../../types/Project';
import './PortfolioGrid.css';

/**
 * PortfolioGrid - Main portfolio grid component
 * Single responsibility: Coordinate and render the portfolio grid
 */
const PortfolioGrid: React.FC = () => {
  // State management
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showAffordance, setShowAffordance] = useState(true);
  
  // Responsive grid configuration
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({ width, height });
      
      // Robust mobile detection - explicitly convert to boolean
      const isMobileDevice = Boolean(
        width <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && width <= 1024)
      );
        
      setIsMobile(isMobileDevice);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAffordance(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const gridConfig: ProjectConfig = useMemo(() => {
    const { width } = screenSize;
    
    if (width <= 480) {
      // Mobile phones - 2 rows: 2+2 projects
      return {
        tileWidth: 150,
        tileHeight: 190,
        tileGap: 10,
        visibleCols: 2,
        visibleRows: 3,
        marginCols: 3,
        marginRows: 3
      };
    } else if (width <= 768) {
      // Tablets - 2 rows: 3+3 projects
      return {
        tileWidth: 200,
        tileHeight: 260,
        tileGap: 12,
        visibleCols: 3,
        visibleRows: 3,
        marginCols: 3,
        marginRows: 3
      };
    } else if (width <= 1024) {
      // Small desktop - 2 rows: 4+4 projects
      return {
        tileWidth: 280,
        tileHeight: 360,
        tileGap: 20,
        visibleCols: 4,
        visibleRows: 3,
        marginCols: 2,
        marginRows: 2
      };
    } else {
      // Large desktop - 2 rows: 5+5 projects
      return {
        tileWidth: 300,
        tileHeight: 400,
        tileGap: 20,
        visibleCols: 5,
        visibleRows: 3,
        marginCols: 2,
        marginRows: 2
      };
    }
  }, [screenSize]);
  
  // Initialize services
  const projectService = useMemo(() => new ProjectService(gridConfig), [gridConfig]);
  
  // Update project service when grid config changes
  useEffect(() => {
    projectService.updateConfig(gridConfig);
  }, [projectService, gridConfig]);
  
  // Use custom hooks for functionality
  const { offset, setOffset, onPointerDown, onPointerMove, onPointerUp, isDragging } = useDragInertia();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Keyboard navigation
  useKeyboardNavigation(
    offset,
    setOffset,
    isContactModalOpen || isProjectModalOpen || isAboutModalOpen
  );
  
  const onWheel = (e: React.WheelEvent) => {
    // Don't prevent default if wheel event is on a modal
    const target = e.target as HTMLElement;
    if (target.closest('.about-modal-content, .about-modal-scrollable, .project-modal-container, .project-modal-content, .modal-container, .modal-content')) {
      return; // Let modal handle its own scrolling
    }

    // Only prevent default if we're in desktop mode (custom scrolling)
    if (!isMobile) {
      e.preventDefault();
      const sensitivity = 1.0;
      setOffset((o) => ({ x: o.x - e.deltaX * sensitivity, y: o.y - e.deltaY * sensitivity }));
    }
  };
  
  // Handle project tile click — useCallback prevents new ref on every render (needed for React.memo on tiles)
  const handleProjectClick = useCallback((projectId: number) => {
    setSelectedProjectId(projectId);
    setIsProjectModalOpen(true);
  }, []);
  
  // Calculate grid positioning
  const camX = -offset.x;
  const camY = -offset.y;
  
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  
  const baseLeft = (vw - gridConfig.visibleCols * (gridConfig.tileWidth + gridConfig.tileGap)) / 2;
  const baseTop = (vh - gridConfig.visibleRows * (gridConfig.tileHeight + gridConfig.tileGap)) / 2;
  
  const firstCol = Math.floor((camX - baseLeft) / (gridConfig.tileWidth + gridConfig.tileGap)) - gridConfig.marginCols;
  const firstRow = Math.floor((camY - baseTop) / (gridConfig.tileHeight + gridConfig.tileGap)) - gridConfig.marginRows;
  const colsToDraw = gridConfig.visibleCols + gridConfig.marginCols * 2;
  const rowsToDraw = gridConfig.visibleRows + gridConfig.marginRows * 2;
  
  // Generate grid cells
  const cells = useMemo(() => {
    return projectService.generateGridCells(firstRow, firstCol, rowsToDraw, colsToDraw);
  }, [projectService, firstRow, firstCol, rowsToDraw, colsToDraw]);
  
  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      style={{ 
        position: 'relative', 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden',
        background: 'var(--color-background)', 
        color: 'var(--color-text)', 
        overscrollBehavior: 'none',
        userSelect: 'none',
      } as React.CSSProperties}
    >
      {/* Gallery affordance */}
      {showAffordance && (
        <div className="gallery-affordance is-visible" aria-hidden="true">
          <div className="gallery-affordance-icon">
            <div className="gallery-affordance-trackpad" aria-hidden="true" />
            <div className="gallery-affordance-hand" aria-hidden="true">
              <svg
                viewBox="0 0 36 36"
                role="presentation"
                focusable="false"
                aria-hidden="true"
              >
                <path d="M30.74,15.19a13.66,13.66,0,0,0-6.87-3.83A26,26,0,0,0,18,10.58V5.28A3.4,3.4,0,0,0,14.5,2,3.4,3.4,0,0,0,11,5.28v10L9.4,13.7a3.77,3.77,0,0,0-5.28,0A3.67,3.67,0,0,0,3,16.33a3.6,3.6,0,0,0,1,2.56l4.66,5.52a11.53,11.53,0,0,0,1.43,4,10.12,10.12,0,0,0,2,2.54v1.92a1.07,1.07,0,0,0,1,1.08H27a1.07,1.07,0,0,0,1-1.08v-2.7a12.81,12.81,0,0,0,3-8.36v-6A1,1,0,0,0,30.74,15.19ZM29,21.86a10.72,10.72,0,0,1-2.6,7.26,1.11,1.11,0,0,0-.4.72V32H14.14V30.52a1,1,0,0,0-.44-.83,7.26,7.26,0,0,1-1.82-2.23,9.14,9.14,0,0,1-1.2-3.52,1,1,0,0,0-.23-.59L5.53,17.53a1.7,1.7,0,0,1,0-2.42,1.76,1.76,0,0,1,2.47,0l3,3v3.14l2-1V5.28A1.42,1.42,0,0,1,14.5,4,1.42,1.42,0,0,1,16,5.28v11.8l2,.43V12.59a24.27,24.27,0,0,1,2.51.18V18l1.6.35V13c.41.08.83.17,1.26.28a14.88,14.88,0,0,1,1.53.49v5.15l1.6.35V14.5A11.06,11.06,0,0,1,29,16.23Z" />
              </svg>
            </div>
          </div>
          <div className="gallery-affordance-text">Drag or swipe to explore</div>
        </div>
      )}

      {/* Portfolio Grid Interaction Layer — translate as one unit so tiles don't re-render per frame */}
      <div
        className="grid-interaction-layer"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onMouseEnter={(e) => {
            if ((e.buttons & 4) === 4) {
            (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
          }
        }}
        onMouseMove={(e) => {
          if ((e.buttons & 4) === 4) {
            (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
          } else {
            (e.currentTarget as HTMLElement).style.cursor = 'default';
          }
        }}
        onPointerLeave={(e) => {
          (e.currentTarget as HTMLElement).style.cursor = 'default';
        }}
      >
        {cells.map(({ row, col, projId }) => {
          const project = projectService.getProjectById(projId);
          if (!project) return null;
            if (projId === 17) return null;

          return (
            <ProjectTile
              key={`${row}:${col}`}
              left={baseLeft + col * (gridConfig.tileWidth + gridConfig.tileGap)}
              top={baseTop + row * (gridConfig.tileHeight + gridConfig.tileGap)}
              width={gridConfig.tileWidth}
              height={gridConfig.tileHeight}
              project={project}
              onOpen={handleProjectClick}
                isDragging={isDragging}
            />
          );
        })}
      </div>

      {/* Global: About Me Button */}
      <button
        className="about-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsAboutModalOpen(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsAboutModalOpen(true);
        }}
        aria-label="Open about me modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        About
      </button>

      {/* Global: Contact Button */}
      <button
        className="contact-btn"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsContactModalOpen(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsContactModalOpen(true);
        }}
        aria-label="Open contact modal"
        type="button"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        Contact
      </button>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Project Modal - Portaled to Body */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        projectId={selectedProjectId}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProjectId(null);
        }}
      />

      {/* About Modal - Portaled to Body */}
      <AboutModal 
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenProject={(projectId) => {
          setSelectedProjectId(projectId);
          setIsProjectModalOpen(true);
        }}
      />

    </div>
  );
};

export default PortfolioGrid;
