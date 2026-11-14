import { ArtDirectedImage } from '@/components/ui/ArtDirectedImage/ArtDirectedImage';
import { footerImage } from '@/lib/media';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <ArtDirectedImage {...footerImage} />
    </footer>
  );
}
