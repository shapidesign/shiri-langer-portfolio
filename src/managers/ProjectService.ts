import { Project, ProjectConfig, GridCell } from '../types/Project';
import { PROJECT_TEXTS } from '../config/projectTexts';
import { getDisplayImage } from '../utils/imagePathUtils';

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
    
    // Use actual project data from PROJECT_TEXTS
    for (const projectText of PROJECT_TEXTS) {
      // Filter out "About Me" project (ID 17) - it should only open from About button
      if (projectText.id === 17) continue;
      
      const project: Project = {
        id: projectText.id,
        title: projectText.title,
        subtitle: projectText.subtitle,
        img: getDisplayImage(projectText.gallery || []), // Use gallery as single source of truth
        year: projectText.year,
        tags: projectText.tags,
        description: projectText.description,
        client: projectText.client
      };
      
      projects.push(project);
    }
    
    this.projects = projects;
  }

  // Removed getProjectImageById - now using gallery[0] as single source of truth

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
   * Get project index for grid position using improved hash-based approach
   * Creates more randomized and interesting distributions
   */
  public getProjectIndex(row: number, col: number, avoidProjectIds: number[] = []): number {
    const key = `${row},${col}`;

    // Check cache first
    if (this.projectCache.has(key)) {
      const cachedIndex = this.projectCache.get(key)!;
      // If cached project is in avoid list, we'll need to recalculate
      if (avoidProjectIds.length > 0 && this.projects[cachedIndex] && avoidProjectIds.includes(this.projects[cachedIndex].id)) {
        // Fall through to recalculate with avoidance
      } else {
        return cachedIndex;
      }
    }

    // Use multiple hash functions for more randomization
    const hash1 = this.djb2Hash(`${row},${col}`);
    const hash2 = this.sdbmHash(`${row},${col},salt1`);
    const hash3 = this.jenkinsHash(`${row},${col},salt2`);

    // Combine hashes for more entropy
    const combinedHash = (hash1 * hash2 + hash3) >>> 0;

    // Add some row/column bias to create more interesting patterns
    const rowBias = (row * 17) % this.projects.length;
    const colBias = (col * 23) % this.projects.length;

    let projectIndex = (combinedHash + rowBias + colBias) % this.projects.length;

    // Try to find a project that's not in the avoid list
    let attempts = 0;
    const maxAttempts = this.projects.length * 3; // More attempts for better distribution

    while (attempts < maxAttempts) {
      if (this.projects[projectIndex] && !avoidProjectIds.includes(this.projects[projectIndex].id)) {
        break;
      }
      // Use a more random step pattern
      const step = (attempts % 3 === 0) ? 7 : (attempts % 3 === 1) ? 11 : 13;
      projectIndex = (projectIndex + step) % this.projects.length;
      attempts++;
    }

    // If we couldn't find a valid project, use fallback
    if (attempts >= maxAttempts) {
      projectIndex = Math.abs(combinedHash) % this.projects.length;
    }

    // Cache the result
    this.projectCache.set(key, projectIndex);

    return projectIndex;
  }

  /**
   * Multiple hash functions for better randomization
   */
  private djb2Hash(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash >>> 0;
  }

  private sdbmHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
    }
    return hash >>> 0;
  }

  private jenkinsHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
      hash += (hash << 10);
      hash ^= (hash >>> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >>> 11);
    hash += (hash << 15);
    return hash >>> 0;
  }

  /**
   * Generate grid cells for visible area with hash-based layout
   * Avoids placing same projects next to each other (horizontally or vertically adjacent)
   */
  public generateGridCells(
    firstRow: number,
    firstCol: number,
    rowsToDraw: number,
    colsToDraw: number
  ): GridCell[] {
    const cells: GridCell[] = [];
    
    // Create a map to track project IDs at each position for duplicate avoidance
    const positionMap = new Map<string, number>();
    
    for (let r = 0; r < rowsToDraw; r++) {
      for (let c = 0; c < colsToDraw; c++) {
        const row = firstRow + r;
        const col = firstCol + c;
        
        // Collect IDs to avoid (adjacent cells: left and above)
        const avoidProjectIds: number[] = [];
        
        // Check left neighbor
        const leftKey = `${row},${col - 1}`;
        if (positionMap.has(leftKey)) {
          avoidProjectIds.push(positionMap.get(leftKey)!);
        }
        
        // Check top neighbor
        const topKey = `${row - 1},${col}`;
        if (positionMap.has(topKey)) {
          avoidProjectIds.push(positionMap.get(topKey)!);
        }
        
        // Get project index with avoidance logic
        const idx = this.getProjectIndex(row, col, avoidProjectIds);
        
        // Safety check: ensure project exists
        if (this.projects[idx]) {
          const projId = this.projects[idx].id;
          cells.push({ row, col, projId });
          
          // Store in position map for future reference
          const currentKey = `${row},${col}`;
          positionMap.set(currentKey, projId);
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
