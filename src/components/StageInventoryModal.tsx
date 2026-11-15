import React, { useState } from 'react';
import { Award, Backpack, BookOpen, Hammer, Play, X } from 'lucide-react';
import type { StudentProfile, TopicStage } from '../types/game';
import { computeMasteryLevel } from '../game/rules';

interface StageInventoryModalProps {
  initialTab?: 'stages' | 'backpack';
  stages: TopicStage[];
  activeStageId: number;
  student: StudentProfile;
  onSelectStage: (stageId: number) => void;
  onOpenMyWorld: () => void;
  onClose: () => void;
}

const MASTERY_STYLE: Record<string, string> = {
  Mastered: 'bg-emerald-900/80 text-emerald-300 border-emerald-500',
  Proficient: 'bg-sky-900/80 text-sky-300 border-sky-500',
  Developing: 'bg-amber-900/80 text-amber-300 border-amber-500',
  'Needs Practice': 'bg-rose-900/80 text-rose-300 border-rose-500',
  'Not Started': 'bg-slate-800 text-slate-400 border-slate-600',
};

export const StageInventoryModal: React.FC<StageInventoryModalProps> = ({
  initialTab = 'stages',
  stages,
  activeStageId,
  student,
  onSelectStage,
  onOpenMyWorld,
  onClose,
}) => {
  const [tab, setTab] = useState<'stages' | 'backpack'>(initialTab);
  const [semesterFilter, setSemesterFilter] = useState<'all' | 1 | 2>('all');

  const visibleStages = stages.filter((s) =>
    semesterFilter === 'all' ? true : s.semester === semesterFilter,
  );

  const totalResources = Object.values(student.resources).reduce(
    (sum, n) => sum + n,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.78)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-inv-title"
    >
      <div className="voxel-panel rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-700">
          <div>
            <h2 id="stage-inv-title" className="text-xl font-black text-white">
              {tab === 'stages'
                ? 'Primary 4 Science Curriculum · 14 Topic Stages'
                : `${student.name}’s Resource Backpack & Badges`}
            </h2>
            <p className="text-xs text-slate-400">
              小時鐘 P4 Topics 1–14 merged with New Science 4A Units 1–4 ·{' '}
              {stages.reduce(
                (sum, s) => sum + (s.questBank?.length ?? s.quests.length),
                0,
              )}
              -Question Bank
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Topics and Backpack Modal"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-3 bg-slate-900/70 border-b border-slate-800">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab('stages')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                tab === 'stages'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              14 Topic Stages
            </button>
            <button
              type="button"
              onClick={() => setTab('backpack')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer ${
                tab === 'backpack'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Backpack className="w-4 h-4" />
              Resources ({totalResources}) & Badges ({student.badges.length}/14)
            </button>
          </div>

          {tab === 'stages' && (
            <div className="flex gap-1.5">
              {(['all', 1, 2] as const).map((sem) => (
                <button
                  key={String(sem)}
                  type="button"
                  onClick={() => setSemesterFilter(sem)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    semesterFilter === sem
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {sem === 'all' ? 'All 14 Topics' : `Semester ${sem}`}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {tab === 'stages' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visibleStages.map((stage) => {
                const tp = student.topicProgress[stage.id];
                const mastery = tp
                  ? computeMasteryLevel(tp.correctCount, tp.totalAnswered, tp.completed)
                  : 'Not Started';
                const isSelected = stage.id === activeStageId;
                const bankSize = stage.questBank?.length ?? stage.quests.length;

                return (
                  <div
                    key={stage.id}
                    className={`rounded-xl border-2 p-3.5 flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-800/95 border-amber-400'
                        : 'bg-slate-800/60 border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-300">
                          <span>Sem {stage.semester} · {stage.topicCode}</span>
                          <span>•</span>
                          <span className="text-amber-300">{stage.focusDomain}</span>
                        </div>
                        <h3 className="text-sm font-black text-white mt-0.5">
                          {stage.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {stage.mergedSource}
                        </p>
                      </div>
                      <span className="text-2xl shrink-0">{stage.badge.icon}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded border ${MASTERY_STYLE[mastery]}`}
                        >
                          {mastery}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded border border-indigo-500/50 bg-indigo-950/70 text-indigo-200 tabular-nums">
                          {bankSize} Qs
                        </span>
                        <span className="text-xs text-slate-300 font-semibold">
                          {stage.rewardResource.icon} {stage.rewardResource.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectStage(stage.id)}
                        className="voxel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        Play
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Voxel Resource Prizes */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-300">
                    Minecraft-Style Science Resource Inventory
                  </h3>
                  <button
                    type="button"
                    onClick={onOpenMyWorld}
                    className="voxel-btn bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Hammer className="w-4 h-4" />
                    Build in My World ({totalResources} Blocks)
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {stages.map((stage) => {
                    const count = student.resources[stage.rewardResource.id] ?? 0;
                    return (
                      <div
                        key={stage.rewardResource.id}
                        className={`rounded-xl border-2 p-3 flex flex-col items-center text-center gap-1 ${
                          count > 0
                            ? 'bg-slate-800/95 border-emerald-500/70'
                            : 'bg-slate-900/70 border-slate-800 opacity-55'
                        }`}
                      >
                        <span className="text-2xl">{stage.rewardResource.icon}</span>
                        <div className="text-xs font-bold text-white leading-tight">
                          {stage.rewardResource.name}
                        </div>
                        <div className="text-sm font-black tabular-nums text-amber-300">
                          ×{count}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collectible Badges */}
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Unlocked Topic Badges ({student.badges.length} / 14)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {stages.map((stage) => {
                    const unlocked = student.badges.includes(stage.badge.id);
                    return (
                      <div
                        key={stage.badge.id}
                        className={`rounded-xl border-2 p-3 flex items-center gap-2.5 ${
                          unlocked
                            ? 'bg-amber-950/60 border-amber-400'
                            : 'bg-slate-900/70 border-slate-800 opacity-50'
                        }`}
                      >
                        <span className="text-2xl shrink-0">{stage.badge.icon}</span>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase text-amber-300">
                            {stage.topicCode}
                          </div>
                          <div className="text-xs font-black text-white truncate">
                            {stage.badge.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
