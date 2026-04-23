import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDragInertia } from '../../hooks/useDragInertia';
import { useSpotlight } from '../../hooks/useSpotlight';
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
  
  // Refs for spotlight effect
  const spotlightOverlayRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  
  // Responsive grid configuration
  const [screenSize, setScreenSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const gridConfig: ProjectConfig = useMemo(() => {
    const { width } = screenSize;
    
    if (width <= 480) {
      // Mobile phones - 2 rows: 2+2 projects
      return {
        tileWidth: 200,
        tileHeight: 250,
        tileGap: 15,
        visibleCols: 2,
        visibleRows: 2,
        marginCols: 2,
        marginRows: 1
      };
    } else if (width <= 768) {
      // Tablets - 2 rows: 3+3 projects
      return {
        tileWidth: 250,
        tileHeight: 320,
        tileGap: 18,
        visibleCols: 3,
        visibleRows: 2,
        marginCols: 2,
        marginRows: 1
      };
    } else if (width <= 1024) {
      // Small desktop - 2 rows: 4+4 projects
      return {
        tileWidth: 280,
        tileHeight: 360,
        tileGap: 20,
        visibleCols: 4,
        visibleRows: 2,
        marginCols: 2,
        marginRows: 1
      };
    } else {
      // Large desktop - 2 rows: 5+5 projects
      return {
        tileWidth: 300,
        tileHeight: 400,
        tileGap: 20,
        visibleCols: 5,
        visibleRows: 2,
        marginCols: 2,
        marginRows: 1
      };
    }
  }, [screenSize]);
  
  // Initialize services
  const projectService = useMemo(() => new ProjectService(gridConfig), []);
  
  // Update project service when grid config changes
  useEffect(() => {
    projectService.updateConfig(gridConfig);
  }, [projectService, gridConfig]);
  
  // Use custom hooks for functionality
  const { offset, setOffset, onPointerDown, onPointerMove, onPointerUp } = useDragInertia();
  const { containerRef, onPointerMove: onSpotlightMove, onPointerLeave: onSpotlightLeave } = useSpotlight(
    spotlightOverlayRef,
    fadeRef
  );
  
  // Keyboard navigation
  useKeyboardNavigation(
    offset,
    setOffset,
    isContactModalOpen || isProjectModalOpen || isAboutModalOpen
  );
  
  // Enhanced wheel events for smoother scrolling
  const wheelAccumulator = useRef({ x: 0, y: 0 });
  const wheelVelocity = useRef({ x: 0, y: 0 });
  const wheelRaf = useRef(0);
  const lastWheelTime = useRef(0);
  
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const now = performance.now();
    const deltaTime = Math.max(1, now - lastWheelTime.current);
    lastWheelTime.current = now;
    
    // Enhanced wheel delta processing
    const deltaX = -e.deltaX;
    const deltaY = -e.deltaY;
    
    // Accumulate wheel deltas with time-based smoothing
    wheelAccumulator.current.x += deltaX;
    wheelAccumulator.current.y += deltaY;
    
    // Calculate velocity for momentum
    wheelVelocity.current.x = deltaX / deltaTime;
    wheelVelocity.current.y = deltaY / deltaTime;
    
    // Cancel previous wheel animation
    if (wheelRaf.current) cancelAnimationFrame(wheelRaf.current);
    
    // Apply accumulated deltas with enhanced smoothing
    wheelRaf.current = requestAnimationFrame(() => {
      const smoothFactor = 0.85; // Slightly increased for better responsiveness
      const momentumFactor = 0.15; // Add momentum from velocity
      
      const dx = (wheelAccumulator.current.x * smoothFactor) + (wheelVelocity.current.x * momentumFactor);
      const dy = (wheelAccumulator.current.y * smoothFactor) + (wheelVelocity.current.y * momentumFactor);
      
      setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
      
      // Reset accumulator with decay
      wheelAccumulator.current.x *= 0.1;
      wheelAccumulator.current.y *= 0.1;
    });
  };
  
  // Handle project tile click
  const handleProjectClick = (projectId: number) => {
    if (projectId === 17) { // About Me project
      setIsAboutModalOpen(true);
    } else {
      setSelectedProjectId(projectId);
      setIsProjectModalOpen(true);
    }
  };
  
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
  
  // Combined pointer move handler
  const handlePointerMove = (e: React.PointerEvent) => {
    onPointerMove(e);
    onSpotlightMove(e);
  };
  
  return (
    <div
      ref={containerRef}
      className="portfolio-container"
      style={{ 
        position: 'relative', 
        height: '100vh', 
        width: '100vw', 
        overflow: 'hidden', 
        background: '#fafafa', 
        color: '#111', 
        overscrollBehavior: 'none',
        userSelect: 'none',
      } as React.CSSProperties}
      onPointerMove={handlePointerMove}
      onPointerLeave={onSpotlightLeave}
    >
      {/* Portfolio Grid */}
      <div
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ position: 'absolute', inset: 0, cursor: 'grab' }}
      >
        {cells.map(({ row, col, projId }) => {
          const project = projectService.getProjectById(projId);
          if (!project) return null;
          
          return (
            <ProjectTile
              key={`${row}:${col}`}
              left={baseLeft + col * (gridConfig.tileWidth + gridConfig.tileGap) + offset.x}
              top={baseTop + row * (gridConfig.tileHeight + gridConfig.tileGap) + offset.y}
              width={gridConfig.tileWidth}
              height={gridConfig.tileHeight}
              project={project}
              onOpen={handleProjectClick}
            />
          );
        })}
      </div>

      {/* About Me Button */}
      <button 
        className="about-btn"
        onClick={() => setIsAboutModalOpen(true)}
        aria-label="Open about me modal"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Shiri Langer
      </button>

      {/* Contact Button */}
      <button 
        className="contact-btn"
        onClick={() => setIsContactModalOpen(true)}
        aria-label="Open contact modal"
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

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isProjectModalOpen}
        projectId={selectedProjectId}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProjectId(null);
        }}
      />

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        onOpenContact={() => setIsContactModalOpen(true)}
        onOpenProject={(projectId) => {
          setSelectedProjectId(projectId);
          setIsProjectModalOpen(true);
        }}
      />

      {/* Spotlight Overlay */}
      <div ref={spotlightOverlayRef} className="spotlight-overlay" />
      <div ref={fadeRef} className="spotlight-fade" />
    </div>
  );
};

export default PortfolioGrid;
