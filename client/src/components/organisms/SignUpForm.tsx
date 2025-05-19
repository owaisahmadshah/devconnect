import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { authUserSchemaClient, type TAuthUserClient } from 'shared';
import { RadioFormField } from '../molecules/RadioFormField';

interface SignInProps {
  onSubmit: (data: TAuthUserClient) => Promise<void>;
  isLoading: boolean;
}

const SignUpForm = ({ onSubmit, isLoading }: SignInProps) => {
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
    console.log(values);
    await onSubmit(values);
  };

  console.log(form.formState.errors);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-6">
        <FormField
          form={form}
          id="firstName"
          name="firstName"
          labelText="First name"
          placeholder="Enter your first name"
          type="text"
        />

        <FormField
          form={form}
          id="lastName"
          name="lastName"
          labelText="Last name"
          placeholder="Enter your last name"
          type="text"
        />

        <FormField
          form={form}
          id="username"
          name="username"
          labelText="Username"
          placeholder="Enter username"
          type="text"
        />

        <FormField
          form={form}
          id="email"
          name="email"
          labelText="Email"
          placeholder="Enter your email"
          type="email"
        />

        <RadioFormField
          form={form}
          name="role"
          label="Role"
          options={[
            { label: 'Developer', value: 'developer' },
            { label: 'Recruiter', value: 'recruiter' },
          ]}
        />

        <FormField
          form={form}
          id="password"
          name="password"
          labelText="Password"
          placeholder="Enter your password"
          type="password"
        />

        <FormField
          form={form}
          id="confirmPassword"
          name="confirmPassword"
          labelText="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
        />

        <SubmitButton isLoading={isLoading}>Create Account</SubmitButton>
      </form>
    </Form>
  );
};

export default SignUpForm;
