import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, MapPin, SlidersHorizontal, X } from 'lucide-react';

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

  const isActive = !!(search.location || search.type || search.status);

  return (
    <div className="flex w-full flex-col gap-4 pb-4">
      <div className="group border-border/60 bg-card focus-within:border-primary/50 focus-within:ring-primary/5 relative flex w-full flex-col items-center overflow-hidden rounded-2xl border shadow-sm transition-all focus-within:ring-4 sm:flex-row">
        <div className="relative flex flex-1 items-center">
          <Search className="text-muted-foreground group-focus-within:text-primary absolute left-4 size-4 transition-colors" />
          <Input
            placeholder="Job title, keywords, or company"
            value={localQ}
            onChange={e => setLocalQ(e.target.value)}
            className="h-14 border-none bg-transparent pr-4 pl-11 text-[15px] focus-visible:ring-0"
          />
        </div>

        <div className="bg-border/60 hidden h-8 w-px sm:block" />

        <div className="max-sm:border-border/40 relative flex flex-1 items-center max-sm:border-t">
          <MapPin className="text-muted-foreground group-focus-within:text-primary absolute left-4 size-4 transition-colors" />
          <Input
            placeholder="City, state, or remote"
            value={localLocation}
            onChange={e => setLocalLocation(e.target.value)}
            className="h-14 border-none bg-transparent pr-4 pl-11 text-[15px] focus-visible:ring-0"
          />
        </div>

        <div className="p-2 sm:pr-3">
          <Button className="h-10 w-full rounded-xl px-6 font-bold sm:w-auto">Search</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="text-muted-foreground mr-1 flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          <span className="text-xs font-black tracking-widest uppercase">Filters</span>
        </div>

        <Select
          value={search.type ?? 'full-time'}
          onValueChange={val => setParam({ type: (val as TGetSearchJob['type']) || undefined })}
        >
          <SelectTrigger className="border-border/60 bg-card hover:bg-muted h-9 w-auto gap-2 rounded-full px-4 text-xs font-bold transition-all focus:ring-0">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent className="border-border/60 rounded-xl">
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
          <SelectTrigger className="border-border/60 bg-card hover:bg-muted h-9 w-auto gap-2 rounded-full px-4 text-xs font-bold transition-all focus:ring-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-border/60 rounded-xl">
            <SelectItem value="open">Open Positions</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        {isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocalQ('');
              setLocalLocation('');
              navigate({
                search: () => ({}),
                replace: true,
              });
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-9 rounded-full px-4 text-xs font-bold"
          >
            <X className="mr-1.5 size-3" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
