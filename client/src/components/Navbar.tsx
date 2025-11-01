import { Link } from '@tanstack/react-router';
import { MdHome } from 'react-icons/md';
import { IoPeople } from 'react-icons/io5';
import { IoIosBriefcase, IoMdNotifications } from 'react-icons/io';
import { ProfileWithUrl } from './organisms/ProfileWithUrl';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { Button } from './ui/button';
import { IoSearch } from 'react-icons/io5';

function RenderElementWithText({
  text,
  element,
  navigateUrl,
}: {
  text: string;
  element?: React.ReactNode;
  navigateUrl?: string;
}) {
  return (
    <Link
      className="flex flex-col items-center justify-center"
      to={navigateUrl || '/'}
      activeProps={{
        className: 'text-blue-500 font-semibold',
      }}
    >
      <div>{element}</div>
      <h3 className="text-xs">{text}</h3>
    </Link>
  );
}

export function Navbar() {
  const userSummary = useSelector((state: RootState) => state.profileSummary);

  return (
    <nav>
      <ul className="bg-secondary fixed z-1000 flex h-[70px] w-full items-center justify-center gap-8 max-sm:justify-around max-sm:gap-4">
        <li>
          <input
            type="text"
            placeholder="Search"
            className="rounded-2xl border px-3 py-2 text-xs max-sm:hidden min-sm:w-[30vw]"
          />
          <div className="flex flex-col items-center justify-center min-sm:hidden">
            <IoSearch />
            <h3 className="text-xs">Search</h3>
            {/* Hide all the other links(li) and make the input field appear and allow searching, and if searh or back then reset it */}
          </div>
        </li>
        <li>
          <RenderElementWithText element={<MdHome />} text="Home" />
        </li>
        <li>
          <RenderElementWithText element={<IoPeople />} text="Network" navigateUrl="network" />
        </li>
        <li>
          <RenderElementWithText element={<IoIosBriefcase />} text="Jobs" navigateUrl="jobs" />
        </li>
        <li>
          <RenderElementWithText
            element={<IoMdNotifications />}
            text="Notifications"
            navigateUrl="notifications"
          />
        </li>
        <li>
          {userSummary.isLoggedIn && userSummary.user ? (
            <ProfileWithUrl user={userSummary.user} profileSize="s" showName={false} />
          ) : (
            <Button>
              <Link to="/signin">Sign In</Link>
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
}
