import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDomainMastery,
  calculateQuestScore,
  clampPlayerPosition,
  computeMasteryLevel,
  createInitialStudentProfiles,
  evaluateClassifyAnswer,
  evaluateSequenceAnswer,
  findNearestActiveBeacon,
  selectQuestsForStage,
} from './rules';
import { TOPIC_STAGES } from '../data/curriculum';

test('TOPIC_STAGES follows 14 sequential topics with 3 quests and a 6-question bank each (84 total)', () => {
  assert.equal(TOPIC_STAGES.length, 14);
  const seenQuestIds = new Set<string>();
  let totalQuestions = 0;

  TOPIC_STAGES.forEach((stage, idx) => {
    assert.equal(stage.id, idx + 1);
    assert.equal(stage.quests.length, 3);
    assert.ok(stage.questBank && stage.questBank.length === 6);
    assert.ok(stage.rewardResource.id.length > 0);
    assert.ok(stage.badge.id.length > 0);

    for (const q of stage.questBank) {
      totalQuestions++;
      assert.ok(!seenQuestIds.has(q.id), `Duplicate quest ID: ${q.id}`);
      seenQuestIds.add(q.id);
      if (q.type === 'mcq') {
        assert.ok(q.options.length >= 2);
        assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
      } else if (q.type === 'sequence') {
        const itemIds = new Set(q.items.map((it) => it.id));
        assert.equal(q.correctOrder.length, q.items.length);
        q.correctOrder.forEach((id) => assert.ok(itemIds.has(id)));
      } else if (q.type === 'classify') {
        const catIds = new Set(q.categories.map((c) => c.id));
        assert.ok(q.items.length >= 3);
        q.items.forEach((it) => assert.ok(catIds.has(it.correctCategory)));
      }
    }

    const firstRun = selectQuestsForStage(stage, 0);
    const replayRun = selectQuestsForStage(stage, 1);
    assert.equal(firstRun.length, 3);
    assert.equal(replayRun.length, 3);
    assert.notEqual(firstRun[0].id, replayRun[0].id);
  });

  assert.equal(totalQuestions, 84);
});

test('calculateQuestScore applies streak bonus, time bonus, and hint discount', () => {
  const full = calculateQuestScore({
    basePoints: 100,
    streak: 2,
    timeBonusSeconds: 10,
    usedHint: false,
  });
  assert.equal(full, 150);

  const hinted = calculateQuestScore({
    basePoints: 100,
    streak: 0,
    timeBonusSeconds: 0,
    usedHint: true,
  });
  assert.equal(hinted, 75);
});

test('computeMasteryLevel maps accuracy and completion accurately', () => {
  assert.equal(computeMasteryLevel(0, 0, false), 'Not Started');
  assert.equal(computeMasteryLevel(1, 3, false), 'Needs Practice');
  assert.equal(computeMasteryLevel(2, 3, false), 'Developing');
  assert.equal(computeMasteryLevel(2, 3, true), 'Proficient');
  assert.equal(computeMasteryLevel(3, 3, true), 'Mastered');
});

test('evaluateSequenceAnswer validates food chain order', () => {
  const correct = ['grass', 'rabbit', 'snake', 'eagle'];
  const pass = evaluateSequenceAnswer(['grass', 'rabbit', 'snake', 'eagle'], correct);
  assert.equal(pass.correct, true);
  assert.equal(pass.correctCount, 4);

  const partial = evaluateSequenceAnswer(['grass', 'snake', 'rabbit', 'eagle'], correct);
  assert.equal(partial.correct, false);
  assert.equal(partial.correctCount, 2);
});

test('evaluateClassifyAnswer validates cellular biology puzzle sorting', () => {
  const items = [
    { id: 'c1', label: 'Healthy cell', emoji: '💚', correctCategory: 'normal_cell' },
    { id: 'c2', label: 'Cancer cell', emoji: '🔴', correctCategory: 'cancer_cell' },
  ];
  const pass = evaluateClassifyAnswer({ c1: 'normal_cell', c2: 'cancer_cell' }, items);
  assert.equal(pass.correct, true);
  assert.deepEqual(pass.wrongIds, []);

  const fail = evaluateClassifyAnswer({ c1: 'normal_cell', c2: 'normal_cell' }, items);
  assert.equal(fail.correct, false);
  assert.deepEqual(fail.wrongIds, ['c2']);
});

test('calculateDomainMastery summarizes Cellular Biology and Ecosystem Relationships', () => {
  const profiles = createInitialStudentProfiles();
  const bryan = profiles[0];
  const bryanSummary = calculateDomainMastery(bryan.topicProgress, TOPIC_STAGES);
  assert.equal(bryanSummary['Ecosystem Relationships'].topicsCompleted, 0);
  assert.equal(bryanSummary['Ecosystem Relationships'].mastery, 'Not Started');

  const mei = profiles[2];
  const domainSummary = calculateDomainMastery(mei.topicProgress, TOPIC_STAGES);

  assert.equal(domainSummary['Ecosystem Relationships'].topicsTotal, 2);
  assert.equal(domainSummary['Ecosystem Relationships'].topicsCompleted, 1);
  assert.equal(domainSummary['Ecosystem Relationships'].accuracyPct, 100);
  assert.equal(domainSummary['Cellular Biology'].topicsTotal, 2);
  assert.equal(domainSummary['Cellular Biology'].mastery, 'Needs Practice');
});

test('clampPlayerPosition and findNearestActiveBeacon behave accurately', () => {
  const clamped = clampPlayerPosition(15, -20, 10);
  assert.deepEqual(clamped, { x: 10, z: -10 });

  const beacons = [
    { index: 0, x: 4, z: 0, completed: true },
    { index: 1, x: -3, z: 2, completed: false },
    { index: 2, x: 8, z: 8, completed: false },
  ];
  const near = findNearestActiveBeacon(-2.5, 2.2, beacons, 3.0);
  assert.equal(near?.index, 1);

  const none = findNearestActiveBeacon(4, 0, beacons, 2.5);
  assert.equal(none, null);
});
