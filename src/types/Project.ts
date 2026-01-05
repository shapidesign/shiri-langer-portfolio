// Project Types
export interface Project {
  id: number;
  title: string;
  subtitle: string;
  img: string;
  year: number;
  tags: string[];
  description: string;
  client: string;
}

export interface ProjectTemplate {
  title: string;
  subtitle: string;
  img: string;
  year: number;
  tags: string[];
  description: string;
  client: string;
}

export interface ProjectConfig {
  tileWidth: number;
  tileHeight: number;
  tileGap: number;
  visibleCols: number;
  visibleRows: number;
  marginCols: number;
  marginRows: number;
}

export interface GridCell {
  row: number;
  col: number;
  projId: number;
}
