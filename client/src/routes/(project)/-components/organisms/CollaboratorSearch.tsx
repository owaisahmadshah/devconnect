import React, { useState } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DismissibleBadge } from '@/components/molecules/DismissibleBadge';
import { cn } from '@/lib/utils';
import { useInfiniteUserSearchByFullName } from '@/hooks/useInfiniteUserSearchByFullName';
import type { TUserProfileSummary } from 'shared';

interface CollaboratorSearchProps {
  form: UseFormReturn<any>;
  collaborators: TUserProfileSummary[];
  onSelect: (user: TUserProfileSummary) => void;
  onDelete: (user: TUserProfileSummary) => void;
}

export const CollaboratorSearch: React.FC<CollaboratorSearchProps> = ({
  form,
  collaborators,
  onSelect,
  onDelete,
}) => {
  const [fullName, setFullName] = useState('');
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteUserSearchByFullName(fullName);

  const currentLoggedInUser = form.watch('createdBy');

  const allProfiles =
    data?.pages
      ?.flatMap(page => page.profiles)
      ?.filter(
        profile =>
          !collaborators.some(
            colUser => colUser._id === profile._id || profile._id === currentLoggedInUser,
          ),
      ) || [];

  const handleUserSelect = (user: TUserProfileSummary) => {
    onSelect(user);
    setIsPopOverOpen(false);
  };

  return (
    <div>
      <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex gap-2">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input placeholder="Search collaborators..." className="pl-10" disabled={isPopOverOpen} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 overflow-y-auto p-0" align="start" side="bottom">
          <Input
            placeholder="Search collaborators..."
            onChange={e => setFullName(e.target.value)}
            value={fullName}
            className="pl-10"
          />
          <ScrollArea
            className={cn('h-80 min-h-2.5 rounded-md', allProfiles.length === 0 && 'h-10')}
          >
            {isLoading ? (
              <div className="max-h-72 p-4 text-center text-sm text-gray-500">Searching...</div>
            ) : allProfiles.length > 0 ? (
              <div className="py-2">
                {allProfiles.map(user => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="bg-card hover:bg-muted flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePictureUrl} />
                      <AvatarFallback>
                        {user.firstName?.[0]}
                        {user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                    </div>
                  </div>
                ))}
                {hasNextPage && (
                  <div className="border-t px-4 py-2">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="w-full text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load more users'}
                    </button>
                  </div>
                )}
              </div>
            ) : fullName ? (
              <div className="p-4 text-center text-sm text-gray-500">No users found</div>
            ) : null}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {collaborators.length > 0 && (
        <div className="mt-2 space-y-2">
          <p className="text-sm font-medium">Selected Collaborators:</p>
          <div className="flex flex-wrap gap-2">
            {collaborators.map(user => (
              <DismissibleBadge
                key={user._id}
                avatar={user.profilePictureUrl}
                avatarFallBack={`${user.firstName?.[0]} ${user.lastName?.[0]}`}
                avatarClasses="h-5 w-5"
                text={`${user.firstName} ${user.lastName}`}
                onRemove={() => onDelete(user)}
                customClasses="rounded"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
