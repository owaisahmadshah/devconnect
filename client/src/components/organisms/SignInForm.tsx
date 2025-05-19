import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';

import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { signInUserSchemaClient, type TSignInUser } from 'shared';

interface SignInProps {
  onSubmit: (data: TSignInUser) => Promise<void>;
  isLoading: boolean;
}

const SignInForm = ({ onSubmit, isLoading }: SignInProps) => {
  const form = useForm<TSignInUser>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: zodResolver(signInUserSchemaClient),
  });

  const handleSubmit = async (values: TSignInUser) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-6">
        <FormField
          form={form}
          id="identifier"
          name="identifier"
          labelText="Email or username"
          placeholder="Email or username"
          type="text"
        />

        <FormField
          form={form}
          id="password"
          name="password"
          labelText="Password"
          placeholder="Enter your password"
          type="password"
        />

        <SubmitButton isLoading={isLoading}>Create Account</SubmitButton>
        <Link to="/">
          <span className="text-primary text-sm hover:underline">Reset Password</span>
        </Link>
      </form>
    </Form>
  );
};

export default SignInForm;
