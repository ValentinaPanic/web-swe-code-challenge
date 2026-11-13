import { test } from 'node:test';
import assert from 'node:assert/strict';
import raw from '../data/content.json' with { type: 'json' };
import {
  isButtonVariant,
  isFieldType,
  isMediaPosition,
  parseContent,
  type RawContent,
} from './contentGuards.ts';

const clone = (): RawContent => structuredClone(raw);

test('guards accept every allowed value', () => {
  for (const v of ['primary', 'outline', 'ghost', 'solid']) assert.ok(isButtonVariant(v));
  for (const t of ['text', 'email', 'tel', 'select']) assert.ok(isFieldType(t));
  for (const p of ['left', 'right']) assert.ok(isMediaPosition(p));
});

test('guards reject unknown values', () => {
  assert.equal(isButtonVariant('danger'), false);
  assert.equal(isFieldType('textarea'), false);
  assert.equal(isMediaPosition('center'), false);
  assert.equal(isButtonVariant('Primary'), false);
});

test('parseContent accepts data/content.json unchanged', () => {
  assert.deepEqual(parseContent(clone()), raw);
});

test('parseContent names the path of an invalid button variant', () => {
  const bad = clone();
  bad.cta.actions[1]!.variant = 'danger';
  assert.throws(() => parseContent(bad), {
    message: /cta\.actions\[1\]\.variant.*"danger"/,
  });
});

test('parseContent rejects an invalid nav action variant', () => {
  const bad = clone();
  bad.nav.actions[0]!.variant = 'link';
  assert.throws(() => parseContent(bad), { message: /nav\.actions\[0\]\.variant/ });
});

test('parseContent rejects an invalid field type', () => {
  const bad = clone();
  bad.authorityForm.fields[2]!.type = 'textarea';
  assert.throws(() => parseContent(bad), { message: /authorityForm\.fields\[2\]\.type/ });
});

test('parseContent rejects an invalid media position', () => {
  const bad = clone();
  bad.spotlights[0]!.mediaPosition = 'center';
  assert.throws(() => parseContent(bad), { message: /spotlights\[0\]\.mediaPosition/ });
});
