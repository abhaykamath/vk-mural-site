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

/*
 * Paintings live in the CMS database now, not in `inventory.json`.
 *
 * `getPaintings` is re-exported here so the components keep importing
 * everything about the site's content from one place.
 */
export { getPaintings, getHeroPainting, type Painting } from './supabase';
