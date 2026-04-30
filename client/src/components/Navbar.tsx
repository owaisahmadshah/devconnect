import { Link } from '@tanstack/react-router';
import { Home, Users, Briefcase, Bell, Search, X } from 'lucide-react';
import { ProfileWithUrl } from './organisms/ProfileWithUrl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Button } from './ui/button';
import { useState } from 'react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  text: string;
  icon: React.ElementType;
  navigateUrl?: string;
}

function NavLink({ text, icon: Icon, navigateUrl = '/' }: NavLinkProps) {
  return (
    <Link
      to={navigateUrl}
      className="group relative flex h-[70px] flex-col items-center justify-center gap-1 px-4 transition-colors"
      activeProps={{
        className: 'text-foreground',
      }}
      inactiveProps={{
        className: 'text-muted-foreground hover:text-foreground',
      }}
    >
      <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110 group-[.text-foreground]:fill-current/10" />
      <span className="text-[10px] font-bold tracking-wider uppercase">{text}</span>

      {/* Premium Active Indicator */}
      <span className="bg-primary absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transition-transform duration-300 group-[.text-foreground]:scale-x-100" />
    </Link>
  );
}

export function Navbar() {
  const userSummary = useSelector((state: RootState) => state.profileSummary);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="border-border/40 bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[70px] items-center justify-between gap-8">
          {/* Logo & Search Area */}
          <div className="flex flex-1 items-center gap-4">
            <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
              <div className="bg-primary shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-lg shadow-lg">
                <span className="text-primary-foreground text-xl font-black">D</span>
              </div>
            </Link>

            <div
              className={cn(
                'max-sm:bg-background relative flex flex-1 items-center transition-all duration-300 max-sm:absolute max-sm:inset-x-0 max-sm:top-0 max-sm:h-[70px] max-sm:px-4',
                isSearchOpen ? 'max-sm:flex' : 'max-sm:hidden',
              )}
            >
              <Search className="text-muted-foreground absolute left-3 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for developers, jobs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-muted/50 ring-offset-background focus-visible:bg-background focus-visible:ring-primary/20 h-10 w-full max-w-[320px] border-none pl-10 transition-all focus-visible:ring-2"
                autoFocus={isSearchOpen}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 shrink-0 sm:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <div className={cn('flex items-center', isSearchOpen ? 'max-sm:hidden' : 'flex')}>
            <ul className="flex items-center">
              {/* Mobile Search Toggle */}
              <li className="sm:hidden">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-muted-foreground flex h-[70px] flex-col items-center justify-center px-4"
                >
                  <Search className="h-5 w-5" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Search</span>
                </button>
              </li>

              <NavLink icon={Home} text="Home" navigateUrl="/" />
              <NavLink icon={Users} text="Network" navigateUrl="/network" />
              <NavLink icon={Briefcase} text="Jobs" navigateUrl="/jobs" />
              <NavLink icon={Bell} text="Inbox" navigateUrl="/notifications" />
            </ul>

            <div className="border-border/50 ml-4 flex items-center border-l pl-6">
              {userSummary.isLoggedIn && userSummary.user ? (
                <Link
                  to="/profile/$identifier"
                  params={{ identifier: userSummary.user.profileUrls[0].url }}
                  className="group flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
                >
                  <div className="relative">
                    <ProfileWithUrl user={userSummary.user} profileSize="s" showName={false} />
                    <div className="border-background absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-green-500" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground text-[10px] font-bold tracking-wider uppercase max-sm:hidden">
                    Me
                  </span>
                </Link>
              ) : (
                <Button size="sm" className="rounded-full px-6 font-bold" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
