import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TOPIC_STAGES } from './data/curriculum';
import type {
  CameraViewMode,
  GamePhase,
  HeroCharacter,
  MyWorldTool,
  QuestItem,
  RunSummary,
  StudentProfile,
  TopicStage,
} from './types/game';
import {
  calculateQuestScore,
  computeMasteryLevel,
  createInitialStudentProfiles,
  selectQuestsForStage,
} from './game/rules';
import {
  clearMyWorldBlocks,
  computeMyWorldLayout,
  digMyWorldCell,
  getCompletedTopicIds,
  getTopicMyWorldDetails,
  pickDefaultBuildResourceId,
  placeVoxelBlock,
  removeVoxelBlock,
  sortResourcesForHotbar,
} from './game/myWorld';
import {
  DEFAULT_START_MINUTES,
  getWeatherForInGameTime,
  type WeatherDisplayState,
} from './game/weather';
import { VoxelWorldController, type VoxelWorldCallbacks } from './game/VoxelWorld';
import { soundFX } from './game/audio';
import { TitleOverlay } from './components/TitleOverlay';
import { GameHud } from './components/GameHud';
import { MyWorldHud } from './components/MyWorldHud';
import { QuestModal } from './components/QuestModal';
import { StageEndModal } from './components/StageEndModal';
import { StageInventoryModal } from './components/StageInventoryModal';
import { TeacherDashboardModal } from './components/TeacherDashboardModal';

const STORAGE_KEY = 'matchboy_science_p4_profiles_v2';
const ACTIVE_STUDENT_KEY = 'matchboy_science_p4_active_student_v2';
const ALL_RESOURCE_SPECS = TOPIC_STAGES.map((s) => s.rewardResource);

