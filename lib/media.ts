// content.json has no images, so media and alt text live here (PLAN C13).
import footer1440 from '@/assets/images/footer-1440@2x.png';
import footer960 from '@/assets/images/footer-960@2x.png';
import nav1440 from '@/assets/images/nav-1440@2x.png';
import nav360 from '@/assets/images/nav-360@2x.png';
import nav960 from '@/assets/images/nav-960@2x.png';

// Nav and footer are placeholder renders the brief allows; alt text doesn't promise working links.
export const navImage = {
  alt: 'DAT Freight & Analytics',
  base: nav360,
  at960: nav960,
  at1440: nav1440,
};

// No 360 footer exists, so the 960 render scales down below 960 (PLAN C15).
export const footerImage = {
  alt: 'DAT site footer',
  base: footer960,
  at1440: footer1440,
};
