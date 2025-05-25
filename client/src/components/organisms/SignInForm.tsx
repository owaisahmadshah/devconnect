import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';

import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { signInUserSchema, type TSignInUser } from 'shared';

interface SignInProps {
  onSubmit: (data: TSignInUser) => Promise<void>;
  isLoading: boolean;
  isError: boolean;
  error: string;
}

const SignInForm = ({ onSubmit, isLoading, isError, error }: SignInProps) => {
  const form = useForm<TSignInUser>({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: zodResolver(signInUserSchema),
  });

  const handleSubmit = async (values: TSignInUser) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 p-6">
        {isError && <p className="text-sm text-red-500">{error}</p>}

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

        <SubmitButton isLoading={isLoading}>Sign In</SubmitButton>
        <Link to="/">
          <span className="text-primary text-sm hover:underline">Forget Password</span>
        </Link>
      </form>
    </Form>
  );
};

export default SignInForm;
