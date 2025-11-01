import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { useProfileFieldUpdate } from '../../-hooks/useProfile';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const UpdateProfileHeaderForm = () => {
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bio: '',
  });
  const [loaderValue, setLoaderValue] = useState('');

  const { mutateAsync, isPending } = useProfileFieldUpdate();
  const { profile } = useSelector((state: RootState) => state.profile);

  const parentClasses = 'flex gap-2';

  const handleUpdate = async (
    fieldName: keyof typeof fields,
    newValue: string,
    oldValue: string,
  ) => {
    if (newValue === '' || newValue === oldValue) return;
    setLoaderValue(fieldName);
    await mutateAsync({ fieldName, fieldData: newValue });
  };

  const renderField = (label: string, fieldName: keyof typeof fields, oldValue: string) => (
    <div key={fieldName} className='space-y-2'>
      <p className='text-muted-foreground text-sm'>{label}</p>
      <div className={parentClasses}>
        <Input
          name={fieldName}
          placeholder={oldValue}
          defaultValue={oldValue}
          onChange={e => setFields(prev => ({ ...prev, [fieldName]: e.target.value.trim() }))}
        />
        <Button
          onClick={() => handleUpdate(fieldName, fields[fieldName], oldValue)}
          disabled={isPending && loaderValue === fieldName}
          className='text-foreground'
        >
          Update
        </Button>
      </div>
    </div>
  );

  return (
    <DynamicDialogWithHeaderAction
      title="Update Profile"
      description="Update your profile details"
      mode="edit"
    >
      {renderField('First Name', 'firstName', profile.firstName)}
      {renderField('Last Name', 'lastName', profile.lastName)}
      {renderField('Phone Number(Private)', 'phoneNumber', profile.phoneNumber)}
      {renderField('Bio', 'bio', profile.bio)}
    </DynamicDialogWithHeaderAction>
  );
};
