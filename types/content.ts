// Shape of data/content.json (the mock CMS response). Mirrors the JSON exactly;
// string unions are enforced at load time by lib/contentGuards.ts.

export const BUTTON_VARIANTS = ['primary', 'outline', 'ghost', 'solid'] as const;
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const FIELD_TYPES = ['text', 'email', 'tel', 'select'] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export const MEDIA_POSITIONS = ['left', 'right'] as const;
export type MediaPosition = (typeof MEDIA_POSITIONS)[number];

export interface Link {
  label: string;
  href: string;
}

export interface Action extends Link {
  variant: ButtonVariant;
}

export interface NavLink extends Link {
  hasMenu: boolean;
  current?: boolean;
}

export interface Nav {
  links: NavLink[];
  actions: Action[];
}

export interface Hero {
  heading: string;
  subheading: string;
  callout: {
    heading: string;
    text: string;
    cta: Link;
  };
}

export interface Feature {
  title: string;
  description: string;
}

export interface Features {
  heading: string;
  items: Feature[];
}

export interface Spotlight {
  title: string;
  description: string;
  benefits: string[];
  mediaPosition: MediaPosition;
}

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export interface AuthorityForm {
  id: string;
  heading: string;
  fields: FormField[];
  authorityNeeded: {
    legend: string;
    options: string[];
  };
  consent: string;
  submitLabel: string;
}

export interface Cta {
  heading: string;
  text: string;
  actions: Action[];
}

export interface FooterColumn {
  heading: string;
  links: string[];
}

export interface Footer {
  columns: FooterColumn[];
  social: string[];
  appDownload: string;
  reviewHeading: string;
  legalLinks: string[];
  copyright: string;
}

export interface Content {
  nav: Nav;
  hero: Hero;
  features: Features;
  spotlights: Spotlight[];
  authorityForm: AuthorityForm;
  cta: Cta;
  footer: Footer;
}
