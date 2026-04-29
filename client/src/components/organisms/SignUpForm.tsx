import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { authUserSchemaClient, type TAuthUserClient } from 'shared';
import { RadioFormField } from '../molecules/RadioFormField';
import { toast } from 'sonner';
import { ContinueWithGoogle } from '@/routes/(auth)/-component/ContinueWithGoogle';

interface SignInProps {
  onSubmit: (data: TAuthUserClient) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const SignUpForm = ({ onSubmit, isLoading, error }: SignInProps) => {
  const form = useForm<TAuthUserClient>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      role: 'developer',
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(authUserSchemaClient),
    mode: 'onSubmit',
  });

  const handleSubmit = async (values: TAuthUserClient) => {
    await onSubmit(values);
  };

  useEffect(() => {
    if (!error) {
      return;
    }
    toast.error(error);
  }, [error]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            form={form}
            id="firstName"
            name="firstName"
            labelText="First name"
            placeholder="Jane"
            type="text"
          />
          <FormField
            form={form}
            id="lastName"
            name="lastName"
            labelText="Last name"
            placeholder="Smith"
            type="text"
          />
        </div>

        <FormField
          form={form}
          id="username"
          name="username"
          labelText="Username"
          placeholder="janesmith"
          type="text"
        />

        <FormField
          form={form}
          id="email"
          name="email"
          labelText="Work email"
          placeholder="jane@company.com"
          type="email"
        />

        <div className="py-1">
          <RadioFormField
            form={form}
            name="role"
            label="I am joining as a"
            options={[
              { label: 'Developer', value: 'developer' },
              { label: 'Recruiter', value: 'recruiter' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            form={form}
            id="password"
            name="password"
            labelText="Password"
            placeholder="••••••••"
            type="password"
          />

          <FormField
            form={form}
            id="confirmPassword"
            name="confirmPassword"
            labelText="Confirm"
            placeholder="••••••••"
            type="password"
          />
        </div>

        <div className="space-y-4 pt-4">
          <SubmitButton isLoading={isLoading} className="h-11 w-full text-[15px] font-semibold">
            Create account
          </SubmitButton>

          <div className="relative flex items-center py-2">
            <div className="border-border flex-grow border-t"></div>
            <span className="text-muted-foreground/60 mx-4 flex-shrink text-[12px] font-medium tracking-wider uppercase">
              OR
            </span>
            <div className="border-border flex-grow border-t"></div>
          </div>

          <ContinueWithGoogle />
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
