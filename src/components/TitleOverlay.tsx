import React, { useState } from 'react';
import { BookOpen, GraduationCap, Hammer, Play, Sparkles, UserPlus } from 'lucide-react';
import type { StudentProfile, TopicStage } from '../types/game';

interface TitleOverlayProps {
  students: StudentProfile[];
  activeStudent: StudentProfile;
  selectedStage: TopicStage;
  onSelectStudent: (studentId: string) => void;
  onAddStudent: (name: string) => void;
  onStartGame: () => void;
  onOpenMyWorld: () => void;
  onOpenStageSelect: () => void;
  onOpenTeacherDashboard: () => void;
}

export const TitleOverlay: React.FC<TitleOverlayProps> = ({
  students,
  activeStudent,
  selectedStage,
  onSelectStudent,
  onAddStudent,
  onStartGame,
  onOpenMyWorld,
  onOpenStageSelect,
  onOpenTeacherDashboard,
}) => {
  const [addingName, setAddingName] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddStudent(trimmed);
    setNewName('');
    setAddingName(false);
  };

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-10">
      {/* Top-left Hero Lockup over calm sky negative space */}
      <div className="max-w-lg pointer-events-auto flex flex-col gap-4">
        {/* Bespoke Inline SVG Title Emblem */}
        <div className="drop-shadow-lg">
          <svg
            viewBox="0 0 460 142"
            className="w-full max-w-[440px] h-auto"
            role="img"
            aria-label="Matchboy Science Quest Primary 4"
          >
            {/* Voxel Crest Plaque */}
            <rect x="4" y="8" width="452" height="126" rx="14" fill="#0f172a" fillOpacity="0.88" stroke="#f59e0b" strokeWidth="4" />
            <rect x="12" y="16" width="436" height="110" rx="10" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" />
            {/* Matchstick Flame Icon */}
            <rect x="28" y="64" width="16" height="46" rx="3" fill="#f3d2a2" stroke="#0f172a" strokeWidth="2" />
            <rect x="24" y="48" width="24" height="20" rx="4" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <polygon points="36,22 50,48 22,48" fill="#f97316" />
            <polygon points="36,30 44,48 28,48" fill="#fef08a" />
            {/* Secondary Caden Spark */}
            <rect x="56" y="72" width="12" height="38" rx="3" fill="#f3d2a2" stroke="#0f172a" strokeWidth="2" />
            <rect x="53" y="59" width="18" height="15" rx="3" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <polygon points="62,38 72,59 52,59" fill="#38bdf8" />
            <polygon points="62,45 67,59 57,59" fill="#fef08a" />

            <text
              x="92"
              y="56"
              fill="#fef08a"
              fontSize="28"
              fontWeight="900"
              letterSpacing="1"
            >
              MATCHBOY
            </text>
            <text
              x="92"
              y="88"
              fill="#38bdf8"
              fontSize="27"
              fontWeight="900"
              letterSpacing="0.8"
            >
              SCIENCE QUEST
            </text>
            <text
              x="92"
              y="112"
              fill="#cbd5e1"
              fontSize="13"
              fontWeight="700"
              letterSpacing="1.6"
            >
              PRIMARY 4 · BRYAN, CADEN &amp; SPARKY
            </text>
          </svg>
        </div>

        {/* Compact Student & Stage Launcher Card */}
        <div className="voxel-panel rounded-2xl p-4 text-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="student-select" className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Explorer Profile (Class P4A)
            </label>
            <button
              type="button"
              onClick={() => setAddingName((v) => !v)}
              className="text-xs font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {addingName ? 'Cancel' : 'New Student'}
            </button>
          </div>

          {addingName ? (
            <form onSubmit={handleCreateStudent} className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter student name..."
                maxLength={24}
                className="flex-1 bg-slate-800 border-2 border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="voxel-btn bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Add
              </button>
            </form>
          ) : (
            <select
              id="student-select"
              value={activeStudent.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="w-full bg-slate-800 border-2 border-slate-600 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.badges.length}/14 Badges · {s.totalScore} pts)
                </option>
              ))}
            </select>
          )}

          <div className="bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Ready Stage · {selectedStage.topicCode}
              </div>
              <div className="text-sm font-bold text-white truncate">
                {selectedStage.title}
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-900 text-amber-300 shrink-0">
              {selectedStage.badge.icon} {selectedStage.focusDomain}
            </span>
          </div>

          {/* Primary Start + Secondary Builder / Topics / Teacher Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              data-start="true"
              onClick={onStartGame}
              className="voxel-btn w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base px-5 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              Start Quest
            </button>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-testid="title-myworld-btn"
                onClick={onOpenMyWorld}
                className="voxel-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Hammer className="w-4 h-4 shrink-0" />
                My World
              </button>
              <button
                type="button"
                onClick={onOpenStageSelect}
                className="voxel-btn bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                14 Topics
              </button>
              <button
                type="button"
                onClick={onOpenTeacherDashboard}
                className="voxel-btn bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                Teacher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Single flat, borderless control hint line in bottom safe margin */}
      <div className="flex items-center justify-between text-xs font-bold text-white hud-stroke">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          WASD / Arrows Move · Space Jump · E Interact · Tab Switch Bryan/Caden · Esc Pause
        </span>
        <span className="hidden md:inline text-amber-200 tabular-nums">
          Enter or Space to Start
        </span>
      </div>
    </div>
  );
};
