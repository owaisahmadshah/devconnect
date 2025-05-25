import { redirect } from '@tanstack/react-router';
import type { MyRouterContext } from '@/lib/router-context';

export const requireLogOut = async ({ context }: { context: MyRouterContext }) => {
  const { authentication } = context;
  if (authentication.isLoggedIn() && !authentication.isLoading) {
    throw redirect({ to: '/' });
  }
};
