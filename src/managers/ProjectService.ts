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
        img: this.getProjectImage(projectText.id - 1), // Convert to 0-based index
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
   * Get project image path based on index
   */
  private getProjectImage(index: number): string {
    const imageMap: Record<number, string> = {
      0: 'tomi/TomiDisplay1.webp',
      1: 'chair/chair-display-2.webp',
      2: '3dfilters/filterdisplay.webp',
      3: 'pita/pita-display.webp',
      4: 'itamar/itadisp.webp',
      5: 'lamp/lampdis.webp',
      6: 'stool/DisplayStool.webp',
      7: 'solidworks/Soliddisp.webp',
      8: 'mico/micodis.webp',
      9: 'bowl/bowldisplay.webp',
      10: 'eve/robotdisplay.webp',
      11: 'ksense/kdisplay.webp',
      12: 'ember/emberdis.webp',
      13: 'pot/disco plante 1 (convert.io).webp',
      14: 'tambourine/tambdis.webp',
      15: 'coffee/cofdis.webp',
      16: 'Shiri.jpg'
    };
    
    return `/assets/images/${imageMap[index] || 'default.jpg'}`;
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
   * Get project index for grid position using fixed order
   * Row 0 (line 1): 3d filter, bowl, chair, coffee, eva, ember, itamar, ksense
   * Row 1 (line 2): lamp, mico, pita, pot, stool, solid, tambourine, tomi
   */
  public getProjectIndex(row: number, col: number): number {
    // Only show the first two rows (rows 0 and 1) with fixed project order
    if (row < 0 || row > 1 || col < 0 || col >= 8) {
      // For rows outside the fixed layout, return a default project
      return 0;
    }
    
    // Fixed mapping: row 0 has projects 0-7, row 1 has projects 8-15
    const projectIndex = row * 8 + col;
    
    // Ensure we don't go out of bounds
    if (projectIndex >= this.projects.length) {
      return 0;
    }
    
    return projectIndex;
  }

  /**
   * Generate grid cells for visible area with stable project assignment
   */
  public generateGridCells(
    firstRow: number,
    firstCol: number,
    rowsToDraw: number,
    colsToDraw: number
  ): GridCell[] {
    const cells: GridCell[] = [];
    
    for (let r = 0; r < rowsToDraw; r++) {
      for (let c = 0; c < colsToDraw; c++) {
        const row = firstRow + r;
        const col = firstCol + c;
        
        // Get stable project index for this position
        const idx = this.getProjectIndex(row, col);
        
        // Safety check: ensure project exists
        if (this.projects[idx]) {
          cells.push({ row, col, projId: this.projects[idx].id });
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
