import { MdVerified, MdOpenInNew } from 'react-icons/md';
import { formatDate } from '@/lib/dateUtils';
import { type TCertificationWithId } from 'shared';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Trash2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificationItemProps extends Partial<TCertificationWithId> {
  isCurrentUser: boolean;
  className?: string;
}

export const CertificationItem = ({
  _id,
  title,
  issuer,
  issuedDate,
  credentials,
  credentialsUrl,
  isCurrentUser = false,
  className,
}: CertificationItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'certifications', deleteObjectId: _id as string });
  };

  return (
    <div className={cn('group flex w-full items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 gap-4">
        <div className="border-border/50 bg-muted/30 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border">
          <Award className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
        </div>

        <div className="min-w-0 space-y-1.5">
          <div>
            <h4 className="text-foreground text-[15px] leading-none font-bold tracking-tight uppercase">
              {title}
            </h4>
            <p className="text-muted-foreground mt-1 text-[13px] font-medium">{issuer}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold tracking-wider uppercase">
            <div className="flex items-center gap-1 text-blue-500/80">
              <MdVerified className="size-3.5" />
              <span>Issued {formatDate(issuedDate!)}</span>
            </div>

            {credentials && <span className="text-muted-foreground/60">ID: {credentials}</span>}

            {credentialsUrl && (
              <a
                href={credentialsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 transition-all hover:underline"
              >
                <span>View</span>
                <MdOpenInNew size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {isCurrentUser && (
        <Button
          variant="ghost"
          size="icon"
          onClick={deleteAchievement}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8 transition-colors"
        >
          {isPending ? '...' : <Trash2 size={16} />}
        </Button>
      )}
    </div>
  );
};
