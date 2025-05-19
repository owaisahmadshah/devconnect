import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadcnFormField,
} from '../ui/form';
import { Input } from '../ui/input';
import type { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  id: string;
  name: TName;
  labelText?: string;
  placeholder?: string;
  formDescription?: string;
  type?: string;
}

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  id,
  name,
  labelText,
  placeholder,
  formDescription,
  type = 'text',
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {labelText && <FormLabel>{labelText}</FormLabel>}
          <FormControl>
            <Input id={id} type={type} placeholder={placeholder || '...'} {...field} />
          </FormControl>
          {formDescription && <FormDescription>{formDescription}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
