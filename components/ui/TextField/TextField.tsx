import { Field, fieldStyles } from '@/components/ui/Field/Field';

interface Props {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel';
  required?: boolean;
  autoComplete?: string;
}

export function TextField({ id, name, label, type = 'text', required, autoComplete }: Props) {
  return (
    <Field id={id} label={label} required={required}>
      {/* The blank placeholder lets CSS tell an empty input from a filled one. */}
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className={fieldStyles.control}
      />
    </Field>
  );
}
