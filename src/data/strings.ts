/**
 * Every word on the site that is not a painting's own title or an article.
 *
 * The biography, the facts, the panchavarna section, the four stages and the
 * pull quote are Vandana's own words. The pigment descriptions and the interface
 * strings are mine and she should read them before publication.
 */

export interface Pigment {
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

export const strings = {
  meta: {
    title: 'Vandana Kamath | Kerala Mural Artist',
    description:
      'Vandana Kamath paints in the Kerala mural tradition, following its classical proportions and the five colours of panchavarna, in acrylic on canvas. Original paintings, writing on the art form, and commissions.',
    ogDescription:
      'Original paintings in the Kerala mural tradition, and writing on an art form practised for more than a thousand years.',
  },

  nav: {
    work: 'Paintings',
    tradition: 'The Art Form',
    about: 'About',
    journal: 'Journal',
    contact: 'Contact',
    skip: 'Skip to the paintings',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  role: 'Kerala Mural Artist',

  hero: {
    eyebrow: 'Kerala mural painting',
    headline: 'Five colours, classical proportions, and a line that cannot be',
    /** Split so the closing phrase can be set in red without markup in the copy. */
    headlineAccent: 'taken back.',
    lead: 'I am Vandana Kamath. I paint in a tradition that has been worked on the temple walls of Kerala for more than a thousand years, following the same proportions and the same order of working, in acrylic on canvas.',
    notes: {
      paintings: 'paintings shown',
      medium: 'Acrylic on canvas',
    },
  },

  work: {
    eyebrow: 'The paintings',
    heading: 'Recent work',
    lead: 'Each of these is an original, painted by hand in acrylic on canvas. Sizes and working time are given because both matter if you are thinking of living with a piece. Select any painting to see it larger.',
    /** Abbreviated unit shown on the label. */
    unit: 'in',
    days: 'days of work',
    viewLarger: 'View larger',
  },

  tradition: {
    eyebrow: 'The art form',
    heading: 'Panchavarna: five colours, and only five',
    lead: 'Kerala mural painting is about depicting mythology. It is also called temple art, because it originated in the temples, churches and palaces of Kerala, and the form dates back to the ninth to twelfth centuries CE. The colours were pigments procured from naturally available resources. As the name panchavarna suggests, only five colours go into traditional mural painting, even today.',
    pigments: [
      {
        name: 'Chunnambu',
        colour: 'White',
        source: 'Shell lime, burnt and slaked, then burnished until the wall holds a sheen.',
      },
      {
        name: 'Manjal',
        colour: 'Yellow',
        source: 'Yellow ochre. The whole drawing is set down in this before any other colour.',
      },
      {
        name: 'Manjadi',
        colour: 'Red',
        source: 'Red ochre and laterite, ground fine. It carries appetite, wealth and anger.',
      },
      {
        name: 'Eravikkara',
        colour: 'Green',
        source: 'A leaf green, kept for the serene and the divine. Krishna is green for a reason.',
      },
      {
        name: 'Kari',
        colour: 'Black',
        source:
          'Lamp soot in coconut oil. It goes on last, and it is the line that decides everything.',
      },
    ] satisfies Pigment[],
    /** How the tradition has moved off the wall in recent years. */
    today: {
      heading: 'Off the wall',
      body: 'In recent years artists have been using readily available market pigments instead of natural ones, and have extended this temple art onto canvases, wooden panels, bamboo decor products and even fabrics.',
    },
  },

  /** Vandana's own words on working in acrylic. Quoted, not paraphrased. */
  quote: {
    text: 'I have used acrylic colours in all my mural paintings, following all other meticulous techniques and maintaining their symbolic richness without losing their soul.',
    attribution: 'Vandana Kamath',
  },

  process: {
    eyebrow: 'How a mural is made',
    heading: 'Slow, laborious, and in that order',
    lead: 'Creating murals was and remains a time consuming and laborious process. Most of the work happens before a single figure is drawn, and none of it can be hurried, because every stage has to dry completely before the next one begins.',
    steps: [
      {
        title: 'Preparing the wall',
        body: 'Various naturally available materials are mixed in specific proportions and applied to the wall. Once dry, several more coats follow, each given enough time to dry completely.',
      },
      {
        title: 'Smearing and drying again',
        body: 'The process is repeated with different mixtures, smearing the wall again and letting it dry. Only when the ground is finished is the wall ready to be painted on at all.',
      },
      {
        title: 'Designing the artwork',
        body: 'Only then can the artist set out the design on the wall, working out the whole composition before any colour is committed to it.',
      },
      {
        title: 'Brushes and palettes',
        body: 'Finally the painting itself, in five colours and no more. The discipline of the palette is what holds the work inside the tradition.',
      },
    ] satisfies Step[],
  },

  about: {
    eyebrow: 'About',
    heading: 'Vandana Kamath',
    // From Vandana's own written account.
    biography: [
      'I have been in the Kerala mural tradition for over twelve years. I learnt the art from a professional mural teacher.',
      'My work stays close to traditional mural art. I follow the classical proportions and the various systematic steps involved in it.',
      'I take a small number of commissions each year, mostly for private collections, made to their customised requirements.',
    ],
    facts: [
      { label: 'Based in', value: 'Calicut, Kerala' },
      { label: 'Practising', value: 'Since 2014' },
      { label: 'Trained by', value: 'A professional mural teacher' },
      { label: 'Materials', value: 'Acrylic colours, brushes and canvas' },
      { label: 'Commissions', value: 'Private collections, to customised requirements' },
    ] satisfies Fact[],
    portraitAlt:
      'Vandana Kamath at her easel, painting a Kerala mural, with pots of acrylic colour in front of her and framed murals on the wall behind.',
  },

  journal: {
    eyebrow: 'Journal',
    heading: 'Writing on the tradition',
    lead: 'Notes on materials, on reading temple walls, and on the parts of the practice that are rarely written down.',
    readMore: 'Read the article',
    minutes: 'min read',
    back: 'Back to all writing',
    empty: 'Nothing published yet.',
  },

  contact: {
    eyebrow: 'Enquiries',
    heading: 'Talk to me about a painting',
    lead: 'If a piece here interests you, or you have a commission in mind, write to me. Please tell me roughly what size you are thinking of and where it will hang; those two things shape everything else.',
    note: 'I reply to everything myself, usually within a few days. Commissions are taken in small numbers, so there is often a wait.',
    whatsapp: 'WhatsApp',
    email: 'Email',
  },

  lightbox: {
    close: 'Close',
    previous: 'Previous painting',
    next: 'Next painting',
    size: 'Size',
    work: 'Work',
    medium: 'Medium',
    mediumValue: 'Acrylic on canvas',
    ask: 'Ask about this painting',
    days: 'days',
    inches: 'inches',
  },

  footer: {
    rights: 'All paintings are original works.',
  },
};
