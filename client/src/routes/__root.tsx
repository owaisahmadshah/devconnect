import NotFoundPage from '@/components/NotFound';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import type { MyRouterContext } from '@/lib/router-context';
import { Navbar } from '@/components/Navbar';
import { useRouterState } from '@tanstack/react-router';
import { useSSE } from '@/hooks/useSSE';

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  const router = useRouterState();
  const path = router.location.pathname;

  const noNavbarPaths = ['/devconnect/signin', '/devconnect/signup', '/devconnect/project/new', '/devconnect/post/new'];
  const hideNavbar = noNavbarPaths.some(p => path.startsWith(p));

  // TODO: Move it to _authenticated
  useSSE();

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? '' : 'pt-[70px]'}>
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
