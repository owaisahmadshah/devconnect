import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Shield, Trash2, User } from 'lucide-react';
import type { TOrganizationMemberResponse, TOrganizationMemberRole } from 'shared';

interface TOrganizationMemberRowProps {
  org_member: TOrganizationMemberResponse;
  onRoleChange: (id: string, role: TOrganizationMemberRole) => void;
  onRemove: (id: string) => void;
}

export const OrganizationMemberRow = ({
  org_member,
  onRoleChange,
  onRemove,
}: TOrganizationMemberRowProps) => {
  const { user: member, role } = org_member;

  const initials = (member.firstName + ' ' + member.lastName)
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between border-b py-3 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={member.profilePictureUrl} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{`${member.firstName + '  ' + member.lastName}`}</p>
          {/* <p className="text-muted-foreground truncate text-xs">{role}</p> */}
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-2">
        <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
          {role}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {role === 'member' ? (
              <DropdownMenuItem onClick={() => onRoleChange(member._id, 'admin')}>
                <Shield className="mr-2 h-4 w-4" />
                Make admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onRoleChange(member._id, 'member')}>
                <User className="mr-2 h-4 w-4" />
                Remove admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onRemove(member._id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
