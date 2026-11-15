import type {
  ClassifyItem,
  FocusDomain,
  MasteryLevel,
  QuestItem,
  StudentProfile,
  TopicProgress,
  TopicStage,
} from '../types/game';

export interface BeaconCoord {
  index: number;
  x: number;
  z: number;
  completed: boolean;
}

export function selectQuestsForStage(
  stage: TopicStage,
  attemptNumber = 0,
): QuestItem[] {
  const bank = stage.questBank;
  if (!bank || bank.length <= stage.quests.length) {
    return [...stage.quests];
  }
  const slotCount = stage.quests.length;
  const groupCount = Math.floor(bank.length / slotCount);
  if (groupCount <= 1) {
    return [...stage.quests];
  }
  const normalized = Math.abs(Math.floor(attemptNumber)) % groupCount;
  const start = normalized * slotCount;
  return bank.slice(start, start + slotCount);
}

export function calculateQuestScore(params: {
  basePoints: number;
  streak: number;
  timeBonusSeconds: number;
  usedHint: boolean;
}): number {
  const { basePoints, streak, timeBonusSeconds, usedHint } = params;
  const streakMultiplier = 1 + Math.min(Math.max(streak, 0), 5) * 0.15;
  const raw = Math.round(basePoints * streakMultiplier) + Math.max(0, Math.round(timeBonusSeconds * 2));
  return usedHint ? Math.max(25, Math.round(raw * 0.75)) : raw;
}

export function computeMasteryLevel(
  correctCount: number,
  totalAnswered: number,
  completed: boolean,
): MasteryLevel {
  if (totalAnswered <= 0) return 'Not Started';
  const ratio = correctCount / totalAnswered;
  if (completed && ratio >= 0.85) return 'Mastered';
  if (completed && ratio >= 0.65) return 'Proficient';
  if (ratio >= 0.5) return 'Developing';
  return 'Needs Practice';
}

export function evaluateSequenceAnswer(
  userOrder: string[],
  correctOrder: string[],
): { correct: boolean; correctCount: number; total: number } {
  const total = correctOrder.length;
  let correctCount = 0;
  for (let i = 0; i < total; i++) {
    if (userOrder[i] === correctOrder[i]) {
      correctCount++;
    }
  }
  return {
    correct: userOrder.length === total && correctCount === total,
    correctCount,
    total,
  };
}

export function evaluateClassifyAnswer(
  assignments: Record<string, string>,
  items: ClassifyItem[],
): { correct: boolean; correctCount: number; total: number; wrongIds: string[] } {
  const wrongIds: string[] = [];
  let correctCount = 0;
  for (const item of items) {
    if (assignments[item.id] === item.correctCategory) {
      correctCount++;
    } else {
      wrongIds.push(item.id);
    }
  }
  return {
    correct: wrongIds.length === 0 && items.length > 0,
    correctCount,
    total: items.length,
    wrongIds,
  };
}

export function calculateDomainMastery(
  topicProgress: Record<number, TopicProgress>,
  stages: TopicStage[],
): Record<
  FocusDomain,
  {
    domain: FocusDomain;
    topicsTotal: number;
    topicsCompleted: number;
    accuracyPct: number;
    mastery: MasteryLevel;
  }
> {
  const domains: FocusDomain[] = [
    'Cellular Biology',
    'Ecosystem Relationships',
    'Earth & Space',
    'Matter, Energy & Inquiry',
  ];

  const result = {} as Record<
    FocusDomain,
    {
      domain: FocusDomain;
      topicsTotal: number;
      topicsCompleted: number;
      accuracyPct: number;
      mastery: MasteryLevel;
    }
  >;

  for (const domain of domains) {
    const matchingStages = stages.filter((s) => s.focusDomain === domain);
    let completedCount = 0;
    let totalCorrect = 0;
    let totalAnswered = 0;

    for (const stage of matchingStages) {
      const tp = topicProgress[stage.id];
      if (tp) {
        if (tp.completed) completedCount++;
        totalCorrect += tp.correctCount;
        totalAnswered += tp.totalAnswered;
      }
    }

    const accuracyPct =
      totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    const allCompleted =
      matchingStages.length > 0 && completedCount === matchingStages.length;

    result[domain] = {
      domain,
      topicsTotal: matchingStages.length,
      topicsCompleted: completedCount,
      accuracyPct,
      mastery: computeMasteryLevel(totalCorrect, totalAnswered, allCompleted),
    };
  }

  return result;
}

