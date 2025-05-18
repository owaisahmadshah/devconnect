import { Link } from '@tanstack/react-router';

export default function NotFoundPage() {
  return (
    <div className="bg-background text-foreground animate-fade-in flex h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-primary mb-4 text-6xl font-bold tracking-tight">404</h1>
      <p className="mb-6 text-xl font-medium">Oops! The page you're looking for doesn't exist.</p>

      <Link
        to="/"
        className="border-border bg-card text-card-foreground hover:bg-muted hover:text-muted-foreground inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-base font-semibold transition-colors"
      >
        ← Go back home
      </Link>
    </div>
  );
}
