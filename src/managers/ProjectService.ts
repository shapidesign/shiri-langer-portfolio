import { Project, ProjectConfig, GridCell } from '../types/Project';
import { PROJECT_TEXTS } from '../config/projectTexts';

/**
 * ProjectService - Manages project data and grid generation
 * Single responsibility: Handle project data and grid cell generation
 */
export class ProjectService {
  private projects: Project[] = [];
  private config: ProjectConfig;
  private projectCache: Map<string, number> = new Map();

  // Available tags for project generation
  private readonly TAGS = [
    'Branding', 'UI/UX', 'Print', 'Packaging', 'Typography', 'Illustration', 
    'Web Design', 'Mobile', 'Photography', 'Motion'
  ];

  // Project templates
  private readonly PROJECT_TEMPLATES = [
    "Tomi", "Chair 1", "3D Filters", "PITA", "Project Itamar", "Lamp Design", 
    "Rocky Stool", "Solidwork", "Mico", "A Bowl and A Pile", "EVE", "K-SENSE", 
    "Ember", "Dancing Pot", "Tambourine", "Coffee Machine", "About Me",
    "Interactive Design", "Dashboard Design", "Print Campaign", "Concept Art", 
    "Lettering Design", "Editorial Illustration", "Lifestyle Photography", 
    "SaaS Platform", "Animation Design", "Museum Design", "Art Exhibition", 
    "Product Launch", "Campaign Design", "Brand Refresh", "Digital Strategy",
    "Content Creation", "Visual Storytelling", "User Research", "Prototype Design", 
    "Interface Audit"
  ];

  // Project descriptions
  private readonly DESCRIPTIONS = [
    "A comprehensive design project that showcases innovative thinking and creative problem-solving.",
    "Modern design approach focusing on user experience and visual communication.",
    "Clean, minimalist design that emphasizes functionality and aesthetic appeal.",
    "Creative solution that balances form and function in contemporary design.",
    "Thoughtful design that tells a story through visual elements and typography.",
    "Strategic design approach that enhances brand recognition and user engagement.",
    "Innovative design solution that pushes creative boundaries while maintaining usability.",
    "Bold visual identity that captures the essence of modern brand communication.",
    "User-centered design that prioritizes accessibility and intuitive interaction.",
    "Experimental approach that challenges conventional design boundaries.",
    "Sophisticated design system that ensures consistency across all touchpoints.",
    "Emotional design that connects with audiences through compelling visual narratives.",
    "Data-driven design solution that optimizes user engagement and conversion.",
    "Sustainable design approach that considers environmental impact and longevity.",
    "Cross-platform design that maintains brand integrity across all devices.",
    "Collaborative design process that brings together diverse creative perspectives.",
    "Research-based design that addresses real user needs and pain points.",
    "Award-winning design that sets new standards in the industry.",
    "Scalable design solution that grows with business needs and requirements.",
    "Cultural design that respects and celebrates diverse perspectives and traditions."
  ];

  // Client names
  private readonly CLIENTS = [
    "Creative Agency", "Tech Startup", "Fashion Brand", "Healthcare Company", "Food & Beverage",
    "Entertainment Studio", "Educational Institution", "Financial Services", "Real Estate", "Travel Company",
    "Sports Organization", "Beauty Brand", "Automotive Company", "Gaming Studio", "Music Label",
    "Art Gallery", "Non-profit Organization", "Government Agency", "Consulting Firm", "Manufacturing Company"
  ];

  constructor(config: ProjectConfig) {
    this.config = config;
    this.generateProjects();
  }

  /**
   * Update configuration and clear cache
   */
  public updateConfig(newConfig: ProjectConfig): void {
    this.config = newConfig;
    this.clearCache();
  }

  /**
   * Generate project data from PROJECT_TEXTS
   */
  private generateProjects(): void {
    const projects: Project[] = [];
    const projectMap = new Map<number, Project>();
    
    // Create a map of all projects from PROJECT_TEXTS (excluding "About Me" - ID 17)
    for (const projectText of PROJECT_TEXTS) {
      // Filter out "About Me" project (ID 17) - it should only open from About button
      if (projectText.id === 17) continue;
      
      const project: Project = {
        id: projectText.id,
        title: projectText.title,
        subtitle: projectText.subtitle,
        img: projectText.gallery && projectText.gallery.length > 0 
          ? projectText.gallery[0] // Use first gallery image as display image
          : this.getProjectImageById(projectText.id), // Fallback to ID mapping
        year: projectText.year,
        tags: projectText.tags,
        description: projectText.description,
        client: projectText.client
      };
      
      projectMap.set(projectText.id, project);
    }
    
    // Fixed project order as requested by user
    // Line 1: 3d filter, bowl, chair, coffee machine, eva, ember, itamar, ksense
    // Line 2: lamp, mico, pita, pot, stool, solid, tambourine, tomi
    const fixedOrder: number[] = [
      // Row 0 (Line 1)
      3,   // 3D Filters
      10,  // Bowl
      2,   // Chair
      16,  // Coffee Machine
      11,  // EVE
      13,  // Ember
      5,   // Itamar
      12,  // K-SENSE
      // Row 1 (Line 2)
      6,   // Lamp
      9,   // MICO
      4,   // PITA
      14,  // Pot
      7,   // Stool
      8,   // Solidworks
      15,  // Tambourine
      1    // Tomi
    ];
    
    // Build projects array in fixed order
    for (const projectId of fixedOrder) {
      const project = projectMap.get(projectId);
      if (project) {
        projects.push(project);
      }
    }
    
    this.projects = projects;
  }

