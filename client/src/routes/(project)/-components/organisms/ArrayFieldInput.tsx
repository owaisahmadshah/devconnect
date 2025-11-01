import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DismissibleBadge } from '@/components/molecules/DismissibleBadge';

interface ArrayFieldInputProps {
  form: UseFormReturn<any>;
  fieldName: string;
  itemKey: string;
  placeholder: string;
  emptyMessage: string;
  onAdd: (value: string) => void;
  onDelete: (value: string) => void;
}

export const ArrayFieldInput: React.FC<ArrayFieldInputProps> = ({
  form,
  fieldName,
  itemKey,
  placeholder,
  emptyMessage,
  onAdd,
  onDelete,
}) => {
  const [inputValue, setInputValue] = useState('');
  const watchedItems = form.watch(fieldName);

  const handleAdd = () => {
    onAdd(inputValue);
    setInputValue('');
  };

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          onChange={e => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="text-muted-foreground m-2 space-y-2 space-x-2 text-xs italic">
        {watchedItems.length > 0 ? (
          watchedItems.map((item: any) => (
            <DismissibleBadge
              key={item[itemKey]}
              text={item[itemKey]}
              onRemove={() => onDelete(item[itemKey])}
              customClasses="rounded"
            />
          ))
        ) : (
          <p>{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};
