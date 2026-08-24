export const PROJECT_TYPES = ["story", "commentary", "ranking", "clip"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PLANS = {
  free: { label: "Free", price: 0, credits: 50, videos: 3 },
  starter: { label: "Starter", price: 25, credits: 200, videos: 30 },
  creator: { label: "Creator", price: 49, credits: 500, videos: 90 },
  business: { label: "Business", price: 99, credits: 1500, videos: 200 },
} as const;

export type PlanId = keyof typeof PLANS;

export const VOICES = [
  { id: "eve", label: "Eve", tone: "Warm, clear" },
  { id: "ara", label: "Ara", tone: "Bright, energetic" },
  { id: "rex", label: "Rex", tone: "Confident, deep" },
  { id: "sal", label: "Sal", tone: "Smooth, balanced" },
] as const;

export const CREDIT_COSTS = {
  script: 8,
  voice: 18,
  captions: 6,
  render: 12,
} as const;

export type Scene = {
  id: string;
  text: string;
  caption: string;
  durationSec: number;
  visualHint: string;
};

export type CaptionCue = {
  start: number;
  end: number;
  text: string;
};

export type Project = {
  id: string;
  userId: string;
  title: string;
  type: ProjectType;
  status: string;
  script: string;
  voiceId: string;
  voiceData: string | null;
  captions: CaptionCue[];
  scenes: Scene[];
  sourceUrl: string | null;
  durationSec: number;
  creditsSpent: number;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  userId: string;
  plan: PlanId;
  credits: number;
  videosThisMonth: number;
  videoLimit: number;
};
