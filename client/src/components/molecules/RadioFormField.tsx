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
    value: string;
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
            {options.map(opt => (
              <label key={opt.value} className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  value={opt.value}
                  checked={field.value === opt.value}
                  onChange={field.onChange}
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
