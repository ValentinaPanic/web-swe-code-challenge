import Image from 'next/image';
import logo from '@/assets/images/logo-dat.svg';
import menuIcon from '@/assets/images/icon-menu.svg';
import searchIcon from '@/assets/images/icon-search.svg';
import { Button } from '@/components/ui/Button/Button';
import type { Nav } from '@/types/content';
import styles from './SiteHeader.module.css';

// Rendered twice (desktop row, mobile panel); CSS shows one, and display: none hides the other from screen readers.
function NavItems({ nav }: { nav: Nav }) {
  return (
    <>
      <ul className={styles.links}>
        {nav.links.map((link) => (
          <li key={link.label}>
            {/* Dropdowns aren't built: the chevron is decorative (PLAN §7 step 13). */}
            <a
              href={link.href}
              className={styles.link}
              data-menu={link.hasMenu || undefined}
              aria-current={link.current ? 'page' : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      {/* Search isn't in content.json and has no behavior, so it's decorative. */}
      <Image src={searchIcon} alt="" className={styles.search} />
      <div className={styles.actions}>
        {/* Figma draws the nav's primary action solid blue, not the brand gradient; content.json stays unchanged. */}
        {nav.actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant === 'primary' ? 'solid' : action.variant}
            href={action.href}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </>
  );
}

export function SiteHeader({ nav }: { nav: Nav }) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main">
        <Image src={logo} alt="DAT Freight & Analytics" className={styles.logo} loading="eager" />
        <div className={styles.desktop}>
          <NavItems nav={nav} />
        </div>
        {/* The open state isn't designed (Q6); <details> gives a working, JS-free toggle. */}
        <details className={styles.menu}>
          <summary className={styles.menuButton} aria-label="Menu">
            <Image src={menuIcon} alt="" />
          </summary>
          <div className={styles.panel}>
            <NavItems nav={nav} />
          </div>
        </details>
      </nav>
    </header>
  );
}
