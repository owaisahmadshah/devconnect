import { Link } from '@tanstack/react-router';

interface INetworkNavbarProps {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

export const NetworkNavbar = ({ title, links }: INetworkNavbarProps) => {
  return (
    <nav className="flex w-[80%] items-center justify-between rounded-xl border border-border bg-card px-8 py-4 shadow-sm transition-shadow hover:shadow-md">
      <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
      <ul className="flex items-center gap-8">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              to={link.url}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};