function loadSavedProfiles(): StudentProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialStudentProfiles();
    const parsed = JSON.parse(raw) as StudentProfile[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Ignore storage read errors
  }
  return createInitialStudentProfiles();
}

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<VoxelWorldController | null>(null);
  const victoryTimeoutRef = useRef<number | null>(null);

  const [students, setStudents] = useState<StudentProfile[]>(loadSavedProfiles);
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    try {
      return localStorage.getItem(ACTIVE_STUDENT_KEY) || loadSavedProfiles()[0].id;
    } catch {
      return 'student-bryan';
    }
  });

  const activeStudent =
    students.find((s) => s.id === activeStudentId) ?? students[0];

  const [selectedStageId, setSelectedStageId] = useState<number>(1);
  const currentStage: TopicStage =
    TOPIC_STAGES.find((s) => s.id === selectedStageId) ?? TOPIC_STAGES[0];
  const [activeStageQuests, setActiveStageQuests] = useState<QuestItem[]>(() =>
    selectQuestsForStage(TOPIC_STAGES[0], 0),
  );

  const [phase, setPhase] = useState<GamePhase>('title');
  const [activeHero, setActiveHero] = useState<HeroCharacter>('bryan');
  const [timeLeft, setTimeLeft] = useState<number>(currentStage.timeLimitSeconds);
  const [stageScore, setStageScore] = useState<number>(0);
  const [beaconsDone, setBeaconsDone] = useState<boolean[]>([false, false, false]);
  const [nearbyBeaconIdx, setNearbyBeaconIdx] = useState<number | null>(null);
  const [activeQuestBeaconIdx, setActiveQuestBeaconIdx] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);

  const [inventoryModal, setInventoryModal] = useState<
    null | { tab: 'stages' | 'backpack' }
  >(null);
  const [teacherModalOpen, setTeacherModalOpen] = useState<boolean>(false);
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);

  const [selectedBuildResourceId, setSelectedBuildResourceId] = useState<string>(() =>
    pickDefaultBuildResourceId(activeStudent.resources, TOPIC_STAGES),
  );
  const [myWorldTool, setMyWorldTool] = useState<MyWorldTool>('build');
  const [cameraViewMode, setCameraViewMode] = useState<CameraViewMode>('third_person');
  const [myWorldNotice, setMyWorldNotice] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherDisplayState>(() => {
    const init = getWeatherForInGameTime(DEFAULT_START_MINUTES);
    return {
      condition: init.condition,
      formattedTime: init.formattedTime,
      label: init.label,
    };
  });
  const noticeTimeoutRef = useRef<number | null>(null);

  const myWorldLayout = useMemo(
    () =>
      computeMyWorldLayout(
        getCompletedTopicIds(activeStudent, TOPIC_STAGES),
        TOPIC_STAGES,
      ),
    [activeStudent],
  );

  const myWorldStateRef = useRef({
    activeStudent,
    selectedBuildResourceId,
    myWorldTool,
    myWorldLayout,
  });
  myWorldStateRef.current = {
    activeStudent,
    selectedBuildResourceId,
    myWorldTool,
    myWorldLayout,
  };

  // Live run counters kept in refs for accurate immutable snapshot on Victory/Defeat
  const runStatsRef = useRef({
    score: 0,
    correct: 0,
    attempts: 0,
    streak: 0,
    resourcesEarned: 0,
    timeLeft: currentStage.timeLimitSeconds,
    beaconsDone: [false, false, false],
  });

  // Persist profiles
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
      localStorage.setItem(ACTIVE_STUDENT_KEY, activeStudent.id);
    } catch {
      // Ignore storage quota errors
    }
  }, [students, activeStudent.id]);

  // Sync document.body.dataset.state, weather & My World state
  useEffect(() => {
    document.body.dataset.state = phase;
    worldRef.current?.setPhase(phase);
  }, [phase]);

  useEffect(() => {
    document.body.dataset.weather = weather.condition;
    document.body.dataset.inGameTime = weather.formattedTime;
  }, [weather]);

  useEffect(() => {
    document.body.dataset.cameraView = cameraViewMode;
    worldRef.current?.setCameraViewMode(cameraViewMode);
  }, [cameraViewMode]);

  const loadedLayoutKeyRef = useRef<string>('');
  const pendingUnlockMsgRef = useRef<string | null>(null);
  const currentLayoutKey = `${activeStudent.id}:${myWorldLayout.gridSide}:${myWorldLayout.completedStages.map((s) => s.id).join(',')}`;

  useEffect(() => {
    if (phase !== 'myworld') return;
    const blocks = activeStudent.myWorldBlocks ?? [];
    const dugDepths = activeStudent.myWorldDugDepths ?? {};
    const dugLayers = Object.values(dugDepths).reduce((sum, d) => sum + d, 0);
    if (loadedLayoutKeyRef.current !== currentLayoutKey) {
      loadedLayoutKeyRef.current = currentLayoutKey;
      worldRef.current?.loadMyWorld(blocks, ALL_RESOURCE_SPECS, myWorldLayout, dugDepths);
    } else {
      worldRef.current?.syncMyWorldBlocks(blocks);
      worldRef.current?.syncMyWorldTerrain(dugDepths);
    }
    worldRef.current?.setMyWorldState(
      myWorldTool,
      (activeStudent.resources[selectedBuildResourceId] ?? 0) > 0,
    );
    document.body.dataset.myWorldBlocks = String(blocks.length);
    document.body.dataset.myWorldDug = String(dugLayers);
    document.body.dataset.myWorldGridSide = String(myWorldLayout.gridSide);
    document.body.dataset.myWorldElements = String(
      myWorldLayout.completedStages.length,
    );
  }, [
    phase,
    currentLayoutKey,
    activeStudent.id,
    activeStudent.myWorldBlocks,
    activeStudent.myWorldDugDepths,
    activeStudent.resources,
    selectedBuildResourceId,
    myWorldTool,
    myWorldLayout,
  ]);

  // Sync modal pause state on world controller
  useEffect(() => {
    const anyOverlayOpen =
      activeQuestBeaconIdx !== null ||
      inventoryModal !== null ||
      teacherModalOpen;
    worldRef.current?.setQuestModalOpen(anyOverlayOpen);
  }, [activeQuestBeaconIdx, inventoryModal, teacherModalOpen]);

  const showMyWorldNotice = useCallback((msg: string) => {
    if (noticeTimeoutRef.current !== null) {
      window.clearTimeout(noticeTimeoutRef.current);
    }
    setMyWorldNotice(msg);
    noticeTimeoutRef.current = window.setTimeout(() => {
      noticeTimeoutRef.current = null;
      setMyWorldNotice(null);
    }, 2600);
  }, []);

  const openMyWorld = useCallback(() => {
    if (victoryTimeoutRef.current !== null) {
      window.clearTimeout(victoryTimeoutRef.current);
      victoryTimeoutRef.current = null;
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const stu = myWorldStateRef.current.activeStudent;
    const layout = myWorldStateRef.current.myWorldLayout;
    const currentResId = myWorldStateRef.current.selectedBuildResourceId;
    const nextResId =
      (stu.resources[currentResId] ?? 0) > 0
        ? currentResId
        : pickDefaultBuildResourceId(stu.resources, TOPIC_STAGES);

    setRunSummary(null);
    setActiveQuestBeaconIdx(null);
    setInventoryModal(null);
    setTeacherModalOpen(false);
    setNearbyBeaconIdx(null);
    setMyWorldTool('build');
    setMyWorldNotice(null);
    setSelectedBuildResourceId(nextResId);

    const blocks = stu.myWorldBlocks ?? [];
    const dugDepths = stu.myWorldDugDepths ?? {};
    const dugLayers = Object.values(dugDepths).reduce((sum, d) => sum + d, 0);
    loadedLayoutKeyRef.current = `${stu.id}:${layout.gridSide}:${layout.completedStages.map((s) => s.id).join(',')}`;
    worldRef.current?.loadMyWorld(blocks, ALL_RESOURCE_SPECS, layout, dugDepths);
    worldRef.current?.setMyWorldState(
      'build',
      (stu.resources[nextResId] ?? 0) > 0,
    );
    worldRef.current?.setPhase('myworld');
    setPhase('myworld');
    document.body.dataset.state = 'myworld';
    document.body.dataset.myWorldBlocks = String(blocks.length);
    document.body.dataset.myWorldDug = String(dugLayers);
    document.body.dataset.myWorldGridSide = String(layout.gridSide);
    document.body.dataset.myWorldElements = String(layout.completedStages.length);

    if (pendingUnlockMsgRef.current) {
      showMyWorldNotice(pendingUnlockMsgRef.current);
      pendingUnlockMsgRef.current = null;
    }
  }, [showMyWorldNotice]);

  const startStageRun = useCallback(
    (stageToLoad: TopicStage) => {
      if (victoryTimeoutRef.current !== null) {
        window.clearTimeout(victoryTimeoutRef.current);
        victoryTimeoutRef.current = null;
      }
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const attemptNumber = activeStudent.topicProgress[stageToLoad.id]?.attempts ?? 0;
      const runQuests = selectQuestsForStage(stageToLoad, attemptNumber);

      setSelectedStageId(stageToLoad.id);
      setActiveStageQuests(runQuests);
      setRunSummary(null);
      setActiveQuestBeaconIdx(null);
      setInventoryModal(null);
      setTeacherModalOpen(false);
      setNearbyBeaconIdx(null);

      const initialBeacons = [false, false, false];
      setBeaconsDone(initialBeacons);
      setStageScore(0);
      setTimeLeft(stageToLoad.timeLimitSeconds);

      runStatsRef.current = {
        score: 0,
        correct: 0,
        attempts: 0,
        streak: 0,
        resourcesEarned: 0,
        timeLeft: stageToLoad.timeLimitSeconds,
        beaconsDone: [...initialBeacons],
      };

      worldRef.current?.loadStage(stageToLoad, initialBeacons);
      setPhase('playing');
      document.body.dataset.state = 'playing';
      document.body.dataset.beaconsDone = '0';
    },
    [activeStudent.topicProgress],
  );

  const finalizeStageRun = useCallback(
    (victory: boolean) => {
      const snap = runStatsRef.current;
      const stage =
        TOPIC_STAGES.find((s) => s.id === selectedStageId) ?? TOPIC_STAGES[0];
      const timeRemaining = victory ? Math.max(0, snap.timeLeft) : 0;
      const timeBonus = victory ? Math.round(timeRemaining * 1.5) : 0;
      const finalScore = snap.score + timeBonus;
      const completionBonusRes = victory ? 2 : 0;
      const totalRes = snap.resourcesEarned + completionBonusRes;

      const mastery = computeMasteryLevel(
        snap.correct,
        snap.attempts,
        victory,
      );

      // Update student profile mastery & resources
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id !== activeStudent.id) return student;

          const prevTopic = student.topicProgress[stage.id];
          const newCorrect = (prevTopic?.correctCount ?? 0) + snap.correct;
          const newTotal = (prevTopic?.totalAnswered ?? 0) + snap.attempts;
          const completed = Boolean(prevTopic?.completed || victory);
          const badgeUnlocked = Boolean(prevTopic?.badgeUnlocked || victory);

          const nextBadges =
            victory && !student.badges.includes(stage.badge.id)
              ? [...student.badges, stage.badge.id]
              : student.badges;

          const nextResources = {
            ...student.resources,
            [stage.rewardResource.id]:
              (student.resources[stage.rewardResource.id] ?? 0) +
              completionBonusRes,
          };

          return {
            ...student,
            totalScore: student.totalScore + finalScore,
            badges: nextBadges,
            resources: nextResources,
            topicProgress: {
              ...student.topicProgress,
              [stage.id]: {
                topicId: stage.id,
                attempts: (prevTopic?.attempts ?? 0) + 1,
                correctCount: newCorrect,
                totalAnswered: newTotal,
                bestScore: Math.max(prevTopic?.bestScore ?? 0, finalScore),
                bestTimeRemaining: Math.max(
                  prevTopic?.bestTimeRemaining ?? 0,
                  timeRemaining,
                ),
                completed,
                badgeUnlocked,
                lastPlayedAt: new Date().toISOString(),
              },
            },
          };
        }),
      );

      setRunSummary({
        topicId: stage.id,
        victory,
        score: finalScore,
        correctCount: snap.beaconsDone.filter(Boolean).length,
        totalQuests: activeStageQuests.length,
        timeRemaining,
        timeSpent: stage.timeLimitSeconds - timeRemaining,
        resourcesEarned: totalRes,
        resourceName: stage.rewardResource.name,
        badgeUnlockedName: victory ? stage.badge.name : null,
        masteryLevel: mastery,
      });

      if (victory) {
        soundFX.playVictory();
        const details = getTopicMyWorldDetails(stage.id);
        const alreadyCompleted =
          Boolean(activeStudent.topicProgress[stage.id]?.completed) ||
          activeStudent.badges.includes(stage.badge.id);
        const nextCount =
          myWorldLayout.completedStages.length + (alreadyCompleted ? 0 : 1);
        const nextGridSide = (6 + nextCount * 2) * 2 + 1;
        pendingUnlockMsgRef.current = `My World expanded to ${nextGridSide}×${nextGridSide}! Unlocked ${details.terrainLabel} + ${details.livingThingsLabel}!`;
      } else {
        soundFX.playDefeat();
      }
      setActiveQuestBeaconIdx(null);
      setPhase('gameover');
      document.body.dataset.state = 'gameover';
    },
    [activeStageQuests.length, activeStudent, myWorldLayout.completedStages.length, selectedStageId],
  );

  // Store latest handlers in ref so Three.js mount effect runs once ([])
  const callbacksRef = useRef<VoxelWorldCallbacks>({
    onNearbyBeaconChange: () => {},
    onInteractBeacon: () => {},
    onCollectPickup: () => {},
    onSwitchHero: () => {},
    onTimerTick: () => {},
    onTimeExpired: () => {},
    onTogglePause: () => {},
  });

  callbacksRef.current = {
    onNearbyBeaconChange: (idx) => setNearbyBeaconIdx(idx),
    onInteractBeacon: (idx) => {
      if (runStatsRef.current.beaconsDone[idx]) return;
      setActiveQuestBeaconIdx(idx);
    },
    onCollectPickup: () => {
      runStatsRef.current.score += 25;
      runStatsRef.current.resourcesEarned += 1;
      setStageScore(runStatsRef.current.score);
      const resId = currentStage.rewardResource.id;
      setStudents((prev) =>
        prev.map((s) =>
          s.id === activeStudent.id
            ? {
                ...s,
                resources: { ...s.resources, [resId]: (s.resources[resId] ?? 0) + 1 },
              }
            : s,
        ),
      );
    },
    onSwitchHero: () => {
      setActiveHero((prev) => {
        const next: HeroCharacter = prev === 'bryan' ? 'caden' : 'bryan';
        worldRef.current?.setActiveHero(next);
        return next;
      });
    },
    onTimerTick: (sec) => {
      runStatsRef.current.timeLeft = sec;
      setTimeLeft(sec);
    },
    onTimeExpired: () => {
      finalizeStageRun(false);
    },
    onTogglePause: () => {
      setPhase((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
    },
    onPlaceMyWorldBlock: (x, y, z) => {
      const {
        activeStudent: stu,
        selectedBuildResourceId: resId,
        myWorldTool: tool,
        myWorldLayout: layout,
      } = myWorldStateRef.current;

      if (worldRef.current?.isBlockOverlappingActor(x, y, z)) {
        showMyWorldNotice(
          'Step back slightly — you cannot place a block inside Bryan or Caden!',
        );
        return;
      }

      const result = placeVoxelBlock(
        stu.myWorldBlocks ?? [],
        stu.resources,
        resId,
        x,
        y,
        z,
        layout.bounds,
        stu.myWorldDugDepths ?? {},
      );
      if (!result.ok) {
        showMyWorldNotice(result.reason ?? 'Cannot place block here.');
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.id === stu.id
            ? {
                ...s,
                resources: result.resources,
                myWorldBlocks: result.blocks,
              }
            : s,
        ),
      );
      worldRef.current?.syncMyWorldBlocks(result.blocks);
      worldRef.current?.notifyMyWorldBlockPlaced(x, y, z, resId);
      worldRef.current?.setMyWorldState(
        tool,
        (result.resources[resId] ?? 0) > 0,
      );
      document.body.dataset.myWorldBlocks = String(result.blocks.length);

      if ((result.resources[resId] ?? 0) === 0) {
        const spec = ALL_RESOURCE_SPECS.find((r) => r.id === resId);
        showMyWorldNotice(
          `Used your last ${spec?.name ?? 'block'} — pick another or earn more in Topic Quests!`,
        );
      } else {
        setMyWorldNotice(null);
      }
    },
    onRemoveMyWorldBlock: (x, y, z) => {
      const {
        activeStudent: stu,
        selectedBuildResourceId: resId,
        myWorldTool: tool,
      } = myWorldStateRef.current;
      const result = removeVoxelBlock(
        stu.myWorldBlocks ?? [],
        stu.resources,
        x,
        y,
        z,
      );
      if (!result.ok || !result.removed) return;

      setStudents((prev) =>
        prev.map((s) =>
          s.id === stu.id
            ? {
                ...s,
                resources: result.resources,
                myWorldBlocks: result.blocks,
              }
            : s,
        ),
      );
      worldRef.current?.syncMyWorldBlocks(result.blocks);
      worldRef.current?.notifyMyWorldBlockRemoved(
        x,
        y,
        z,
        result.removed.resourceId,
      );
      worldRef.current?.setMyWorldState(
        tool,
        (result.resources[resId] ?? 0) > 0,
      );
      document.body.dataset.myWorldBlocks = String(result.blocks.length);

      const spec = ALL_RESOURCE_SPECS.find(
        (r) => r.id === result.removed?.resourceId,
      );
      showMyWorldNotice(
        `+1 ${spec?.name ?? 'Block'} returned to your backpack!`,
      );
    },
    onDigMyWorldCell: (x, z, targetBlockY) => {
      const {
        activeStudent: stu,
        selectedBuildResourceId: resId,
        myWorldTool: tool,
        myWorldLayout: layout,
      } = myWorldStateRef.current;

      const result = digMyWorldCell({
        blocks: stu.myWorldBlocks ?? [],
        dugDepths: stu.myWorldDugDepths ?? {},
        resources: stu.resources,
        x,
        z,
        targetBlockY,
        bounds: layout.bounds,
      });

      if (!result.ok) {
        if (result.reason) showMyWorldNotice(result.reason);
        return;
      }

      setStudents((prev) =>
        prev.map((s) =>
          s.id === stu.id
            ? {
                ...s,
                resources: result.resources,
                myWorldBlocks: result.blocks,
                myWorldDugDepths: result.dugDepths,
              }
            : s,
        ),
      );

      if (result.kind === 'block' && result.removedBlock) {
        worldRef.current?.syncMyWorldBlocks(result.blocks);
        worldRef.current?.notifyMyWorldBlockRemoved(
          result.removedBlock.x,
          result.removedBlock.y,
          result.removedBlock.z,
          result.removedBlock.resourceId,
        );
        const spec = ALL_RESOURCE_SPECS.find(
          (r) => r.id === result.removedBlock?.resourceId,
        );
        showMyWorldNotice(`+1 ${spec?.name ?? 'Block'} returned to your backpack!`);
      } else {
        worldRef.current?.syncMyWorldTerrain(result.dugDepths);
        worldRef.current?.notifyMyWorldTerrainDug(x, result.dugY ?? 0, z);
        showMyWorldNotice(
          `Dug soil layer (depth ${result.newDepth}/2) · +1 Granite Block added to your backpack!`,
        );
      }

      worldRef.current?.setMyWorldState(
        tool,
        (result.resources[resId] ?? 0) > 0,
      );
      const dugLayers = Object.values(result.dugDepths).reduce((sum, d) => sum + d, 0);
      document.body.dataset.myWorldBlocks = String(result.blocks.length);
      document.body.dataset.myWorldDug = String(dugLayers);
    },
    onSelectHotbarIndex: (idx) => {
      const sorted = sortResourcesForHotbar(
        myWorldStateRef.current.activeStudent.resources,
        TOPIC_STAGES,
      );
      const picked = sorted[idx];
      if (picked) {
        setSelectedBuildResourceId(picked.id);
      }
    },
    onToggleMyWorldTool: () => {
      setMyWorldTool((prev) => (prev === 'build' ? 'dig' : 'build'));
    },
    onToggleCameraView: () => {
      setCameraViewMode((prev) =>
        prev === 'third_person' ? 'first_person' : 'third_person',
      );
    },
    onWeatherChange: (nextWeather) => {
      setWeather(nextWeather);
    },
  };

  // Mount Three.js WebGL scene exactly once
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    const controller = new VoxelWorldController(mountEl, {
      onNearbyBeaconChange: (idx) => callbacksRef.current.onNearbyBeaconChange(idx),
      onInteractBeacon: (idx) => callbacksRef.current.onInteractBeacon(idx),
      onCollectPickup: () => callbacksRef.current.onCollectPickup(),
      onSwitchHero: () => callbacksRef.current.onSwitchHero(),
      onTimerTick: (sec) => callbacksRef.current.onTimerTick(sec),
      onTimeExpired: () => callbacksRef.current.onTimeExpired(),
      onTogglePause: () => callbacksRef.current.onTogglePause(),
      onPlaceMyWorldBlock: (x, y, z) =>
        callbacksRef.current.onPlaceMyWorldBlock?.(x, y, z),
      onRemoveMyWorldBlock: (x, y, z) =>
        callbacksRef.current.onRemoveMyWorldBlock?.(x, y, z),
      onDigMyWorldCell: (x, z, targetBlockY) =>
        callbacksRef.current.onDigMyWorldCell?.(x, z, targetBlockY),
      onSelectHotbarIndex: (idx) =>
        callbacksRef.current.onSelectHotbarIndex?.(idx),
      onToggleMyWorldTool: () => callbacksRef.current.onToggleMyWorldTool?.(),
      onToggleCameraView: () => callbacksRef.current.onToggleCameraView?.(),
      onWeatherChange: (nextWeather) =>
        callbacksRef.current.onWeatherChange?.(nextWeather),
    });
    worldRef.current = controller;
    controller.loadStage(TOPIC_STAGES[0], [false, false, false]);

    // Check ?autostart=1
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      controller.setPhase('playing');
      setPhase('playing');
      document.body.dataset.state = 'playing';
    } else {
      controller.setPhase('title');
    }

    return () => {
      if (victoryTimeoutRef.current !== null) {
        window.clearTimeout(victoryTimeoutRef.current);
        victoryTimeoutRef.current = null;
      }
      if (noticeTimeoutRef.current !== null) {
        window.clearTimeout(noticeTimeoutRef.current);
        noticeTimeoutRef.current = null;
      }
      controller.dispose();
      worldRef.current = null;
    };
  }, []);

  // Global keyboard shortcuts for Title start (Enter/Space) & HUD utilities
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT');
      if (isTyping) return;

      if (
        phase === 'title' &&
        !inventoryModal &&
        !teacherModalOpen &&
        (e.code === 'Enter' || e.code === 'Space')
      ) {
        e.preventDefault();
        startStageRun(currentStage);
        return;
      }

      if (e.code === 'Escape') {
        if (activeQuestBeaconIdx !== null) {
          setActiveQuestBeaconIdx(null);
          return;
        }
        if (inventoryModal) {
          setInventoryModal(null);
          return;
        }
        if (teacherModalOpen) {
          setTeacherModalOpen(false);
          return;
        }
        if (phase === 'playing' || phase === 'paused') {
          setPhase((prev) => (prev === 'playing' ? 'paused' : 'playing'));
        }
        return;
      }

      if (phase === 'playing' && activeQuestBeaconIdx === null && !inventoryModal && !teacherModalOpen) {
        if (e.code === 'KeyM') {
          setMuted((m) => {
            soundFX.setMuted(!m);
            return !m;
          });
        } else if (e.code === 'KeyB') {
          setInventoryModal({ tab: 'backpack' });
        } else if (e.code === 'KeyT') {
          setInventoryModal({ tab: 'stages' });
        }
      } else if (phase === 'myworld' && !inventoryModal && !teacherModalOpen) {
        if (e.code === 'KeyM') {
          setMuted((m) => {
            soundFX.setMuted(!m);
            return !m;
          });
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    phase,
    currentStage,
    activeQuestBeaconIdx,
    inventoryModal,
    teacherModalOpen,
    startStageRun,
  ]);

  const handleAddStudent = (name: string) => {
    const colors = ['#f97316', '#8b5cf6', '#06b6d4', '#ec4899', '#10b981'];
    const newStudent: StudentProfile = {
      id: `student-${Date.now()}`,
      name,
      className: 'P4A',
      avatarColor: colors[students.length % colors.length],
      totalScore: 0,
      badges: [],
      resources: {},
      topicProgress: {},
    };
    setStudents((prev) => [...prev, newStudent]);
    setActiveStudentId(newStudent.id);
  };

  const handleQuestAttempt = (isCorrect: boolean) => {
    runStatsRef.current.attempts += 1;
    if (isCorrect) {
      runStatsRef.current.correct += 1;
      runStatsRef.current.streak += 1;
    } else {
      runStatsRef.current.streak = 0;
    }
  };

  const handleQuestComplete = ({
    usedHint,
    resourceBonus,
  }: {
    usedHint: boolean;
    firstTryCorrect: boolean;
    resourceBonus: number;
  }) => {
    if (activeQuestBeaconIdx === null) return;
    const beaconIdx = activeQuestBeaconIdx;

    const gained = calculateQuestScore({
      basePoints: 100,
      streak: runStatsRef.current.streak,
      timeBonusSeconds: Math.min(10, Math.floor(runStatsRef.current.timeLeft / 15)),
      usedHint,
    });

    runStatsRef.current.score += gained;
    runStatsRef.current.resourcesEarned += resourceBonus;
    runStatsRef.current.beaconsDone[beaconIdx] = true;

    const updatedBeacons = [...runStatsRef.current.beaconsDone];
    setStageScore(runStatsRef.current.score);
    setBeaconsDone(updatedBeacons);
    setActiveQuestBeaconIdx(null);
    document.body.dataset.beaconsDone = String(
      updatedBeacons.filter(Boolean).length,
    );
    worldRef.current?.setBeaconCompleted(
      beaconIdx,
      true,
      true,
      currentStage.rewardResource.accentColor,
    );

    const resId = currentStage.rewardResource.id;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              resources: {
                ...s.resources,
                [resId]: (s.resources[resId] ?? 0) + resourceBonus,
              },
            }
          : s,
      ),
    );

    // Check if all 3 Quest Beacons in this stage are solved!
    if (updatedBeacons.every(Boolean)) {
      worldRef.current?.setTimerPaused(true);
      victoryTimeoutRef.current = window.setTimeout(() => {
        victoryTimeoutRef.current = null;
        finalizeStageRun(true);
      }, 1150);
    }
  };

  const totalResourcesCount = Object.values(activeStudent.resources).reduce(
    (sum, n) => sum + n,
    0,
  );

  const handleClearMyWorld = () => {
    const blocks = activeStudent.myWorldBlocks ?? [];
    if (blocks.length === 0) return;
    const cleared = clearMyWorldBlocks(blocks, activeStudent.resources);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === activeStudent.id
          ? {
              ...s,
              myWorldBlocks: [],
              resources: cleared.resources,
            }
          : s,
      ),
    );
    worldRef.current?.syncMyWorldBlocks([]);
    worldRef.current?.setMyWorldState(
      myWorldTool,
      (cleared.resources[selectedBuildResourceId] ?? 0) > 0,
    );
    soundFX.playBlockBreak();
    document.body.dataset.myWorldBlocks = '0';
    showMyWorldNotice(
      `Refunded ${cleared.refundedCount} placed block${cleared.refundedCount === 1 ? '' : 's'} back to your backpack!`,
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* Isolated WebGL Canvas Container */}
      <div
        ref={canvasMountRef}
        data-testid="voxel-canvas-container"
        className="fixed inset-0"
      />

      {/* Title Screen */}
      {phase === 'title' && (
        <TitleOverlay
          students={students}
          activeStudent={activeStudent}
          selectedStage={currentStage}
          onSelectStudent={setActiveStudentId}
          onAddStudent={handleAddStudent}
          onStartGame={() => startStageRun(currentStage)}
          onOpenMyWorld={openMyWorld}
          onOpenStageSelect={() => setInventoryModal({ tab: 'stages' })}
          onOpenTeacherDashboard={() => setTeacherModalOpen(true)}
        />
      )}

      {/* Playing HUD */}
      {phase === 'playing' && (
        <GameHud
          stage={currentStage}
          quests={activeStageQuests}
          activeHero={activeHero}
          cameraViewMode={cameraViewMode}
          timeLeft={timeLeft}
          score={stageScore}
          beaconsDone={beaconsDone}
          nearbyBeaconIdx={nearbyBeaconIdx}
          muted={muted}
          totalResourcesCount={totalResourcesCount}
          weather={weather}
          onSwitchHero={() => callbacksRef.current.onSwitchHero()}
          onToggleCameraView={() => callbacksRef.current.onToggleCameraView?.()}
          onToggleMute={() => {
            setMuted((m) => {
              soundFX.setMuted(!m);
              return !m;
            });
          }}
          onOpenBackpack={() => setInventoryModal({ tab: 'backpack' })}
          onOpenMyWorld={openMyWorld}
          onOpenStageSelect={() => setInventoryModal({ tab: 'stages' })}
          onOpenTeacher={() => setTeacherModalOpen(true)}
          onTogglePause={() => setPhase('paused')}
          onInteractBeacon={(idx) => setActiveQuestBeaconIdx(idx)}
        />
      )}

      {/* My World 3D Builder HUD */}
      {phase === 'myworld' && (
        <MyWorldHud
          student={activeStudent}
          stages={TOPIC_STAGES}
          layout={myWorldLayout}
          activeHero={activeHero}
          selectedResourceId={selectedBuildResourceId}
          tool={myWorldTool}
          cameraViewMode={cameraViewMode}
          placedCount={(activeStudent.myWorldBlocks ?? []).length}
          muted={muted}
          notice={myWorldNotice}
          weather={weather}
          onSelectResource={(resId) => {
            setSelectedBuildResourceId(resId);
            setMyWorldTool('build');
            setMyWorldNotice(null);
          }}
          onToggleTool={() =>
            setMyWorldTool((prev) => (prev === 'build' ? 'dig' : 'build'))
          }
          onToggleCameraView={() => callbacksRef.current.onToggleCameraView?.()}
          onActInFront={() => worldRef.current?.actOnFrontCell()}
          onRotateCamera={(dir) => worldRef.current?.rotateMyWorldCamera(dir)}
          onSwitchHero={() => callbacksRef.current.onSwitchHero()}
          onClearAll={handleClearMyWorld}
          onToggleMute={() => {
            setMuted((m) => {
              soundFX.setMuted(!m);
              return !m;
            });
          }}
          onBackToQuests={() => startStageRun(currentStage)}
          onBackToTitle={() => {
            setRunSummary(null);
            worldRef.current?.loadStage(currentStage, [false, false, false]);
            worldRef.current?.setPhase('title');
            setPhase('title');
            document.body.dataset.state = 'title';
          }}
        />
      )}

      {/* Active Quest / Interactive Puzzle Modal */}
      {phase === 'playing' && activeQuestBeaconIdx !== null && (
        <QuestModal
          stage={currentStage}
          quest={
            activeStageQuests[activeQuestBeaconIdx] ??
            currentStage.quests[activeQuestBeaconIdx]
          }
          beaconIndex={activeQuestBeaconIdx}
          onAttemptRecorded={handleQuestAttempt}
          onCompleteQuest={handleQuestComplete}
          onClose={() => setActiveQuestBeaconIdx(null)}
        />
      )}

      {/* Paused / Victory / Game Over Modal */}
      {(phase === 'paused' || phase === 'gameover') && (
        <StageEndModal
          phase={phase}
          stage={currentStage}
          summary={runSummary}
          hasNextStage={currentStage.id < TOPIC_STAGES.length}
          myWorldGridSide={myWorldLayout.gridSide}
          unlockedTerrainLabel={getTopicMyWorldDetails(currentStage.id).terrainLabel}
          unlockedLivingLabel={getTopicMyWorldDetails(currentStage.id).livingThingsLabel}
          onResume={() => setPhase('playing')}
          onRestart={() => startStageRun(currentStage)}
          onNextStage={() => {
            const next =
              TOPIC_STAGES.find((s) => s.id === currentStage.id + 1) ??
              TOPIC_STAGES[0];
            startStageRun(next);
          }}
          onOpenMyWorld={openMyWorld}
          onBackToTitle={() => {
            setRunSummary(null);
            setPhase('title');
            document.body.dataset.state = 'title';
          }}
        />
      )}

      {/* 14 Topic Stages & Resource Backpack Modal */}
      {inventoryModal && (
        <StageInventoryModal
          initialTab={inventoryModal.tab}
          stages={TOPIC_STAGES}
          activeStageId={currentStage.id}
          student={activeStudent}
          onSelectStage={(stageId) => {
            const target =
              TOPIC_STAGES.find((s) => s.id === stageId) ?? TOPIC_STAGES[0];
            startStageRun(target);
          }}
          onOpenMyWorld={openMyWorld}
          onClose={() => setInventoryModal(null)}
        />
      )}

      {/* Teacher Progress & Mastery Dashboard */}
      {teacherModalOpen && (
        <TeacherDashboardModal
          students={students}
          activeStudentId={activeStudent.id}
          stages={TOPIC_STAGES}
          onSelectStudent={setActiveStudentId}
          onAddStudent={handleAddStudent}
          onClose={() => setTeacherModalOpen(false)}
        />
      )}
    </div>
  );
}
