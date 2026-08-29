/**
 * The shape every language must fill.
 *
 * Keys are parallel across `en.ts`, `ml.ts` and `hi.ts` so the three files can be
 * read side by side during review, and so a missing translation is a type error
 * rather than a blank space discovered by a visitor.
 */

export type Locale = 'en' | 'ml' | 'hi';

export const LOCALES: Locale[] = ['en', 'ml', 'hi'];
export const DEFAULT_LOCALE: Locale = 'en';

/** Shown in the language switcher, always in the language itself. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ml: 'മലയാളം',
  hi: 'हिन्दी',
};

/** For the `lang` attribute and hreflang. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: 'en-IN',
  ml: 'ml-IN',
  hi: 'hi-IN',
};

export interface Pigment {
  /** The pigment's own name, in the script of the current language. */
  name: string;
  /** Which of the five colours it is. */
  colour: string;
  /** Where it comes from and what it does. */
  source: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface Strings {
  meta: {
    title: string;
    description: string;
    ogDescription: string;
  };
  nav: {
    work: string;
    tradition: string;
    about: string;
    journal: string;
    contact: string;
    skip: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
  role: string;
  hero: {
    eyebrow: string;
    /** Split so the closing phrase can be set in red without markup in the copy. */
    headline: string;
    headlineAccent: string;
    lead: string;
    notes: { paintings: string; medium: string };
  };
  work: {
    eyebrow: string;
    heading: string;
    lead: string;
    /** Abbreviated unit shown on the label, for example "in". */
    unit: string;
    days: string;
    viewLarger: string;
    /** Painting titles and descriptions, keyed by slug. Overrides inventory.json. */
    pieces: Record<string, { name: string; description: string }>;
  };
  tradition: {
    eyebrow: string;
    heading: string;
    lead: string;
    pigments: Pigment[];
    /** How the tradition has moved off the wall in recent years. */
    today: { heading: string; body: string };
  };
  /** Vandana's own words on working in acrylic. Quoted, not paraphrased. */
  quote: { text: string; attribution: string };
  process: {
    eyebrow: string;
    heading: string;
    lead: string;
    steps: Step[];
  };
  about: {
    eyebrow: string;
    heading: string;
    biography: string[];
    facts: Fact[];
    portraitAlt: string;
  };
  journal: {
    eyebrow: string;
    heading: string;
    lead: string;
    readMore: string;
    minutes: string;
    back: string;
    empty: string;
  };
  contact: {
    eyebrow: string;
    heading: string;
    lead: string;
    note: string;
    whatsapp: string;
    email: string;
    prefilled: string;
  };
  lightbox: {
    close: string;
    previous: string;
    next: string;
    size: string;
    work: string;
    medium: string;
    mediumValue: string;
    ask: string;
    days: string;
    inches: string;
  };
  footer: {
    rights: string;
  };
}
