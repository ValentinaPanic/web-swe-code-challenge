import { ArtDirectedImage } from '@/components/ui/ArtDirectedImage/ArtDirectedImage';
import { navImage } from '@/lib/media';
import styles from './SiteHeader.module.css';

// No <nav> while the nav is an image: a nav landmark without links would mislead screen readers.
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <ArtDirectedImage {...navImage} loading="eager" className={styles.image} />
    </header>
  );
}
