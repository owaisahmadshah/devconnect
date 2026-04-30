import { Link } from '@tanstack/react-router';
import { useRouterState } from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Rocket, LayoutGrid, Plus } from 'lucide-react';

export function ProjectCreatedDialog() {
  const routerState = useRouterState();
  const currentHref = routerState.location.href;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="border-border/40 bg-card max-w-md rounded-[2rem] p-10">
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="bg-primary/10 flex h-20 w-20 items-center justify-center rounded-3xl">
            <CheckCircle2 className="text-primary size-10" />
          </div>

          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-2xl font-black tracking-widest uppercase">
              Deployment Successful
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm font-medium">
              Your project has been successfully indexed and is now visible on your profile hub.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex w-full flex-col gap-3 sm:flex-col">
            <Button
              asChild
              className="shadow-primary/20 h-12 w-full rounded-xl font-black tracking-widest uppercase shadow-lg"
            >
              <Link to="#">
                <Rocket className="mr-2 size-4" />
                View Deployment
              </Link>
            </Button>

            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                asChild
                variant="secondary"
                className="h-12 rounded-xl text-[11px] font-black tracking-widest uppercase"
              >
                <Link to="#">
                  <LayoutGrid className="mr-2 size-3.5" />
                  Portfolio
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-xl text-[11px] font-black tracking-widest uppercase"
              >
                <Link to={currentHref} reloadDocument>
                  <Plus className="mr-2 size-3.5" />
                  New One
                </Link>
              </Button>
            </div>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