export function clampPlayerPosition(
  x: number,
  z: number,
  halfExtent: number,
): { x: number; z: number } {
  return {
    x: Math.max(-halfExtent, Math.min(halfExtent, x)),
    z: Math.max(-halfExtent, Math.min(halfExtent, z)),
  };
}

export function findNearestActiveBeacon(
  playerX: number,
  playerZ: number,
  beacons: BeaconCoord[],
  maxRadius: number,
): BeaconCoord | null {
  let nearest: BeaconCoord | null = null;
  let bestDistSq = maxRadius * maxRadius;
  for (const b of beacons) {
    if (b.completed) continue;
    const dx = b.x - playerX;
    const dz = b.z - playerZ;
    const dSq = dx * dx + dz * dz;
    if (dSq <= bestDistSq) {
      bestDistSq = dSq;
      nearest = b;
    }
  }
  return nearest;
}

export function createInitialStudentProfiles(): StudentProfile[] {
  return [
    {
      id: 'student-bryan',
      name: 'Bryan Hung',
      className: 'P4A',
      avatarColor: '#ef4444',
      totalScore: 0,
      badges: [],
      resources: {
        granite_block: 2,
      },
      topicProgress: {},
    },
    {
      id: 'student-caden',
      name: 'Caden Lee',
      className: 'P4A',
      avatarColor: '#3b82f6',
      totalScore: 890,
      badges: ['badge-topic-1', 'badge-topic-4', 'badge-topic-7'],
      resources: {
        granite_block: 3,
        biome_timber: 4,
        immune_shield: 5,
      },
      topicProgress: {
        1: {
          topicId: 1,
          attempts: 1,
          correctCount: 3,
          totalAnswered: 3,
          bestScore: 310,
          bestTimeRemaining: 55,
          completed: true,
          badgeUnlocked: true,
          lastPlayedAt: '2026-11-12T08:40:00.000Z',
        },
        4: {
          topicId: 4,
          attempts: 2,
          correctCount: 4,
          totalAnswered: 5,
          bestScore: 280,
          bestTimeRemaining: 48,
          completed: true,
          badgeUnlocked: true,
          lastPlayedAt: '2026-11-12T09:05:00.000Z',
        },
        7: {
          topicId: 7,
          attempts: 1,
          correctCount: 3,
          totalAnswered: 3,
          bestScore: 300,
          bestTimeRemaining: 52,
          completed: true,
          badgeUnlocked: true,
          lastPlayedAt: '2026-11-12T09:20:00.000Z',
        },
      },
    },
    {
      id: 'student-mei',
      name: 'Mei Wong',
      className: 'P4A',
      avatarColor: '#10b981',
      totalScore: 680,
      badges: ['badge-topic-1', 'badge-topic-5'],
      resources: {
        granite_block: 4,
        ecosystem_emerald: 5,
      },
      topicProgress: {
        1: {
          topicId: 1,
          attempts: 1,
          correctCount: 3,
          totalAnswered: 3,
          bestScore: 300,
          bestTimeRemaining: 41,
          completed: true,
          badgeUnlocked: true,
          lastPlayedAt: '2026-11-11T14:10:00.000Z',
        },
        5: {
          topicId: 5,
          attempts: 1,
          correctCount: 3,
          totalAnswered: 3,
          bestScore: 340,
          bestTimeRemaining: 64,
          completed: true,
          badgeUnlocked: true,
          lastPlayedAt: '2026-11-12T09:30:00.000Z',
        },
        7: {
          topicId: 7,
          attempts: 1,
          correctCount: 1,
          totalAnswered: 3,
          bestScore: 120,
          bestTimeRemaining: 0,
          completed: false,
          badgeUnlocked: false,
          lastPlayedAt: '2026-11-11T14:25:00.000Z',
        },
      },
    },
  ];
}
