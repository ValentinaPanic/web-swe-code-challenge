import Image from 'next/image';
import { Button } from '@/components/ui/Button/Button';
import { heroImage } from '@/lib/media';
import type { Hero as HeroContent } from '@/types/content';
import styles from './Hero.module.css';

export function Hero({ hero }: { hero: HeroContent }) {
  const { callout } = hero;

  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <div className={styles.text}>
          <div className={styles.intro}>
            <h1 id="hero-heading" className={styles.heading}>
              {hero.heading}
            </h1>
            <p className={styles.subheading}>{hero.subheading}</p>
          </div>
          <div className={styles.callout}>
            <div className={styles.calloutMessage}>
              <span className={styles.calloutIcon} aria-hidden="true" />
              {/* A promo line, not a section, so no heading (PLAN §6). */}
              <p className={styles.calloutText}>
                <strong className={styles.calloutHeading}>{callout.heading}</strong> {callout.text}
              </p>
            </div>
            <Button variant="primary" href={callout.cta.href} className={styles.calloutCta}>
              {callout.cta.label}
            </Button>
          </div>
        </div>
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          loading="eager"
          sizes="(min-width: 1440px) 544px, (min-width: 960px) 43vw, 100vw"
          className={styles.image}
        />
      </div>
    </section>
  );
}
