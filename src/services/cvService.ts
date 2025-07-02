import * as yaml from "js-yaml";

export interface CVData {
  personal: {
    name: string;
    title: string;
    description: string;
  };
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    linkedinLink: string;
    github: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    location: string;
    skills: Array<string>;
    positions: Array<{
      title: string;
      period: string;
    }>;
    responsibilities: string[];
  }>;
  // TODO(asankov): unify types
  openSourceContributions: Array<{
    company: string;
    location: string;
    skills: Array<string>;
    positions: Array<{
      title: string;
      period: string;
    }>;
    responsibilities: string[];
  }>;
  skills: {
    frontend: string[];
    backend: string[];
  };
  talks: Array<{
    venue: string;
    date: string;
    location: string;
    sessions: Array<{
      name: string;
      summary: string;
      type: string;
      with: string;
      links: {
        youtube: string;
        github: string;
        slides: string;
      };
    }>;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  certifications: string[];
}

let cachedCVData: CVData | null = null;

const getBasePath = (): string => {
  if (import.meta.env.PROD) {
    const basePath = import.meta.env.VITE_BASE_PATH || "ink-blog-scribe";
    return `/${basePath}`;
  }
  return "";
};

export const loadCVData = async (): Promise<CVData> => {
  if (cachedCVData) {
    return cachedCVData;
  }

  try {
    const basePath = getBasePath();
    const response = await fetch(`${basePath}/cv-data.yaml`);
    if (!response.ok) {
      throw new Error("Failed to load CV data");
    }

    const yamlContent = await response.text();
    cachedCVData = yaml.load(yamlContent) as CVData;
    return cachedCVData;
  } catch (error) {
    console.error("Failed to load CV data:", error);
    throw error;
  }
};

export const clearCVCache = (): void => {
  cachedCVData = null;
};
