import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';

import type { TGetSearchJob } from 'shared';
import { Route } from '../jobs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export const JobsSearchBar = () => {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [localQ, setLocalQ] = useState(search.q ?? '');
  const [localLocation, setLocalLocation] = useState(search.location ?? '');

  const setParam = (params: Partial<TGetSearchJob>) => {
    navigate({
      search: (prev: any) => ({ ...prev, ...params }),
      replace: true,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setParam({ q: localQ || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [localQ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParam({ location: localLocation || undefined });
    }, 300);
    return () => clearTimeout(timer);
  }, [localLocation]);

  const isActive = !!(search.q || search.location || search.type || search.status);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="relative w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Search by title..."
          value={localQ}
          onChange={e => setLocalQ(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Location"
          value={localLocation}
          onChange={e => setLocalLocation(e.target.value)}
          className="flex-1"
        />

        <Select
          value={search.type ?? 'full-time'}
          onValueChange={val => setParam({ type: (val as TGetSearchJob['type']) || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value=" ">All types</SelectItem> */}
            <SelectItem value="full-time">Full-time</SelectItem>
            <SelectItem value="part-time">Part-time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={search.status ?? 'open'}
          onValueChange={val => setParam({ status: (val as TGetSearchJob['status']) || undefined })}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value=" ">All statuses</SelectItem> */}
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {isActive && (
          <Button
            variant="ghost"
            onClick={() => {
              setLocalQ('');
              setLocalLocation('');
              navigate({
                search: () => ({}),
                replace: true,
              });
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};
