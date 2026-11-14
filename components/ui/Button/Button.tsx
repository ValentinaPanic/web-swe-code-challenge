import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/types/content';
import styles from './Button.module.css';

interface Props {
  variant: ButtonVariant;
  href: string;
  className?: string;
  children: ReactNode;
}

export function Button({ variant, href, className, children }: Props) {
  return (
    <a href={href} className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}>
      {children}
    </a>
  );
}
