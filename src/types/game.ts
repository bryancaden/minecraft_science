export type GamePhase = 'title' | 'playing' | 'paused' | 'gameover' | 'myworld';

export type HeroCharacter = 'bryan' | 'caden';

export type MasteryLevel =
  | 'Not Started'
  | 'Needs Practice'
  | 'Developing'
  | 'Proficient'
  | 'Mastered';

export type FocusDomain =
  | 'Cellular Biology'
  | 'Ecosystem Relationships'
  | 'Earth & Space'
  | 'Matter, Energy & Inquiry';

export type BiomeType =
  | 'earth_crust'
  | 'solar_orbit'
  | 'climate_ice'
  | 'biomes'
  | 'food_chain'
  | 'botanical'
  | 'cellular_lab'
  | 'inquiry_lab'
  | 'circuit_grid'
  | 'forge_metals'
  | 'matter_camp'
  | 'light_prism'
  | 'friction_track'
  | 'space_station';

export interface McqQuest {
  id: string;
  type: 'mcq';
  title: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  resourceBonus: number;
}

export interface SequenceQuest {
  id: string;
  type: 'sequence';
  title: string;
  prompt: string;
  items: { id: string; label: string; emoji: string; detail?: string }[];
  correctOrder: string[];
  hint: string;
  explanation: string;
  resourceBonus: number;
}

export interface ClassifyItem {
  id: string;
  label: string;
  emoji: string;
  correctCategory: string;
}

export interface ClassifyQuest {
  id: string;
  type: 'classify';
  title: string;
  prompt: string;
  categories: { id: string; label: string; color: string; description: string }[];
  items: ClassifyItem[];
  hint: string;
  explanation: string;
  resourceBonus: number;
}

export type QuestItem = McqQuest | SequenceQuest | ClassifyQuest;

export interface TopicStage {
  id: number;
  semester: 1 | 2;
  topicCode: string;
  title: string;
  subtitle: string;
  mergedSource: string;
  focusDomain: FocusDomain;
  biome: BiomeType;
  timeLimitSeconds: number;
  badge: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  rewardResource: {
    id: string;
    name: string;
    color: string;
    accentColor: string;
    icon: string;
  };
  sparkyIntro: string;
  quests: QuestItem[];
  questBank?: QuestItem[];
}

export interface TopicProgress {
  topicId: number;
  attempts: number;
  correctCount: number;
  totalAnswered: number;
  bestScore: number;
  bestTimeRemaining: number;
  completed: boolean;
  badgeUnlocked: boolean;
  lastPlayedAt: string;
}

export type CameraViewMode = 'third_person' | 'first_person';

export type MyWorldTool = 'build' | 'dig';

export interface PlacedVoxelBlock {
  id: string;
  resourceId: string;
  x: number;
  y: number;
  z: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string;
  avatarColor: string;
  totalScore: number;
  badges: string[];
  resources: Record<string, number>;
  topicProgress: Record<number, TopicProgress>;
  myWorldBlocks?: PlacedVoxelBlock[];
  myWorldDugDepths?: Record<string, number>;
}

export interface RunSummary {
  topicId: number;
  victory: boolean;
  score: number;
  correctCount: number;
  totalQuests: number;
  timeRemaining: number;
  timeSpent: number;
  resourcesEarned: number;
  resourceName: string;
  badgeUnlockedName: string | null;
  masteryLevel: MasteryLevel;
}