  /**
   * Get project image path based on project ID
   */
  private getProjectImageById(projectId: number): string {
    const imageMap: Record<number, string> = {
      1: 'tomi/TomiDisplay1.webp',
      2: 'chair/chair-display-2.webp',
      3: '3dfilters/filterdisplay.webp',
      4: 'pita/pita-display.webp',
      5: 'itamar/itadisp.webp',
      6: 'lamp/lampdis.webp',
      7: 'stool/DisplayStool.webp',
      8: 'solidworks/Soliddisp.webp',
      9: 'mico/micodis.webp',
      10: 'bowl/bowldisplay.webp',
      11: 'eve/robotdisplay.webp',
      12: 'ksense/kdisplay.webp',
      13: 'ember/emberdis.webp',
      14: 'pot/disco plante 1 (convert.io).webp',
      15: 'tambourine/tambdis.webp',
      16: 'coffee/cofdis.webp',
      17: 'Shiri.jpg' // About Me
    };
    
    return `/assets/images/${imageMap[projectId] || 'default.jpg'}`;
  }

  /**
   * Get project by ID
   */
  public getProjectById(id: number): Project | undefined {
    return this.projects.find(project => project.id === id);
  }

  /**
   * Get all projects
   */
  public getAllProjects(): Project[] {
    return this.projects;
  }

  /**
   * Hash function to generate a deterministic value from row and col
   * This ensures the same position always shows the same project
   */
  private hashPosition(row: number, col: number): number {
    // Use a simple hash function that creates a deterministic value
    // Combine row and col with prime numbers for good distribution
    const hash = ((row * 73856093) ^ (col * 19349663)) >>> 0;
    return hash;
  }

  /**
   * Get project index for grid position using hash-based infinite grid
   * Row 0 (line 1): 3d filter, bowl, chair, coffee, eva, ember, itamar, ksense
   * Row 1 (line 2): lamp, mico, pita, pot, stool, solid, tambourine, tomi
   * Uses hash-based positioning for infinite scrolling
   */
  public getProjectIndex(row: number, col: number): number | null {
    // Normalize row to 0 or 1 (only 2 rows repeat)
    let normalizedRow = row % 2;
    if (normalizedRow < 0) {
      normalizedRow = normalizedRow + 2;
    }
    if (normalizedRow < 0 || normalizedRow > 1) {
      return null;
    }
    
    // Create cache key for this position
    const cacheKey = `${normalizedRow},${col}`;
    
    // Check cache first
    if (this.projectCache.has(cacheKey)) {
      const cachedIndex = this.projectCache.get(cacheKey)!;
      if (cachedIndex >= 0 && cachedIndex < this.projects.length) {
        return cachedIndex;
      }
    }
    
    // Use hash to determine project index
    // For row 0, use projects 0-7, for row 1, use projects 8-15
    const baseIndex = normalizedRow * 8;
    const rowProjects = this.projects.slice(baseIndex, baseIndex + 8);
    
    if (rowProjects.length === 0) {
      return null;
    }
    
    // Use hash to select which project from this row's set
    const hash = this.hashPosition(normalizedRow, col);
    const projectIndex = baseIndex + (hash % rowProjects.length);
    
    // Cache the result
    this.projectCache.set(cacheKey, projectIndex);
    
    return projectIndex;
  }

  /**
   * Generate grid cells for visible area with hash-based infinite grid
   * Rows 0 and 1 repeat endlessly using hash-based positioning
   */
  public generateGridCells(
    firstRow: number,
    firstCol: number,
    rowsToDraw: number,
    colsToDraw: number
  ): GridCell[] {
    const cells: GridCell[] = [];
    
    // Always generate rows 0 and 1 for the infinite pattern
    // Rows repeat vertically - always show exactly 2 rows (0 and 1)
    for (let displayRow = 0; displayRow < 2; displayRow++) {
      // Normalize row to 0 or 1 for hash calculation
      let normalizedRow = (firstRow + displayRow) % 2;
      if (normalizedRow < 0) {
        normalizedRow = normalizedRow + 2;
      }
      
      // Generate columns for the visible area - can be any number (infinite)
      for (let c = 0; c < colsToDraw; c++) {
        const col = firstCol + c;
        
        const idx = this.getProjectIndex(normalizedRow, col);
        
        // Only add cell if project index is valid
        if (idx !== null && this.projects[idx]) {
          // Use actual row position for rendering, but normalized row for project selection
          cells.push({ row: firstRow + displayRow, col, projId: this.projects[idx].id });
        }
      }
    }
    
    return cells;
  }

  /**
   * Get grid configuration
   */
  public getConfig(): ProjectConfig {
    return this.config;
  }

  /**
   * Clear project cache (useful for refreshing the grid)
   */
  public clearCache(): void {
    this.projectCache.clear();
  }
}
