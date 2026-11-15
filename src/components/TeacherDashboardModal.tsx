import React, { useState } from 'react';
import { Award, Download, GraduationCap, UserPlus, X } from 'lucide-react';
import type { FocusDomain, StudentProfile, TopicStage } from '../types/game';
import { calculateDomainMastery, computeMasteryLevel } from '../game/rules';

interface TeacherDashboardModalProps {
  students: StudentProfile[];
  activeStudentId: string;
  stages: TopicStage[];
  onSelectStudent: (id: string) => void;
  onAddStudent: (name: string) => void;
  onClose: () => void;
}

const DOMAIN_ORDER: FocusDomain[] = [
  'Cellular Biology',
  'Ecosystem Relationships',
  'Earth & Space',
  'Matter, Energy & Inquiry',
];

const BADGE_COLOR: Record<string, string> = {
  Mastered: 'bg-emerald-900/80 text-emerald-300 border-emerald-500',
  Proficient: 'bg-sky-900/80 text-sky-300 border-sky-500',
  Developing: 'bg-amber-900/80 text-amber-300 border-amber-500',
  'Needs Practice': 'bg-rose-900/80 text-rose-300 border-rose-500',
  'Not Started': 'bg-slate-800 text-slate-400 border-slate-700',
};

export const TeacherDashboardModal: React.FC<TeacherDashboardModalProps> = ({
  students,
  activeStudentId,
  stages,
  onSelectStudent,
  onAddStudent,
  onClose,
}) => {
  const [inspectId, setInspectId] = useState(activeStudentId);
  const [newStudentName, setNewStudentName] = useState('');

  const inspectedStudent =
    students.find((s) => s.id === inspectId) ?? students[0];

  const domainMastery = calculateDomainMastery(
    inspectedStudent.topicProgress,
    stages,
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStudentName.trim();
    if (!trimmed) return;
    onAddStudent(trimmed);
    setNewStudentName('');
  };

  const handleExportReport = () => {
    const report = {
      exportedAt: new Date().toISOString(),
      curriculum: 'Primary 4 Science (小時鐘 P4 Topics 1-14 + New Science 4A)',
      student: inspectedStudent,
      domainMastery,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inspectedStudent.name.toLowerCase().replace(/\s+/g, '_')}_p4_mastery.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.8)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-dash-title"
    >
      <div className="voxel-panel rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 id="teacher-dash-title" className="text-xl font-black text-white">
                Teacher Progress &amp; Mastery Tracker
              </h2>
              <p className="text-xs text-slate-400">
                Monitor Class P4A mastery levels in Cellular Biology, Ecosystems &amp; Physical Science
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportReport}
              className="voxel-btn bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Teacher Dashboard"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Student Roster */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-700 p-4 flex flex-col gap-3 bg-slate-900/60 overflow-y-auto">
            <div className="text-xs font-black uppercase tracking-wider text-amber-300">
              Class P4A Roster ({students.length})
            </div>

            <div className="flex flex-col gap-1.5">
              {students.map((s) => {
                const isInspected = s.id === inspectedStudent.id;
                const completedCount = Object.values(s.topicProgress).filter(
                  (tp) => tp.completed,
                ).length;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setInspectId(s.id)}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 cursor-pointer flex items-center justify-between gap-2 ${
                      isInspected
                        ? 'bg-slate-800 border-amber-400'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">
                        {s.name}
                      </div>
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        {completedCount}/14 stages · {s.badges.length} badges
                      </div>
                    </div>
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.avatarColor }}
                    />
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleAdd} className="pt-2 border-t border-slate-800 flex gap-1.5">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder="Add student..."
                aria-label="New Student Name"
                className="flex-1 min-w-0 bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                aria-label="Add Student to Class"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Mastery Details */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-5">
            {/* Student Summary Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/70 border border-slate-700 rounded-xl p-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-300">
                  Student Mastery Profile · {inspectedStudent.className}
                </div>
                <div className="text-2xl font-black text-white">
                  {inspectedStudent.name}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Total Score
                  </div>
                  <div className="text-xl font-black tabular-nums text-amber-300">
                    {inspectedStudent.totalScore}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Badges
                  </div>
                  <div className="text-xl font-black tabular-nums text-emerald-300">
                    {inspectedStudent.badges.length}/14
                  </div>
                </div>
                {inspectedStudent.id !== activeStudentId && (
                  <button
                    type="button"
                    onClick={() => onSelectStudent(inspectedStudent.id)}
                    className="voxel-btn bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-3 py-2 rounded-xl cursor-pointer"
                  >
                    Set Active Player
                  </button>
                )}
              </div>
            </div>

            {/* Domain Competency Cards */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                Curriculum Domain Mastery Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {DOMAIN_ORDER.map((domain) => {
                  const d = domainMastery[domain];
                  return (
                    <div
                      key={domain}
                      className="rounded-xl bg-slate-800/80 border border-slate-700 p-3 flex flex-col gap-1.5"
                    >
                      <div className="text-xs font-black text-white">{domain}</div>
                      <div className="flex items-center justify-between text-xs text-slate-300 tabular-nums">
                        <span>
                          {d.topicsCompleted}/{d.topicsTotal} topics
                        </span>
                        <span className="font-bold text-amber-300">
                          {d.accuracyPct}% acc.
                        </span>
                      </div>
                      <span
                        className={`self-start text-[11px] font-bold px-2 py-0.5 rounded border ${BADGE_COLOR[d.mastery]}`}
                      >
                        {d.mastery}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Topic-by-Topic Mastery Table */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                Topic-by-Topic Mastery (Topics 1–14)
              </h3>
              <div className="rounded-xl border border-slate-700 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Topic</th>
                      <th className="py-2.5 px-3">Domain</th>
                      <th className="py-2.5 px-3">Accuracy</th>
                      <th className="py-2.5 px-3">Best Score</th>
                      <th className="py-2.5 px-3">Badge</th>
                      <th className="py-2.5 px-3">Mastery Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-800/40">
                    {stages.map((stage) => {
                      const tp = inspectedStudent.topicProgress[stage.id];
                      const mastery = tp
                        ? computeMasteryLevel(
                            tp.correctCount,
                            tp.totalAnswered,
                            tp.completed,
                          )
                        : 'Not Started';
                      const acc =
                        tp && tp.totalAnswered > 0
                          ? `${Math.round((tp.correctCount / tp.totalAnswered) * 100)}% (${tp.correctCount}/${tp.totalAnswered})`
                          : '—';

                      return (
                        <tr key={stage.id} className="hover:bg-slate-800/70">
                          <td className="py-2.5 px-3 font-bold text-white">
                            {stage.topicCode}: {stage.title}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300">
                            {stage.focusDomain}
                          </td>
                          <td className="py-2.5 px-3 tabular-nums text-slate-200">
                            {acc}
                          </td>
                          <td className="py-2.5 px-3 tabular-nums text-amber-300 font-bold">
                            {tp ? tp.bestScore : '—'}
                          </td>
                          <td className="py-2.5 px-3">
                            {tp?.badgeUnlocked ? (
                              <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                                <Award className="w-3.5 h-3.5" />
                                {stage.badge.icon}
                              </span>
                            ) : (
                              <span className="text-slate-500">Locked</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${BADGE_COLOR[mastery]}`}
                            >
                              {mastery}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
