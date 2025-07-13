import { FormItem, FormLabel, FormMessage, FormField } from '../ui/form';
import type { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label?: string;
  options: {
    label: string;
    value: string | boolean | number;
  }[];
}

export const RadioFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label = 'Select an option',
  options,
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-4">
            {options.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  value={String(opt.value)}
                  checked={field.value === opt.value}
                  onChange={e => {
                    const value =
                      typeof opt.value === 'boolean' ? e.target.value === 'true' : e.target.value;
                    field.onChange(value);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
