export interface SkillGroup {
  category: string;
  items: string[];
}

export interface ProfileData {
  name: string;
  tagline: string;
  headline: string;
  summary: string;
  highlights: string[];
  bio: string;
  skills: SkillGroup[];
  resumeUrl: string;
  heroImage: string;
  aboutImage: string;
  email: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

export const PROJECT_TYPES = [
  "Client Project",
  "Personal Project",
  "Live Product",
  "AI Product",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_ICONS = ["code", "bus", "horse", "car", "mic", "cart"] as const;
export type ProjectIcon = (typeof PROJECT_ICONS)[number];

export interface ProjectData {
  _id: string;
  title: string;
  projectType: ProjectType;
  tagline: string;
  description: string;
  role: string;
  highlights: string[];
  architecture: string[];
  icon: ProjectIcon;
  image: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  order: number;
}

export interface CertificateData {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  image: string;
  credentialUrl?: string;
  order: number;
}

export interface TimelineItemData {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  order: number;
}

export interface ReviewData {
  _id: string;
  clientName: string;
  clientRole?: string;
  company?: string;
  location?: string;
  project?: string;
  message: string;
  rating: number;
  published?: boolean;
  avatar?: string;
  order: number;
}

export interface MessageData {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
