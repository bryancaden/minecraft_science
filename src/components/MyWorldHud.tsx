import React, { useState } from 'react';
import {
  ArrowLeft,
  CloudRain,
  Eye,
  Hammer,
  Pickaxe,
  PlusSquare,
  RotateCcw,
  RotateCw,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type {
  CameraViewMode,
  HeroCharacter,
  MyWorldTool,
  StudentProfile,
  TopicStage,
} from '../types/game';
import { sortResourcesForHotbar, type MyWorldLayout } from '../game/myWorld';
import type { WeatherDisplayState } from '../game/weather';

interface MyWorldHudProps {
  student: StudentProfile;
  stages: TopicStage[];
  layout: MyWorldLayout;
  activeHero: HeroCharacter;
  selectedResourceId: string;
  tool: MyWorldTool;
  cameraViewMode: CameraViewMode;
  placedCount: number;
  muted: boolean;
  notice: string | null;
  weather: WeatherDisplayState;
  onSelectResource: (resourceId: string) => void;
  onToggleTool: () => void;
  onToggleCameraView: () => void;
  onActInFront: () => void;
  onRotateCamera: (dir: -1 | 1) => void;
  onSwitchHero: () => void;
  onClearAll: () => void;
  onToggleMute: () => void;
  onBackToQuests: () => void;
  onBackToTitle: () => void;
}

export const MyWorldHud: React.FC<MyWorldHudProps> = ({
  student,
  stages,
  layout,
  activeHero,
  selectedResourceId,
  tool,
  cameraViewMode,
  placedCount,
  muted,
  notice,
  weather,
  onSelectResource,
  onToggleTool,
  onToggleCameraView,
  onActInFront,
  onRotateCamera,
  onSwitchHero,
  onClearAll,
  onToggleMute,
  onBackToQuests,
  onBackToTitle,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);
  const [showTopicsList, setShowTopicsList] = useState(false);

  // Order resources so owned items appear first in hotbar [1..9]
  const sortedResources = sortResourcesForHotbar(student.resources, stages);

  const totalStock = sortedResources.reduce((sum, r) => sum + r.count, 0);
  const selectedRes =
    sortedResources.find((r) => r.id === selectedResourceId) ?? sortedResources[0];

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-4">
      {cameraViewMode === 'first_person' && (
        <div
          data-testid="first-person-crosshair"
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="relative w-6 h-6">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-6 bg-white/90 shadow-[0_0_2px_rgba(15,23,42,0.95)]" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 w-6 bg-white/90 shadow-[0_0_2px_rgba(15,23,42,0.95)]" />
          </div>
        </div>
      )}
      {/* Top Perimeter Clusters */}
      <div className="flex flex-wrap xl:flex-nowrap items-start justify-between gap-2">
        {/* Top-Left World Info Cluster */}
        <div
          className="pointer-events-auto rounded-2xl px-3 py-1.5 border-2 border-slate-700 text-white flex items-center gap-2.5 shrink-0"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
        >
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
                Builder [Tab]
              </div>
              <div className="text-sm font-black leading-tight">
                {activeHero === 'bryan' ? 'Bryan' : 'Caden'}
              </div>
            </div>
          </button>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              My World
            </div>
            <div className="text-sm font-black text-white leading-tight">
              {student.name}
            </div>
          </div>

          <div className="pl-3 border-l border-slate-700">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Placed
            </div>
            <div
              data-testid="myworld-placed-count"
              className="text-lg font-black tabular-nums text-sky-300 leading-tight"
            >
              {placedCount}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              In Bag
            </div>
            <div
              data-testid="myworld-bag-count"
              className="text-lg font-black tabular-nums text-amber-300 leading-tight"
            >
              {totalStock}
            </div>
          </div>

          <div className="pl-3 border-l border-slate-700">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Map Size
            </div>
            <div
              data-testid="myworld-map-size"
              className="text-sm font-black tabular-nums text-emerald-300 leading-tight"
            >
              {layout.gridSide}×{layout.gridSide}
            </div>
          </div>

          <button
            type="button"
            tabIndex={-1}
            data-testid="myworld-topics-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              setShowTopicsList((v) => !v);
            }}
            className="pl-3 border-l border-slate-700 text-left cursor-pointer hover:opacity-90"
            title="View Unlocked Topic Elements in My World"
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
              Elements
            </div>
            <div
              data-testid="myworld-elements-count"
              className="text-sm font-black tabular-nums text-white leading-tight"
            >
              {layout.completedStages.length}/{stages.length}
            </div>
          </button>

          <div
            data-testid="myworld-weather"
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
        </div>

        {showTopicsList && (
          <div
            className="pointer-events-auto absolute top-20 left-4 w-80 max-h-72 overflow-y-auto rounded-2xl p-3 border-2 border-slate-600 text-white shadow-xl"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.96)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Unlocked Topic Elements ({layout.gridSide}×{layout.gridSide})
              </span>
              <button
                type="button"
                onClick={() => setShowTopicsList(false)}
                className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mb-2">
              Each completed stage expands your My World plaza (+4 tiles) and adds its biome terrain, living things &amp; science props!
            </p>
            {layout.topicElements.length === 0 ? (
              <div className="text-xs text-slate-400 py-2">
                Complete Topic 1 to expand My World to 17×17 and unlock your first living biome terrain!
              </div>
            ) : (
              <div className="space-y-1.5">
                {layout.topicElements.map((el) => (
                  <div
                    key={el.stage.id}
                    className="flex items-start gap-2 bg-slate-800/80 rounded-lg px-2.5 py-1.5 border border-slate-700 text-xs"
                  >
                    <span className="mt-0.5">{el.stage.rewardResource.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white truncate">
                        {el.stage.topicCode}: {el.stage.title}
                      </div>
                      <div className="text-[10px] text-emerald-300 font-semibold">
                        Terrain: {el.terrainLabel}
                      </div>
                      <div className="text-[10px] text-amber-200">
                        Added: {el.livingThingsLabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Top-Right Builder Utility Controls */}
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5">
          <button
            type="button"
            tabIndex={-1}
            data-testid="myworld-tool-toggle"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleTool();
            }}
            className={`voxel-btn border-2 px-2.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer ${
              tool === 'build'
                ? 'bg-emerald-500 hover:bg-emerald-400 border-emerald-200 text-slate-950'
                : 'bg-rose-600 hover:bg-rose-500 border-rose-300 text-white'
            }`}
          >
            {tool === 'build' ? (
              <>
                <Hammer className="w-4 h-4" />
                Build [X]
              </>
            ) : (
              <>
                <Pickaxe className="w-4 h-4" />
                Dig [X]
              </>
            )}
          </button>

          <button
            type="button"
            tabIndex={-1}
            data-testid="myworld-place-front-btn"
            onClick={(e) => {
              e.currentTarget.blur();
              onActInFront();
            }}
            className="voxel-btn bg-amber-500 hover:bg-amber-400 border-2 border-amber-200 text-slate-950 px-2.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer"
          >
            {tool === 'build' ? <PlusSquare className="w-4 h-4" /> : <Pickaxe className="w-4 h-4" />}
            {tool === 'build' ? 'Place [F]' : 'Dig [F]'}
          </button>

          <button
            type="button"
            tabIndex={-1}
            data-testid="camera-view-toggle"
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleCameraView();
            }}
            title="Switch Self View (1st-Person) / 3rd-Person View [V]"
            className={`voxel-btn border-2 px-2.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer ${
              cameraViewMode === 'first_person'
                ? 'bg-violet-500 hover:bg-violet-400 border-violet-200 text-white'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-600 text-violet-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            {cameraViewMode === 'first_person' ? '3rd View [V]' : 'Self View [V]'}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onRotateCamera(-1);
            }}
            aria-label="Rotate Camera Left [Q]"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-sky-300 p-2 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onRotateCamera(1);
            }}
            aria-label="Rotate Camera Right [R]"
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-sky-300 p-2 rounded-xl cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {placedCount > 0 && !confirmClear && (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.currentTarget.blur();
                setConfirmClear(true);
              }}
              aria-label="Clear My World Blocks"
              className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-rose-300 px-3 py-2 rounded-xl flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {confirmClear && (
            <div className="flex items-center gap-1 bg-slate-900/95 border-2 border-rose-500 rounded-xl px-2 py-1">
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  onClearAll();
                  setConfirmClear(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Refund All
              </button>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setConfirmClear(false)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold px-2 py-1 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            aria-label={muted ? 'Unmute Sound' : 'Mute Sound'}
            className="voxel-btn bg-slate-900/90 hover:bg-slate-800 border-2 border-slate-600 text-slate-200 p-2 rounded-xl cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onBackToQuests();
            }}
            className="voxel-btn bg-sky-600 hover:bg-sky-500 border-2 border-sky-300 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-black cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Play Quests
          </button>

          <button
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.currentTarget.blur();
              onBackToTitle();
            }}
            className="voxel-btn bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
          >
            Title
          </button>
        </div>
      </div>

      {/* Bottom Unified Minecraft-Style Resource Hotbar Dock */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="rounded-xl px-4 py-1.5 text-xs font-semibold text-slate-100 border border-slate-700 max-w-3xl text-center"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}
        >
          {notice ? (
            <span className="text-amber-300 font-bold">{notice}</span>
          ) : totalStock === 0 && placedCount === 0 ? (
            <span>
              <span className="text-amber-300 font-black">Sparky:</span> Switch to{' '}
              <span className="text-rose-300 font-bold">Dig Mode [X]</span> to excavate granite blocks here, or solve Topic Quests to earn science blocks!
            </span>
          ) : (
            <span>
              <span className="text-emerald-300 font-black">Selected:</span>{' '}
              {selectedRes.icon} {selectedRes.name} (×{selectedRes.count}) · Click or{' '}
              <span className="text-amber-300 font-bold">[F]</span> Place/Dig ·{' '}
              <span className="text-rose-300 font-bold">[X]</span> Dig Mode ·{' '}
              <span className="text-violet-300 font-bold">[V]</span>{' '}
              {cameraViewMode === 'first_person' ? 'Self View (Drag/Q/R Look)' : 'Self View'} · WASD Walk
            </span>
          )}
        </div>

        <div
          className="pointer-events-auto rounded-2xl p-2 border-2 border-slate-700 max-w-[96vw] overflow-x-auto flex items-center gap-1.5"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.92)' }}
          role="toolbar"
          aria-label="Collected Resource Building Hotbar"
        >
          {sortedResources.map((res, idx) => {
            const isSelected = res.id === selectedRes.id;
            const hasStock = res.count > 0;
            return (
              <button
                key={res.id}
                type="button"
                tabIndex={-1}
                data-testid={`hotbar-item-${res.id}`}
                onClick={(e) => {
                  e.currentTarget.blur();
                  onSelectResource(res.id);
                }}
                className={`relative shrink-0 w-16 sm:w-20 rounded-xl px-1.5 py-1.5 border-2 flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400'
                    : hasStock
                      ? 'bg-slate-900/90 border-slate-600 hover:border-slate-400'
                      : 'bg-slate-950/70 border-slate-800 opacity-45 hover:opacity-75'
                }`}
                title={`${res.name} (×${res.count})`}
              >
                {idx < 9 && (
                  <span className="absolute top-1 left-1.5 text-[9px] font-black text-slate-400 tabular-nums">
                    {idx + 1}
                  </span>
                )}
                <span className="text-lg leading-none mt-0.5">{res.icon}</span>
                <span className="text-[10px] font-bold text-slate-200 truncate w-full text-center">
                  {res.name.split(' ')[0]}
                </span>
                <span
                  className={`text-[11px] font-black tabular-nums ${
                    hasStock ? 'text-emerald-300' : 'text-slate-500'
                  }`}
                >
                  ×{res.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
