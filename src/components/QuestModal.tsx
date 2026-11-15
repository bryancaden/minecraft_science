import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Flame,
  Lightbulb,
  Sparkles,
  X,
  XCircle,
} from 'lucide-react';
import type { QuestItem, TopicStage } from '../types/game';
import { evaluateClassifyAnswer, evaluateSequenceAnswer } from '../game/rules';
import { soundFX } from '../game/audio';

interface QuestModalProps {
  stage: TopicStage;
  quest: QuestItem;
  beaconIndex: number;
  onAttemptRecorded: (isCorrect: boolean) => void;
  onCompleteQuest: (params: {
    usedHint: boolean;
    firstTryCorrect: boolean;
    resourceBonus: number;
  }) => void;
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  stage,
  quest,
  beaconIndex,
  onAttemptRecorded,
  onCompleteQuest,
  onClose,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong';
    message: string;
  } | null>(null);

  // MCQ state
  const [selectedMcq, setSelectedMcq] = useState<number | null>(null);

  // Sequence state
  const [sequenceOrder, setSequenceOrder] = useState<string[]>([]);

  // Classify state
  const [selectedClassifyItem, setSelectedClassifyItem] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [wrongClassifyIds, setWrongClassifyIds] = useState<string[]>([]);

  useEffect(() => {
    setShowHint(false);
    setHadWrongAttempt(false);
    setFeedback(null);
    setSelectedMcq(null);
    setWrongClassifyIds([]);

    if (quest.type === 'sequence') {
      setSequenceOrder(quest.items.map((item) => item.id));
    } else if (quest.type === 'classify') {
      setAssignments({});
      setSelectedClassifyItem(quest.items[0]?.id ?? null);
    }
  }, [quest]);

  const moveSequenceItem = (idx: number, delta: -1 | 1) => {
    if (feedback?.type === 'correct') return;
    const target = idx + delta;
    if (target < 0 || target >= sequenceOrder.length) return;
    const next = [...sequenceOrder];
    const tmp = next[idx];
    next[idx] = next[target];
    next[target] = tmp;
    setSequenceOrder(next);
    setFeedback(null);
  };

  const assignToCategory = (categoryId: string) => {
    if (feedback?.type === 'correct') return;
    if (!selectedClassifyItem || quest.type !== 'classify') return;

    const next = { ...assignments, [selectedClassifyItem]: categoryId };
    setAssignments(next);
    setWrongClassifyIds((prev) => prev.filter((id) => id !== selectedClassifyItem));
    setFeedback(null);

    // Auto-advance selection to next unassigned item
    const nextUnassigned = quest.items.find((it) => !next[it.id]);
    if (nextUnassigned) {
      setSelectedClassifyItem(nextUnassigned.id);
    }
  };

  const handleSubmit = () => {
    if (feedback?.type === 'correct') {
      onCompleteQuest({
        usedHint: showHint,
        firstTryCorrect: !hadWrongAttempt,
        resourceBonus: quest.resourceBonus,
      });
      return;
    }

    let isCorrect = false;
    let wrongMessage = 'Not quite right yet! Read Sparky’s hint and try again.';

    if (quest.type === 'mcq') {
      if (selectedMcq === null) {
        setFeedback({ type: 'wrong', message: 'Please pick one answer option first!' });
        return;
      }
      isCorrect = selectedMcq === quest.correctIndex;
    } else if (quest.type === 'sequence') {
      const res = evaluateSequenceAnswer(sequenceOrder, quest.correctOrder);
      isCorrect = res.correct;
      if (!isCorrect) {
        wrongMessage = `${res.correctCount} of ${res.total} steps are in the right spot. Adjust the order and check again!`;
      }
    } else if (quest.type === 'classify') {
      const unassigned = quest.items.filter((it) => !assignments[it.id]);
      if (unassigned.length > 0) {
        setFeedback({
          type: 'wrong',
          message: `Assign all ${quest.items.length} cards to a category first (${unassigned.length} left).`,
        });
        return;
      }
      const res = evaluateClassifyAnswer(assignments, quest.items);
      isCorrect = res.correct;
      setWrongClassifyIds(res.wrongIds);
      if (!isCorrect) {
        wrongMessage = `${res.correctCount} of ${res.total} cards matched! Highlighted cards need a different group.`;
      }
    }

    onAttemptRecorded(isCorrect);

    if (isCorrect) {
      soundFX.playCorrect();
      setFeedback({
        type: 'correct',
        message: quest.explanation,
      });
    } else {
      soundFX.playWrong();
      setHadWrongAttempt(true);
      setFeedback({
        type: 'wrong',
        message: wrongMessage,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.72)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div className="voxel-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-100 p-5 md:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" />
              {stage.topicCode} · Beacon {beaconIndex + 1} of 3 ·{' '}
              {quest.type === 'mcq'
                ? 'Trivia Quest'
                : quest.type === 'sequence'
                  ? 'Order Puzzle'
                  : 'Lab Classification Puzzle'}
            </div>
            <h2 id="quest-modal-title" className="text-xl font-black text-white mt-0.5">
              {quest.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Quest Modal"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Prompt */}
        <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
          {quest.prompt}
        </p>

        {/* Challenge Body */}
        {quest.type === 'mcq' && (
          <div className="flex flex-col gap-2.5">
            {quest.options.map((opt, idx) => {
              const isSelected = selectedMcq === idx;
              const isWinner = feedback?.type === 'correct' && idx === quest.correctIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={feedback?.type === 'correct'}
                  onClick={() => {
                    setSelectedMcq(idx);
                    setFeedback(null);
                  }}
                  className={`text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-colors cursor-pointer flex items-center gap-3 ${
                    isWinner
                      ? 'bg-emerald-900/70 border-emerald-400 text-white'
                      : isSelected
                        ? 'bg-sky-900/80 border-amber-400 text-white'
                        : 'bg-slate-800/90 border-slate-700 hover:border-slate-500 text-slate-200'
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-600 flex items-center justify-center text-xs font-black text-amber-300 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {quest.type === 'sequence' && (
          <div className="flex flex-col gap-2">
            {sequenceOrder.map((itemId, idx) => {
              const item = quest.items.find((it) => it.id === itemId)!;
              const isLocked = feedback?.type === 'correct';
              return (
                <div
                  key={itemId}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border-2 ${
                    isLocked
                      ? 'bg-emerald-900/50 border-emerald-400'
                      : 'bg-slate-800/90 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 tabular-nums">
                      {idx + 1}
                    </span>
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <span className="text-sm font-bold text-white">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0 || isLocked}
                      onClick={() => moveSequenceItem(idx, -1)}
                      aria-label={`Move ${item.label} up`}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-35 text-white cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sequenceOrder.length - 1 || isLocked}
                      onClick={() => moveSequenceItem(idx, 1)}
                      aria-label={`Move ${item.label} down`}
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-35 text-white cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {quest.type === 'classify' && (
          <div className="flex flex-col gap-3">
            {/* Step 1: Select Specimen / Card */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                1. Pick a card, then click its matching group below:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quest.items.map((item) => {
                  const assignedCatId = assignments[item.id];
                  const assignedCat = quest.categories.find((c) => c.id === assignedCatId);
                  const isActive = selectedClassifyItem === item.id;
                  const isWrong = wrongClassifyIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={feedback?.type === 'correct'}
                      onClick={() => setSelectedClassifyItem(item.id)}
                      className={`text-left p-2.5 rounded-xl border-2 flex items-start gap-2.5 cursor-pointer transition-colors ${
                        isWrong
                          ? 'bg-rose-950/70 border-rose-400'
                          : isActive
                            ? 'bg-sky-900/70 border-amber-400'
                            : 'bg-slate-800/90 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-xl leading-none mt-0.5">{item.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white leading-snug">
                          {item.label}
                        </div>
                        <div
                          className="text-[11px] font-bold mt-1"
                          style={{ color: assignedCat ? assignedCat.color : '#94a3b8' }}
                        >
                          {assignedCat ? `→ ${assignedCat.label}` : 'Unassigned'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Category Buckets */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                2. Assign selected card to:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quest.categories.map((cat) => {
                  const countInCat = Object.values(assignments).filter(
                    (c) => c === cat.id,
                  ).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      data-testid={`classify-cat-${cat.id}`}
                      disabled={feedback?.type === 'correct'}
                      onClick={() => assignToCategory(cat.id)}
                      className="text-left p-2.5 rounded-xl border-2 bg-slate-900/90 hover:bg-slate-800 cursor-pointer flex items-center justify-between gap-2"
                      style={{ borderColor: cat.color }}
                    >
                      <div>
                        <div className="text-xs font-black" style={{ color: cat.color }}>
                          {cat.label}
                        </div>
                        <div className="text-[11px] text-slate-300">{cat.description}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-black tabular-nums text-white shrink-0">
                        {countInCat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sparky Hint Drawer */}
        {showHint && (
          <div className="rounded-xl bg-amber-950/70 border border-amber-500/60 p-3 text-xs font-semibold text-amber-100 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>{quest.hint}</span>
          </div>
        )}

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`rounded-xl p-3.5 border-2 flex items-start gap-2.5 ${
              feedback.type === 'correct'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100'
                : 'bg-rose-950/80 border-rose-400 text-rose-100'
            }`}
          >
            {feedback.type === 'correct' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            )}
            <div className="text-xs md:text-sm font-semibold leading-relaxed">
              {feedback.type === 'correct' && (
                <div className="font-black text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Awesome! +{quest.resourceBonus} {stage.rewardResource.icon}{' '}
                  {stage.rewardResource.name} Earned!
                </div>
              )}
              {feedback.message}
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            disabled={showHint || feedback?.type === 'correct'}
            onClick={() => setShowHint(true)}
            className="voxel-btn bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            Ask Sparky (-25% pts)
          </button>

          <button
            type="button"
            data-testid="quest-submit-btn"
            onClick={handleSubmit}
            className={`voxel-btn font-black text-sm px-5 py-2.5 rounded-xl cursor-pointer ${
              feedback?.type === 'correct'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {feedback?.type === 'correct' ? 'Claim Resource & Continue' : 'Check Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};
