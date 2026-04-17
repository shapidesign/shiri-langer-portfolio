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

  // Fixed permutation (length 16) used to place all real projects in the
  // initial-view showcase zone. Values are project-array indices 0–15.
  // Arranged so no two adjacent positions share the same project in a 5-column layout.
  private readonly SHOWCASE_PERMUTATION = [0, 8, 3, 11, 6, 14, 1, 9, 4, 12, 7, 15, 2, 10, 5, 13];

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

    // ── Showcase zone ────────────────────────────────────────────────────────
    // For the rectangle of cells that fills the initial viewport (rows 0 …
    // visibleRows-1, cols 0 … visibleCols-1) we use a deterministic permutation
    // so that every real project appears at least once before the infinite
    // random grid takes over.
    const scRows = this.config.visibleRows;
    const scCols = this.config.visibleCols;
    if (row >= 0 && row < scRows && col >= 0 && col < scCols) {
      const posIndex = row * scCols + col;
      return this.SHOWCASE_PERMUTATION[posIndex % this.SHOWCASE_PERMUTATION.length];
    }

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
   * Generate grid cells for visible area with hash-based layout.
   *
   * Large-tile placement rules (enforced here so they're always consistent):
   *   - Large-tile project IDs may only appear at "slot" positions where
   *     row % 3 === 0 AND col % 3 === 0.
   *   - This guarantees every occurrence renders as a large tile (the renderer
   *     applies the same %3 check to find anchors) and that no two large tiles
   *     are directly adjacent (the 2×2 footprint + 1-cell gap between %3 slots).
   *   - Cells covered by a large tile's footprint (row+1, col), (row, col+1),
   *     (row+1, col+1) are tracked in positionMap and skipped so they don't
   *     receive an independent project assignment.
   */
  public generateGridCells(
    firstRow: number,
    firstCol: number,
    rowsToDraw: number,
    colsToDraw: number,
    largeTileIds: number[] = []
  ): GridCell[] {
    const cells: GridCell[] = [];
    const largeTileSet = new Set(largeTileIds);

    // positionMap stores the project ID assigned to each absolute (row,col).
    // A value of -1 means the cell is covered by an adjacent large tile and
    // should not receive its own project.
    const positionMap = new Map<string, number>();

    for (let r = 0; r < rowsToDraw; r++) {
      for (let c = 0; c < colsToDraw; c++) {
        const row = firstRow + r;
        const col = firstCol + c;
        const cellKey = `${row},${col}`;

        // Skip cells that are covered by a previously-placed large tile.
        if (positionMap.get(cellKey) === -1) continue;

        // Build the avoid list from orthogonal neighbours (left and above).
        const avoidProjectIds: number[] = [];
        const leftVal = positionMap.get(`${row},${col - 1}`);
        if (leftVal !== undefined && leftVal !== -1) avoidProjectIds.push(leftVal);
        const topVal = positionMap.get(`${row - 1},${col}`);
        if (topVal !== undefined && topVal !== -1) avoidProjectIds.push(topVal);

        // Only slot positions (row%3===0, col%3===0) may receive large-tile projects.
        const isSlot = row % 3 === 0 && col % 3 === 0;
        if (!isSlot) {
          for (const id of largeTileIds) avoidProjectIds.push(id);
        }

        const idx = this.getProjectIndex(row, col, avoidProjectIds);
        if (!this.projects[idx]) continue;

        const projId = this.projects[idx].id;
        cells.push({ row, col, projId });
        positionMap.set(cellKey, projId);

        // If a large tile landed on a slot, mark its three covered neighbours so
        // they are skipped in this loop and won't be assigned their own project.
        if (isSlot && largeTileSet.has(projId)) {
          positionMap.set(`${row},${col + 1}`, -1);
          positionMap.set(`${row + 1},${col}`, -1);
          positionMap.set(`${row + 1},${col + 1}`, -1);
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
