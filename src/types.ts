export interface AboutData {
  title: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutDescription: string;
  aboutGoal: string;
  aboutImageUrl: string;
}

export interface ExperienceData {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface SkillData {
  id: string;
  name: string;
  sortOrder: number;
}

export interface CertificationData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  sortOrder: number;
}

export interface PortfolioData {
  id: string;
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  sortOrder: number;
  isVisible: boolean;
}
