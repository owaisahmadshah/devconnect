import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import {
  Form,
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { addProfileArrayFieldSchema, type TAddProfileArrayField } from 'shared';
import { useProfileArrayUpdate } from '../../-hooks/useProfile';

export const AddSkillForm = () => {
  const { mutateAsync, isPending } = useProfileArrayUpdate();

  const form = useForm<TAddProfileArrayField>({
    resolver: zodResolver(addProfileArrayFieldSchema),
    defaultValues: {
      fieldName: 'skills',
      fieldData: {
        skillName: '',
        skillProficiency: 'Beginner',
        endorsements: [],
      },
    },
  });

  const onSubmit = async (data: TAddProfileArrayField) => {
    await mutateAsync(data);
    form.reset();
  };

  return (
    <DynamicDialogWithHeaderAction
      title="Add Skill"
      description="Add a new technical or soft skill to your profile"
      mode={'create'}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="space-y-4">
            <FormField
              form={form}
              labelText="Skill Name"
              placeholder="e.g. React, Project Management, Python"
              id="skillName"
              name="fieldData.skillName"
            />

            <ShadcnFormField
              control={form.control}
              name="fieldData.skillProficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground text-[11px] font-black tracking-widest uppercase">
                    Proficiency Level
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-border/40 bg-muted/20 focus:ring-primary/40 h-11 rounded-xl focus:ring-1">
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border/40 rounded-xl shadow-xl">
                      <SelectItem value="Beginner" className="py-3">
                        Beginner
                      </SelectItem>
                      <SelectItem value="Intermediate" className="py-3">
                        Intermediate
                      </SelectItem>
                      <SelectItem value="Advanced" className="py-3">
                        Advanced
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2">
            <SubmitButton
              isLoading={isPending}
              className="h-11 w-full rounded-xl font-bold tracking-tight uppercase shadow-sm"
            >
              Save Skill
            </SubmitButton>
          </div>
        </form>
      </Form>
    </DynamicDialogWithHeaderAction>
  );
};
