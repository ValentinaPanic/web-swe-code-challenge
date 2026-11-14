import Image from 'next/image';
import { featureImages } from '@/lib/media';
import type { Features as FeaturesContent } from '@/types/content';
import styles from './Features.module.css';

export function Features({ features }: { features: FeaturesContent }) {
  // One scroll timeline per card lights up its matching dot (mobile carousel, CSS only).
  const timelines = features.items.map((_, index) => `--feature-${index}`);

  return (
    <section
      className={styles.section}
      aria-labelledby="features-heading"
      style={{ timelineScope: timelines.join(', ') }}
    >
      <h2 id="features-heading" className={styles.heading}>
        {features.heading}
      </h2>
      {/* Focusable so keyboard users can scroll the mobile carousel with the arrow keys. */}
      <ul className={styles.list} tabIndex={0}>
        {features.items.map((item, index) => {
          const media = featureImages[index];
          return (
            <li key={item.title} className={styles.item} style={{ viewTimelineName: timelines[index] }}>
              <article className={styles.card}>
                {media && (
                  <div className={styles.media}>
                    <Image
                      src={media.src}
                      alt={media.alt}
                      sizes="(min-width: 1440px) 350px, (min-width: 960px) 30vw, 90vw"
                      className={styles.image}
                    />
                  </div>
                )}
                <div className={styles.text}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      {/* A visual hint only: swiping and the arrow keys do the scrolling. */}
      <div className={styles.dots} aria-hidden="true">
        {timelines.map((timeline) => (
          <span key={timeline} className={styles.dot} style={{ animationTimeline: timeline }} />
        ))}
      </div>
    </section>
  );
}
