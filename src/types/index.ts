// 八字相关类型

export interface BaZi {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface Pillar {
  stem: string;  // 天干
  branch: string; // 地支
  stemElement: string;
  branchElement: string;
  hidden: string[]; // 地支藏干
}

export interface WuXing {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

export interface FateReport {
  name: string;
  birthInfo: {
    date: string;
    time: string;
    gender: '男' | '女';
  };
  baZi: BaZi;
  wuXing: WuXing;
  dayMaster: {
    stem: string;
    element: string;
    strength: string;
  };
  gods: {
    useful: string[];
    avoid: string[];
  };
  daYun: DaYun[];
  palace: {
    life: string;
    body: string;
    embryo: string;
  };
  message?: string;
}

export interface DaYun {
  age: string;
  year: string;
  stem: string;
  branch: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  report?: FateReport;
}

// 导航功能
export type FateFeature = 'bazi' | 'fengshui' | 'names' | 'zairi';