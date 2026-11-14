import { Button } from '@/components/ui/Button/Button';
import type { Cta } from '@/types/content';
import styles from './CtaBanner.module.css';

export function CtaBanner({ cta }: { cta: Cta }) {
  return (
    <aside className={styles.banner} aria-labelledby="cta-heading">
      <div className={styles.text}>
        <h2 id="cta-heading" className={styles.heading}>
          {cta.heading}
        </h2>
        <p className={styles.body}>{cta.text}</p>
      </div>
      <div className={styles.actions}>
        {cta.actions.map((action) => (
          <Button key={action.label} variant={action.variant} href={action.href} className={styles.action}>
            {action.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
