import fs from 'fs';
import path from 'path';

export interface ProjectMeta {
  name: string;
  repository_url: string;
  website_url?: string;
  stars: number;
  primary_language: string;
  description: string;
  last_updated: string;
  paper?: {
    exists: boolean;
    title: string;
    venue: string;
    year: number;
    url: string;
  };
  benchmarks: Record<string, any>;
  tech_stack: {
    storage: string[];
    frameworks: string[];
    languages: string[];
    embedding_models?: string[];
  };
  cloud_needs: {
    storage: {
      types: string[];
      requirements: string[];
    };
    compute: {
      embedding: boolean;
      gpu_needed: boolean;
      estimated_requirements?: string;
    };
    deployment: {
      complexity: number;
      containerized: boolean;
      orchestration?: string[];
    };
  };
  categories: {
    tech_approach: string[];
    use_case: string[];
  };
  innovations?: {
    key_features?: string[];
    improvements?: string[];
    user_value?: string[];
  };
  use_cases?: {
    scenarios?: string[];
    companies?: string[];
  };
  value_propositions?: Array<{
    name: string;
    description: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), '..', 'data');
const PROJECTS_DIR = path.join(DATA_DIR, 'projects');
const AGGREGATED_DIR = path.join(DATA_DIR, 'aggregated');

export function loadAllProjects(): ProjectMeta[] {
  const projectDirs = fs.readdirSync(PROJECTS_DIR);
  const projects: ProjectMeta[] = [];

  for (const dir of projectDirs) {
    const metaPath = path.join(PROJECTS_DIR, dir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      const content = fs.readFileSync(metaPath, 'utf-8');
      projects.push(JSON.parse(content));
    }
  }

  return projects.sort((a, b) => b.stars - a.stars);
}

export function loadProject(name: string): ProjectMeta | null {
  const metaPath = path.join(PROJECTS_DIR, name, 'meta.json');
  if (!fs.existsSync(metaPath)) return null;

  const content = fs.readFileSync(metaPath, 'utf-8');
  return JSON.parse(content);
}

export function loadAggregatedData(filename: string): any {
  const filePath = path.join(AGGREGATED_DIR, filename);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}
