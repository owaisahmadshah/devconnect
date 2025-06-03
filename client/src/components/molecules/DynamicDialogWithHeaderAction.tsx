import { MdEdit } from 'react-icons/md';
import { FiPlus } from 'react-icons/fi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface DynamicDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  mode?: 'edit' | 'create' | string;
}

export const DynamicDialogWithHeaderAction = ({
  children,
  title,
  description,
  mode = 'create',
}: DynamicDialogProps) => {
  const isModeString = mode !== 'create' && mode !== 'edit';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={isModeString ? 'outline' : 'ghost'}
          size={isModeString ? 'default' : 'icon'}
        >
          {mode === 'create' ? <FiPlus className="h-4 w-4" /> : mode === 'edit' ? <MdEdit /> : mode}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="mt-4"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
