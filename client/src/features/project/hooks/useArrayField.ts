import { useCallback } from 'react';
import { type UseFormReturn } from 'react-hook-form';

interface ArrayItem {
  [key: string]: string;
}

export const useArrayField = <T extends ArrayItem>(
  form: UseFormReturn<any>,
  fieldName: string,
  itemKey: string,
) => {
  const handleAdd = useCallback(
    (value: string) => {
      if (!value.trim()) {
        return;
      }

      const currentItems = form.getValues(fieldName);
      const itemExists = currentItems.some((item: T) => item[itemKey] === value);

      if (!itemExists) {
        form.setValue(fieldName, [...currentItems, { [itemKey]: value.trim() }]);
      }
    },
    [form, fieldName, itemKey],
  );

  const handleDelete = useCallback(
    (value: string) => {
      const filteredItems = form.getValues(fieldName).filter((item: T) => item[itemKey] !== value);
      form.setValue(fieldName, filteredItems);
    },
    [form, fieldName, itemKey],
  );

  return { handleAdd, handleDelete };
};
