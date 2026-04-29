import { SignInContent } from './-component/SignInContent';
import { requireLogOut } from '@/lib/requireLoggedOut';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/signin')({
  component: RouteComponent,
  loader: requireLogOut,
});

function RouteComponent() {
  return (
    <div className="bg-background selection:bg-primary/20 flex min-h-screen w-full">
      {/* Left Side: Brand Panel */}
      <div className="bg-muted/50 border-border/50 relative hidden w-[45%] flex-col justify-between border-r p-12 lg:flex">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <span className="text-foreground text-xl font-bold tracking-tight underline">DevConnect</span>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-foreground text-4xl leading-[1.1] font-semibold tracking-tight">
            Welcome back to the ecosystem.
          </h2>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            Pick up right where you left off. Connect with peers, update your projects, and explore
            new opportunities.
          </p>
        </div>

        <div className="border-border/50 flex items-center gap-4 border-t pt-8">
          <p className="text-muted-foreground text-sm font-medium italic">
            "The best way to predict the future is to invent it."
          </p>
        </div>
      </div>

      {/* Right Side: Auth Panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-muted-foreground text-[15px]">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <SignInContent />

          <div className="text-muted-foreground text-center text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary font-semibold underline-offset-4 transition-all hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
