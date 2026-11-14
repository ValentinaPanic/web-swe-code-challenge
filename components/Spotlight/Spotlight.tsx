import Image from 'next/image';
import { spotlightImages, spotlightPhoto } from '@/lib/media';
import type { Spotlight as SpotlightContent } from '@/types/content';
import styles from './Spotlight.module.css';

export function Spotlight({ spotlight, index }: { spotlight: SpotlightContent; index: number }) {
  const headingId = `spotlight-${index + 1}-heading`;
  const media = spotlightImages[index];

  return (
    <section className={styles.section} aria-labelledby={headingId} data-media={spotlight.mediaPosition}>
      <div className={styles.container}>
        <div className={styles.text}>
          <div className={styles.intro}>
            <h2 id={headingId} className={styles.title}>
              {spotlight.title}
            </h2>
            <p className={styles.description}>{spotlight.description}</p>
          </div>
          <ul className={styles.benefits}>
            {spotlight.benefits.map((benefit) => (
              <li key={benefit} className={styles.benefit}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        {media && (
          <div className={styles.media}>
            <Image src={spotlightPhoto} alt="" fill sizes="(min-width: 1440px) 705px, (min-width: 960px) 50vw, 100vw" className={styles.photo} />
            <Image
              src={media.src}
              alt={media.alt}
              sizes="(min-width: 1440px) 610px, (min-width: 960px) 45vw, 86vw"
              className={styles.screenshot}
            />
          </div>
        )}
      </div>
    </section>
  );
}
