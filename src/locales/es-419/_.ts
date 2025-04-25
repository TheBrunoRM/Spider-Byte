import type English from '../en-US/_.ts';

import { commands } from './commands.ts';
import { common } from './common.ts';

export default {
    commands,
    common
} satisfies typeof English;
