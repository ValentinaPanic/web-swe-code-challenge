import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/types/content';
import styles from './Button.module.css';

interface Props {
  variant: ButtonVariant;
  // Figma's 12px label (nav buttons, form submit); the default is the 10px label.
  size?: 'large';
  // With an href it's a link; without one it's a <button>.
  href?: string;
  type?: 'button' | 'submit';
  className?: string;
  'aria-describedby'?: string;
  children: ReactNode;
}

export function Button({ variant, size, href, type = 'button', className, children, ...aria }: Props) {
  const classes = [styles.button, styles[variant], size && styles[size], className].filter(Boolean).join(' ');

  return href ? (
    <a href={href} className={classes} {...aria}>
      {children}
    </a>
  ) : (
    <button type={type} className={classes} {...aria}>
      {children}
    </button>
  );
}
