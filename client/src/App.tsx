import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store/store';
import { useAuth } from './hooks/useAuth';
import { useSyncUserToRedux } from './hooks/useSyncUserToRedux';
import { shouldRetry } from './lib/shouldRetry';
import { Suspense } from 'react';
import { HomeScreenSkeleton } from './components/HomeScreenSkeleton';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // five minutes
      retry: shouldRetry, // false if 400 <= statusCode < 500
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchInterval: false, // Don't poll automatically (set to number for polling)
    },
    mutations: {
      retry: 1,
    },
  },
});

// Move router creation **below** InnerApp, since useAuth() is a hook!
let router: ReturnType<typeof createRouter>; // declare outside

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const { isLoading } = useSyncUserToRedux();
  const authentication = useAuth();

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  router = createRouter({
    routeTree,
    context: {
      queryClient,
      authentication,
    },
  });

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} context={{ authentication }} />
      <Toaster />
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        <Suspense fallback={<HomeScreenSkeleton />}>
          <InnerApp />
        </Suspense>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default App;
