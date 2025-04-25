import type { common as commonDefault } from '../en-US/common';

export const common = {
    date(dd, mm, yyyy) {
        return `${dd}/${mm}/${yyyy}`;
    }
} satisfies typeof commonDefault;
