// content.json has no images, so media and alt text live here (PLAN C13).
import footer1440 from '@/assets/images/footer-1440@2x.png';
import footer960 from '@/assets/images/footer-960@2x.png';
import heroProduct from '@/assets/images/hero-product.png';
import truckStop from '@/assets/images/photo-truck-stop.png';
import contractBid from '@/assets/images/screenshot-contract-bid.png';
import loadBoard from '@/assets/images/screenshot-load-board.png';
import rateView from '@/assets/images/screenshot-rateview.png';

// The footer is a placeholder render the brief allows; alt text doesn't promise working links.
// No 360 footer exists, so the 960 render scales down below 960 (PLAN C15).
export const footerImage = {
  alt: 'DAT site footer',
  base: footer960,
  at1440: footer1440,
};

export const heroImage = {
  src: heroProduct,
  alt: 'RateView lane analytics on desktop and DAT One load search on mobile',
};

const loadBoardImage ={ src: loadBoard, alt: 'DAT One load board search results' };
const rateViewImage = { src: rateView, alt: 'RateView lane rate analytics' };

// In the same order as content.features.items.
export const featureImages = [
  loadBoardImage,
  rateViewImage,
  { src: contractBid, alt: 'DAT contract bid with carrier awards' },
];

// In the same order as content.spotlights.
export const spotlightImages = [loadBoardImage, rateViewImage];

// Decorative backdrop behind every spotlight screenshot.
export const spotlightPhoto = truckStop;
