import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';

export const ConnectGithub = () => {
  const handleConnectGithub = async () => {
    window.location.href = 'http://localhost:3000/api/v1/github/connect';
  };

  return (
    <Button onClick={handleConnectGithub} variant={'secondary'}>
      <FaGithub /> Connect Github
    </Button>
  );
};
