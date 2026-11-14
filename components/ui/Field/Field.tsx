import type { ReactNode } from 'react';
import styles from './Field.module.css';

export { styles as fieldStyles };

interface Props {
  id: string;
  label: string;
  required?: boolean;
  /** The control, with `fieldStyles.control`. It must come before the label for the CSS float. */
  children: ReactNode;
}

// Shared frame for TextField and SelectField: the bordered box and the floating label.
export function Field({ id, label, required, children }: Props) {
  return (
    <div className={styles.field}>
      {children}
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>
    </div>
  );
}
