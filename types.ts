
export type Subject = string;

export interface SubjectInfo {
  id: Subject;
  icon: string;
  color: string;
}

export type ToolMode = 'SOLVER' | 'NOTES' | 'PYQ' | 'MATERIAL';

export interface AssistantRequest {
  subject: Subject;
  mode: ToolMode;
  query: string;
  language: string;
}

export interface AssistantResponse {
  content: string;
  title: string;
  references?: string[];
}

export interface AdConfig {
  banner: {
    text: string;
    link: string;
    isActive: boolean;
    color: string;
  };
  sidebar: {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
    isActive: boolean;
  };
  admob: {
    bannerActive: boolean;
    bannerUnitId: string;
    appId: string;
    autoAdsActive: boolean;
    publisherId: string;
    interstitialActive: boolean;
    interstitialUnitId: string;
  };
}
