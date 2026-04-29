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
        <FormItem className="space-y-1.5">
          {labelText && (
            <FormLabel className="text-foreground/90 text-[13px] font-semibold">
              {labelText}
            </FormLabel>
          )}
          <FormControl>
            <Input
              id={id}
              type={type}
              placeholder={placeholder || '...'}
              {...field}
              className="bg-background border-border focus-visible:ring-primary/20 focus-visible:border-primary placeholder:text-muted-foreground/50 h-11 transition-all"
            />
          </FormControl>
          {formDescription && (
            <FormDescription className="text-[12px]">{formDescription}</FormDescription>
          )}
          <FormMessage className="text-[12px] font-medium" />
        </FormItem>
      )}
    />
  );
};

export default FormField;
