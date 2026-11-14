'use client';

import { useState, type FormEvent } from 'react';
import { CheckboxGroup } from '@/components/ui/CheckboxGroup/CheckboxGroup';
import { SelectField } from '@/components/ui/SelectField/SelectField';
import { TextField } from '@/components/ui/TextField/TextField';
import { formOptions } from '@/lib/formOptions';
import type { AuthorityForm as AuthorityFormContent } from '@/types/content';
import styles from './AuthorityForm.module.css';

const autoComplete: Record<string, string> = {
  firstName: 'given-name',
  lastName: 'family-name',
  email: 'email',
  phone: 'tel',
  companyName: 'organization',
  state: 'address-level1',
};

export function AuthorityForm({ form }: { form: AuthorityFormContent }) {
  const [submitted, setSubmitted] = useState(false);
  const headingId = `${form.id}-heading`;
  const consentId = `${form.id}-consent`;

  // Only fires once native validation passes. There's no backend yet, so no action
  // attribute: a plain submit would reload and put the answers in the URL.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.currentTarget.reset();
    setSubmitted(true);
  }

  return (
    <section id={form.id} className={styles.section} aria-labelledby={headingId}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 id={headingId} className={styles.heading}>
          {form.heading}
        </h2>

        <div className={styles.fields}>
          {form.fields.map(({ type, ...field }) => {
            const props = {
              ...field,
              id: `${form.id}-${field.name}`,
              autoComplete: autoComplete[field.name],
            };
            return type === 'select' ? (
              <SelectField key={field.name} {...props} options={formOptions[field.name] ?? []} />
            ) : (
              <TextField key={field.name} {...props} type={type} />
            );
          })}
        </div>

        <CheckboxGroup
          legend={form.authorityNeeded.legend}
          name="authorityNeeded"
          options={form.authorityNeeded.options}
        />

        <p id={consentId} className={styles.consent}>
          {form.consent}
        </p>

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} aria-describedby={consentId}>
            {form.submitLabel}
          </button>
          {/* Always rendered, so screen readers announce the text when it appears. */}
          <p role="status" className={styles.status}>
            {submitted && 'Thanks! We’ll be in touch soon.'}
          </p>
        </div>
      </form>
    </section>
  );
}
