// Runtime checks for the CMS response. Relative imports only, so `node --test`
// can load this file without Next's `@/` path alias.
//
// JSON imports widen string unions (e.g. `variant`) to `string`. Everything
// else is checked structurally by TypeScript against `RawContent`; these guards
// narrow the unions and throw at build time if the content is malformed.

import {
  BUTTON_VARIANTS,
  FIELD_TYPES,
  MEDIA_POSITIONS,
  type Action,
  type ButtonVariant,
  type Content,
  type FieldType,
  type MediaPosition,
} from '../types/content.ts';

/** `T` with every string literal union widened to `string`, as a JSON import types it. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type RawContent = Widen<Content>;

function isOneOf<T extends string>(values: readonly T[], value: string): value is T {
  return (values as readonly string[]).includes(value);
}

export const isButtonVariant = (value: string): value is ButtonVariant =>
  isOneOf(BUTTON_VARIANTS, value);

export const isFieldType = (value: string): value is FieldType => isOneOf(FIELD_TYPES, value);

export const isMediaPosition = (value: string): value is MediaPosition =>
  isOneOf(MEDIA_POSITIONS, value);

function narrow<T extends string>(
  guard: (value: string) => value is T,
  allowed: readonly T[],
  value: string,
  path: string,
): T {
  if (!guard(value)) {
    throw new Error(
      `Invalid content at ${path}: expected one of ${allowed.join(' | ')}, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

function parseActions(actions: RawContent['cta']['actions'], path: string): Action[] {
  return actions.map((action, i) => ({
    ...action,
    variant: narrow(isButtonVariant, BUTTON_VARIANTS, action.variant, `${path}[${i}].variant`),
  }));
}

/** Narrows a raw CMS response to `Content`. Throws a descriptive error on invalid values. */
export function parseContent(raw: RawContent): Content {
  return {
    ...raw,
    nav: { ...raw.nav, actions: parseActions(raw.nav.actions, 'nav.actions') },
    spotlights: raw.spotlights.map((spotlight, i) => ({
      ...spotlight,
      mediaPosition: narrow(
        isMediaPosition,
        MEDIA_POSITIONS,
        spotlight.mediaPosition,
        `spotlights[${i}].mediaPosition`,
      ),
    })),
    authorityForm: {
      ...raw.authorityForm,
      fields: raw.authorityForm.fields.map((field, i) => ({
        ...field,
        type: narrow(isFieldType, FIELD_TYPES, field.type, `authorityForm.fields[${i}].type`),
      })),
    },
    cta: { ...raw.cta, actions: parseActions(raw.cta.actions, 'cta.actions') },
  };
}
