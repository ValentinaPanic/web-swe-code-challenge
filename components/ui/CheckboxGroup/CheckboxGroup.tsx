import styles from './CheckboxGroup.module.css';

interface Props {
  legend: string;
  name: string;
  options: string[];
}

export function CheckboxGroup({ legend, name, options }: Props) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option} className={styles.option}>
            <input type="checkbox" name={name} value={option} className={styles.checkbox} />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
