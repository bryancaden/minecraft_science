import React from 'react';
import { Award, Hammer, Play, RotateCcw, Home } from 'lucide-react';
import type { GamePhase, RunSummary, TopicStage } from '../types/game';

interface StageEndModalProps {
  phase: GamePhase;
  stage: TopicStage;
  summary: RunSummary | null;
  hasNextStage: boolean;
  myWorldGridSide: number;
  unlockedTerrainLabel?: string;
  unlockedLivingLabel?: string;
  onResume: () => void;
  onRestart: () => void;
  onNextStage: () => void;
  onOpenMyWorld: () => void;
  onBackToTitle: () => void;
}

export const StageEndModal: React.FC<StageEndModalProps> = ({
  phase,
  stage,
  summary,
  hasNextStage,
  myWorldGridSide,
  unlockedTerrainLabel,
  unlockedLivingLabel,
  onResume,
  onRestart,
  onNextStage,
  onOpenMyWorld,
  onBackToTitle,
}) => {
  if (phase === 'paused') {
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.72)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pause-title"
      >
        <div className="voxel-panel rounded-2xl w-full max-w-md p-6 text-slate-100 flex flex-col gap-4 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            {stage.topicCode} · Paused
          </div>
          <h2 id="pause-title" className="text-2xl font-black text-white">
            Take a Science Break!
          </h2>
          <p className="text-sm text-slate-300">{stage.title}</p>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={onResume}
              className="voxel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Resume Quest
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="voxel-btn bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Stage
            </button>
            <button
              type="button"
              onClick={onBackToTitle}
              className="voxel-btn bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Title Screen
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'gameover' && summary) {
    const isVictory = summary.victory;
    return (
      <div
        className="fixed inset-0 z-30 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(2, 6, 23, 0.76)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="end-title"
      >
        <div className="voxel-panel rounded-2xl w-full max-w-lg p-6 text-slate-100 flex flex-col gap-4 text-center">
          <div className="text-xs font-black uppercase tracking-wider text-amber-300">
            {stage.topicCode} · {stage.focusDomain}
          </div>

          <h2 id="end-title" className="text-2xl md:text-3xl font-black text-white">
            {isVictory ? 'Stage Complete!' : 'Time’s Up!'}
          </h2>

          {isVictory && summary.badgeUnlockedName && (
            <div className="rounded-xl bg-amber-950/75 border-2 border-amber-400 p-3 flex items-center justify-center gap-3">
              <span className="text-3xl">{stage.badge.icon}</span>
              <div className="text-left">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Badge Unlocked!
                </div>
                <div className="text-base font-black text-white">
                  {summary.badgeUnlockedName}
                </div>
              </div>
            </div>
          )}

          {/* 3 Tabular-Nums Mastery Metrics */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Score
              </div>
              <div className="text-xl font-black tabular-nums text-amber-300">
                {Math.round(summary.score)}
              </div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {isVictory ? 'Time Left' : 'Beacons'}
              </div>
              <div className="text-xl font-black tabular-nums text-sky-300">
                {isVictory
                  ? `${Math.round(summary.timeRemaining)}s`
                  : `${summary.correctCount}/${summary.totalQuests}`}
              </div>
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Mastery
              </div>
              <div className="text-sm font-black text-emerald-300 mt-1">
                {summary.masteryLevel}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2.5 flex flex-col gap-2 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-emerald-200">
              <span>
                {stage.rewardResource.icon} Prize Collected: +{summary.resourcesEarned}{' '}
                {summary.resourceName}
              </span>
              <button
                type="button"
                data-testid="victory-myworld-btn"
                onClick={onOpenMyWorld}
                className="voxel-btn bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Hammer className="w-3.5 h-3.5" />
                Use in My World
              </button>
            </div>
            {isVictory && (
              <div className="text-xs text-sky-200 border-t border-slate-700 pt-1.5">
                <span className="font-black text-emerald-300">
                  My World Expanded to {myWorldGridSide}×{myWorldGridSide}!
                </span>{' '}
                {unlockedTerrainLabel && unlockedLivingLabel
                  ? `Unlocked ${unlockedTerrainLabel} + ${unlockedLivingLabel}.`
                  : ''}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            {isVictory && hasNextStage ? (
              <button
                type="button"
                data-start="true"
                onClick={onNextStage}
                className="voxel-btn flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl cursor-pointer"
              >
                Next Topic Stage →
              </button>
            ) : (
              <button
                type="button"
                data-start="true"
                onClick={onRestart}
                className="voxel-btn flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl cursor-pointer"
              >
                Try Again
              </button>
            )}

            <button
              type="button"
              onClick={onRestart}
              className="voxel-btn bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-3 rounded-xl cursor-pointer"
            >
              Replay
            </button>

            <button
              type="button"
              onClick={onBackToTitle}
              className="voxel-btn bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-3 rounded-xl cursor-pointer"
            >
              Title
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
