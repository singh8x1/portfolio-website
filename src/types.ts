export interface Project {
  id: string;
  title: string;
  institution: string;
  location: string;
  period: string;
  technologies: string[];
  description: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}
