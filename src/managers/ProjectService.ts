import { Project, ProjectTemplate, ProjectConfig, GridCell } from '../types/Project';
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
    "Rocky Stool", "Solidwork", "Mico", "A Bowl and A Pile", "EVA", "K-SENSE", 
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
    
    // Use actual project data from PROJECT_TEXTS
    for (const projectText of PROJECT_TEXTS) {
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
      
      projects.push(project);
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
      2: '3dfilters.png',
      3: 'pita/pita-display.webp',
      4: 'itamar.jpg',
      5: 'lamp.jpg',
      6: 'stool/DisplayStool.webp',
      7: 'solidwork.jpg',
      8: 'mico.jpg',
      9: 'bowl.jpg',
      10: 'eva/robotdisplay.webp',
      11: 'ksense.jpg',
      12: 'ember.jpg',
      13: 'dancingpot.jpg',
      14: 'tambourine.JPG',
      15: 'coffeemachine.jpg',
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
   * Get project index for grid position using a simple, reliable hash-based approach
   */
  public getProjectIndex(row: number, col: number): number {
    const key = `${row},${col}`;
    
    // Check cache first
    if (this.projectCache.has(key)) {
      return this.projectCache.get(key)!;
    }
    
    // Use a simple hash function that creates good distribution
    // This ensures consistent results for the same position
    let hash = 0;
    const str = `${row},${col}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use hash to get a project index, ensuring it's within bounds
    const projectIndex = Math.abs(hash) % this.projects.length;
    
    // Cache the result
    this.projectCache.set(key, projectIndex);
    
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
