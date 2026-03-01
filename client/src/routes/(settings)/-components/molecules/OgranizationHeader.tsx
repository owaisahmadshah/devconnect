import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface IOrganizationHeaderProps {
  name: string;
  logo: string;
  action?: () => void;
}

export const OrganizationHeader = (props: IOrganizationHeaderProps) => {
  const { name, logo, action } = props;
  return (
    <nav>
      <ul className="flex items-center justify-between">
        <li>
          <Avatar className={'h-12 w-12 max-sm:h-8 max-sm:w-8'}>
            <AvatarImage src={logo} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </li>
        <li>
          <h1 className="text-xl font-bold">{name}</h1>
        </li>
        <li>
          <Button onClick={action}>Follow</Button>
        </li>
      </ul>
    </nav>
  );
};
