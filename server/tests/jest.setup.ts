process.env.DOTENV_CONFIG_QUIET = 'true';

import dotenv from 'dotenv';

dotenv.config({
  path: '.env.test',
});
