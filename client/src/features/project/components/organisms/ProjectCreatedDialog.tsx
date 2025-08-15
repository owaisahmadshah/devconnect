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

export function ProjectCreatedDialog() {
  const routerState = useRouterState();
  const currentHref = routerState.location.href;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Project Created Successfully</AlertDialogTitle>
          <AlertDialogDescription>What would you like to do next?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <Button>
            <Link to="#">See your project</Link>
          </Button>
          <Button variant="secondary">
            <Link to="#">All projects</Link>
          </Button>
          <Button variant="outline">
            <Link to={currentHref} reloadDocument>
              Add another
            </Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
