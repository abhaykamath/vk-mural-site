import inventory from '../../../inventory.json';

/**
 * Contact details and the artist's name.
 *
 * Kept apart from the page copy below because these are facts about her rather
 * than words on a page: they appear in the masthead, the footer and two links,
 * and should only ever be edited in one place.
 */
export const artist = {
  name: 'Vandana Kamath',
  email: 'vandanakamath2267@gmail.com',
  /** Digits only with country code, for the wa.me link. */
  whatsapp: '919037217114',
  whatsappDisplay: '+91 90372 17114',
  location: 'Calicut, Kerala',
};

/** Opens WhatsApp with the enquiry already written, so nobody has to start it. */
export const whatsappHref = `https://wa.me/${artist.whatsapp}?text=${encodeURIComponent(
  "Hello Vandana, I saw your paintings on your website and I'd like to ask about your work.",
)}`;

/**
 * A painting, read from `inventory.json`.
 *
 * That file is Vandana's own working record: the slug, the image, the real
 * measurements. It is the single source for what is on the site, so adding a
 * painting means adding an entry there and an image, and nothing else.
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

export const paintings: Painting[] = inventory.paintings.map((piece) => ({
  slug: piece.slug,
  name: piece.name,
  description: piece.description,
  src: piece.src,
  widthInches: piece.width_inches,
  heightInches: piece.height_inches,
  days: piece.time_taken_days,
}));
