import React from 'react';
import {
  Backpack,
  CloudRain,
  Eye,
  GraduationCap,
  Hammer,
  Map,
  Pause,
  RefreshCw,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { CameraViewMode, HeroCharacter, QuestItem, TopicStage } from '../types/game';
import type { WeatherDisplayState } from '../game/weather';

interface GameHudProps {
  stage: TopicStage;
  quests?: QuestItem[];
  activeHero: HeroCharacter;
  cameraViewMode: CameraViewMode;
  timeLeft: number;
  score: number;
  beaconsDone: boolean[];
  nearbyBeaconIdx: number | null;
  muted: boolean;
  totalResourcesCount: number;
  weather: WeatherDisplayState;
  onSwitchHero: () => void;
  onToggleCameraView: () => void;
  onToggleMute: () => void;
  onOpenBackpack: () => void;
  onOpenMyWorld: () => void;
  onOpenStageSelect: () => void;
  onOpenTeacher: () => void;
  onTogglePause: () => void;
  onInteractBeacon: (idx: number) => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  stage,
  quests,
  activeHero,
  cameraViewMode,
  timeLeft,
  score,
  beaconsDone,
  nearbyBeaconIdx,
  muted,
  totalResourcesCount,
  weather,
  onSwitchHero,
  onToggleCameraView,
  onToggleMute,
  onOpenBackpack,
  onOpenMyWorld,
  onOpenStageSelect,
  onOpenTeacher,
  onTogglePause,
  onInteractBeacon,
}) => {
  const completedCount = beaconsDone.filter(Boolean).length;
  const isLowTime = timeLeft <= 25;

  const mins = Math.floor(timeLeft / 60);
  const secs = Math.floor(timeLeft % 60);
  const timerFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-4">
      {cameraViewMode === 'first_person' && (
        <div
          data-testid="hud-first-person-crosshair"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="relative w-6 h-6">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-6 bg-white/90 shadow-[0_0_2px_rgba(15,23,42,0.95)]" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-6 bg-white/90 shadow-[0_0_2px_rgba(15,23,42,0.95)]" />
          </div>
        </div>
      )}
      {/* Top Perimeter Clusters — leaves >= 85% viewport unobstructed */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        {/* Top-Left Status Cluster */}
        <div
          className="pointer-events-auto rounded-2xl px-3 py-2 md:px-4 md:py-2.5 border-2 border-slate-700 text-white flex items-center gap-3 md:gap-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}
        >
          {/* Active Matchboy Avatar Indicator */}
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onSwitchHero();
            }}
            title="Switch Bryan / Caden [Tab]"
            className="flex items-center gap-2 pr-3 border-r border-slate-700 cursor-pointer hover:opacity-90"
          >
            <svg viewBox="0 0 28 28" className="w-8 h-8 shrink-0">
              <rect x="6" y="13" width="16" height="13" rx="2" fill="#f3d2a2" stroke="#0f172a" strokeWidth="2" />
              <rect
                x="5"
                y="9"
                width="18"
                height="6"
                rx="2"
                fill={activeHero === 'bryan' ? '#dc2626' : '#2563eb'}
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <polygon
                points="14,1 21,10 7,10"
                fill={activeHero === 'bryan' ? '#f97316' : '#38bdf8'}
              />
              <polygon points="14,4 18,10 10,10" fill="#fef08a" />
            </svg>
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Hero [Tab]
              </div>
              <div className="text-sm font-black leading-tight">
                {activeHero === 'bryan' ? 'Bryan' : 'Caden'}
              </div>
            </div>
          </button>

          {/* Timer */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Timer
            </div>
            <div
              data-testid="hud-timer"
              className={`text-xl font-black tabular-nums leading-tight ${
                isLowTime ? 'text-rose-400' : 'text-white'
              }`}
            >
              {timerFormatted}
            </div>
          </div>

          {/* Score */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Score
            </div>
            <div
              data-testid="hud-score"
              className="text-xl font-black tabular-nums text-amber-300 leading-tight"
            >
              {Math.round(score)}
            </div>
          </div>

          {/* Beacons Pips */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Beacons {completedCount}/3
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {beaconsDone.map((done, idx) => (
                <svg
                  key={idx}
                  viewBox="0 0 20 20"
                  className="w-5 h-5"
                  aria-label={`Beacon ${idx + 1} ${done ? 'completed' : 'active'}`}
                >
                  <polygon
                    points="10,2 18,10 10,18 2,10"
                    fill={done ? '#10b981' : nearbyBeaconIdx === idx ? '#f59e0b' : '#1e293b'}
                    stroke={done ? '#6ee7b7' : '#f59e0b'}
                    strokeWidth="2"
                  />
                </svg>
              ))}
            </div>
          </div>

          {/* Dynamic Weather & In-Game Clock */}
          <div
            data-testid="hud-weather"
            className="pl-3 border-l border-slate-700 flex items-center gap-1.5"
            title={`In-Game Time ${weather.formattedTime} · ${weather.label}`}
          >
            {weather.condition === 'rain' ? (
              <CloudRain className="w-4 h-4 text-sky-300 shrink-0" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 tabular-nums">
                {weather.formattedTime}
              </div>
              <div
                className={`text-xs font-black leading-tight ${
                  weather.condition === 'rain' ? 'text-sky-300' : 'text-amber-300'
                }`}
              >
                {weather.label}
              </div>
            </div>
          </div>

          {/* Stage Title Pill-free Compact Label */}
          <div className="hidden lg:block pl-3 border-l border-slate-700 max-w-[230px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              {stage.topicCode} · {stage.focusDomain}
            </div>
            <div className="text-xs font-bold text-slate-100 truncate">
              {stage.title}
            </div>
          </div>
        </div>

        {/* Top-Right Compact Utility Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            tabIndex={-1}
            data-testid="hud-camera-view-toggle"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleCameraView();
            }}
            title="Switch Self View (1st-Person) / 3rd-Person View [V]"
            className={`voxel-btn border-2 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer ${
              cameraViewMode === 'first_person'
                ? 'bg-violet-500 hover:bg-violet-400 border-violet-200 text-white'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-600 text-violet-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">
              {cameraViewMode === 'first_person' ? '3rd View [V]' : 'Self View [V]'}
            </span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onSwitchHero();
            }}
            aria-label="Switch Hero Bryan or Caden"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-amber-300 p-2.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenBackpack();
            }}
            aria-label="Open Resource Backpack"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-emerald-300 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Backpack className="w-4 h-4" />
            <span className="tabular-nums">{totalResourcesCount}</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            data-testid="hud-myworld-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenMyWorld();
            }}
            aria-label="Open My World Builder"
            className="voxel-btn bg-indigo-600/95 hover:bg-indigo-500 border-2 border-indigo-300 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer"
          >
            <Hammer className="w-4 h-4" />
            <span className="hidden sm:inline">My World</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenStageSelect();
            }}
            aria-label="Open 14 Topics Stage Map"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-sky-300 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Topics</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onOpenTeacher();
            }}
            aria-label="Open Teacher Mastery Dashboard"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span className="hidden sm:inline">Teacher</span>
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-slate-200 p-2.5 rounded-xl cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onTogglePause();
            }}
            aria-label="Pause Game"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-white p-2.5 rounded-xl cursor-pointer"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Safe Zone: Contextual Interact Prompt + Sparky Guide */}
      <div className="flex flex-col items-center gap-2">
        {nearbyBeaconIdx !== null && !beaconsDone[nearbyBeaconIdx] ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onInteractBeacon(nearbyBeaconIdx);
            }}
            className="pointer-events-auto voxel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-5 py-2.5 rounded-xl border-2 border-amber-200 cursor-pointer shadow-lg"
          >
            [E] Open Quest Beacon {nearbyBeaconIdx + 1}:{' '}
            {(quests ?? stage.quests)[nearbyBeaconIdx]?.title}
          </button>
        ) : (
          <div
            className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-100 border border-slate-700 max-w-2xl text-center"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.82)' }}
          >
            <span className="text-amber-300 font-black">Sparky:</span>{' '}
            {stage.sparkyIntro}
          </div>
        )}
      </div>
    </div>
  );
};
