import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';

import { Form } from '@/components/ui/form';
import FormField from '@/components/molecules/FormField';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { signInUserSchema, type TSignInUser } from 'shared';
import { ContinueWithGoogle } from '@/routes/(auth)/-component/ContinueWithGoogle';

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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        {isError && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-[13px] font-medium">
            {error}
          </div>
        )}

        <FormField
          form={form}
          id="identifier"
          name="identifier"
          labelText="Email or username"
          placeholder="name@example.com"
          type="text"
        />

        <div className="space-y-1">
          <FormField
            form={form}
            id="password"
            name="password"
            labelText="Password"
            placeholder="••••••••"
            type="password"
          />
          <div className="flex justify-end">
            <Link to="/">
              <span className="text-muted-foreground hover:text-primary text-[13px] font-medium transition-colors">
                Forgot password?
              </span>
            </Link>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <SubmitButton isLoading={isLoading} className="h-11 text-[15px] font-semibold">
            Sign in
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

export default SignInForm;
