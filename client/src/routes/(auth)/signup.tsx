import { SignUpContent } from './-component/SignUpContent';
import { requireLogOut } from '@/lib/requireLoggedOut';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/(auth)/signup')({
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
            <span className="text-foreground text-xl font-bold tracking-tight underline">
              DevConnect
            </span>
          </Link>
        </div>

        <div className="space-y-6">
          <h2 className="text-foreground text-4xl leading-[1.1] font-semibold tracking-tight">
            The professional space for the next generation of builders.
          </h2>
          <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
            Manage your developer identity, showcase your source code, and find your next big
            opportunity in one unified platform.
          </p>
        </div>

        <div className="border-border/50 flex items-center gap-4 border-t pt-8">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="border-muted bg-accent h-10 w-10 rounded-full border-2" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm font-medium">
            Joined by 10,000+ developers worldwide
          </p>
        </div>
      </div>

      {/* Right Side: Auth Panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">Get started</h1>
            <p className="text-muted-foreground text-[15px]">
              Enter your details below to create your professional profile.
            </p>
          </div>

          <SignUpContent />

          <div className="text-muted-foreground text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-primary font-semibold underline-offset-4 transition-all hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
