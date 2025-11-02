import { Link } from '@tanstack/react-router';
import { MdHome } from 'react-icons/md';
import { IoPeople } from 'react-icons/io5';
import { IoIosBriefcase, IoMdNotifications } from 'react-icons/io';
import { ProfileWithUrl } from './organisms/ProfileWithUrl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Button } from './ui/button';
import { IoSearch, IoClose } from 'react-icons/io5';
import { useState } from 'react';
import { Input } from './ui/input';

interface NavLinkProps {
  text: string;
  icon: React.ReactNode;
  navigateUrl?: string;
}

function NavLink({ text, icon, navigateUrl = '/' }: NavLinkProps) {
  return (
    <Link
      to={navigateUrl}
      className="group hover:bg-accent relative flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200"
      activeProps={{
        className: 'text-primary',
      }}
      inactiveProps={{
        className: 'text-muted-foreground hover:text-foreground',
      }}
    >
      <div className="text-2xl transition-transform duration-200 group-hover:scale-110">{icon}</div>
      <span className="text-[11px] font-medium">{text}</span>
      {/* Active indicator */}
      <span className="bg-primary absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full transition-all duration-200 group-[.text-primary]:w-3/4" />
    </Link>
  );
}

export function Navbar() {
  const userSummary = useSelector((state: RootState) => state.profileSummary);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <nav className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur">
      <div className="mx-auto max-w-7xl">
        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="bg-background absolute inset-x-0 top-0 p-4 shadow-lg min-sm:hidden">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <IoSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pr-4 pl-10"
                  autoFocus
                />
              </div>
              <Button variant="ghost" size="icon" onClick={handleSearchToggle} className="shrink-0">
                <IoClose className="text-xl" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Navbar */}
        <ul
          className={`flex h-[70px] items-center justify-between px-4 sm:px-6 ${isSearchOpen ? 'max-sm:hidden' : ''}`}
        >
          {/* Desktop Search */}
          <li className="max-w-md flex-1 max-sm:hidden">
            <div className="relative">
              <IoSearch className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-accent/50 focus:bg-background focus:border-border w-full border-transparent pr-4 pl-10 transition-colors"
              />
            </div>
          </li>

          {/* Navigation Links */}
          <li className="flex flex-1 items-center justify-center gap-1 sm:flex-initial sm:gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={handleSearchToggle}
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200 min-sm:hidden"
            >
              <IoSearch className="text-2xl" />
              <span className="text-[11px] font-medium">Search</span>
            </button>

            <NavLink icon={<MdHome />} text="Home" navigateUrl="/" />
            <NavLink icon={<IoPeople />} text="Network" navigateUrl="/network" />
            <NavLink icon={<IoIosBriefcase />} text="Jobs" navigateUrl="/jobs" />
            <NavLink
              icon={<IoMdNotifications />}
              text="Notifications"
              navigateUrl="/notifications"
            />
          </li>

          {/* Profile / Sign In */}
          <li className="flex flex-1 items-center justify-end sm:flex-initial">
            {userSummary.isLoggedIn && userSummary.user ? (
              <div className="hover:bg-accent flex items-center gap-2 rounded-lg px-2 py-1 transition-colors">
                <ProfileWithUrl user={userSummary.user} profileSize="s" showName={false} />
                <span className="text-muted-foreground text-[11px] font-medium max-sm:hidden">
                  Me
                </span>
              </div>
            ) : (
              <Button size="sm" asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
