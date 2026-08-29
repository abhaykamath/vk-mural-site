import inventory from '../../../inventory.json';
import { en } from './en';
import { hi } from './hi';
import { ml } from './ml';
import { DEFAULT_LOCALE, LOCALES, type Locale, type Strings } from './types';

export * from './types';

const STRINGS: Record<Locale, Strings> = { en, ml, hi };

export function t(locale: Locale): Strings {
  return STRINGS[locale] ?? en;
}

/** Contact details. Not translated: they are the same in every language. */
export const artist = {
  name: 'Vandana Kamath',
  /** Her name in each script. A Malayalam page should not name her in Latin. */
  displayName: { en: 'Vandana Kamath', ml: 'വന്ദന കാമത്ത്', hi: 'वंदना कामत' },
  email: 'vandanakamath2267@gmail.com',
  /** Digits only with country code, for the wa.me link. */
  whatsapp: '919037217114',
  whatsappDisplay: '+91 90372 17114',
  location: { en: 'Calicut, Kerala', ml: 'കോഴിക്കോട്, കേരളം', hi: 'कोझिकोड, केरल' },
};

export function whatsappHref(locale: Locale): string {
  return `https://wa.me/${artist.whatsapp}?text=${encodeURIComponent(t(locale).contact.prefilled)}`;
}

/**
 * A painting, merged from two sources.
 *
 * `inventory.json` is her own working record and stays in English: the slug, the
 * image, the real measurements. Titles and descriptions for the other languages
 * live in the i18n files and override it here, so her file stays clean and every
 * translated string sits in one place per language.
 */
export interface Painting {
  slug: string;
  name: string;
  description: string;
  src: string;
  /**
   * Null until Vandana supplies them. They are printed on the site as facts
   * about her work, so a guess is worse than an omission: every place that shows
   * them checks first and leaves the line out rather than inventing a number.
   */
  widthInches: number | null;
  heightInches: number | null;
  days: number | null;
}

export function paintings(locale: Locale): Painting[] {
  const overrides = t(locale).work.pieces;
  return inventory.paintings.map((piece) => ({
    slug: piece.slug,
    name: overrides[piece.slug]?.name ?? piece.name,
    description: overrides[piece.slug]?.description ?? piece.description,
    src: piece.src,
    widthInches: piece.width_inches,
    heightInches: piece.height_inches,
    days: piece.time_taken_days,
  }));
}

// ---------------------------------------------------------------------------
// Routing
// ---------------------------------------------------------------------------

/**
 * English lives at the root, the others under a prefix.
 *
 * `path` is always the language-neutral part, for example `journal/some-article`
 * or the empty string for the home page.
 */
export function localePath(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return clean ? `${prefix}/${clean}/` : `${prefix}/` || '/';
}

/** Reads the locale out of a URL path. Falls back to the default. */
export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return LOCALES.includes(first as Locale) ? (first as Locale) : DEFAULT_LOCALE;
}

/**
 * The language-neutral part of a path, so the language switcher can hold the
 * reader's position. Switching language from an article should land on that same
 * article, not on the home page.
 */
export function neutralPath(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (LOCALES.includes(parts[0] as Locale) && parts[0] !== DEFAULT_LOCALE) parts.shift();
  return parts.join('/');
}

/** Absolute URLs for hreflang and canonical tags. */
export function alternates(site: URL | undefined, path = ''): Array<{ locale: Locale; href: string }> {
  const origin = site?.origin ?? '';
  return LOCALES.map((locale) => ({ locale, href: `${origin}${localePath(locale, path)}` }));
}
