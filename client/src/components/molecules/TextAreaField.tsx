import type { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form';

import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadcnFormField,
} from '../ui/form';

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
  textAreaClasses?: string;
  className?: string;
}

export const TextAreaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  id,
  name,
  labelText,
  placeholder,
  formDescription,
  textAreaClasses,
  className,
}: FormFieldProps<TFieldValues, TName>) => {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {labelText && <FormLabel>{labelText}</FormLabel>}
          <FormControl>
            <Textarea
              placeholder={placeholder || '...'}
              className={cn(
                'max-h-[400px] resize-none overflow-auto',
                textAreaClasses,
                className,
                form.formState.errors[name] && 'border-red-500',
              )}
              id={id || name}
              {...field}
            />
          </FormControl>
          {formDescription && <FormDescription>{formDescription}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
