import { Field, fieldStyles } from '@/components/ui/Field/Field';

interface Props {
  id: string;
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  autoComplete?: string;
}

export function SelectField({ id, name, label, options, required, autoComplete }: Props) {
  return (
    <Field id={id} label={label} required={required}>
      <select
        id={id}
        name={name}
        required={required}
        autoComplete={autoComplete}
        defaultValue=""
        className={fieldStyles.control}
      >
        {/* Empty first option: the label stays inside until a real choice is made. */}
        <option value="" />
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </Field>
  );
}
