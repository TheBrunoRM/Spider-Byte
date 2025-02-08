import type { commands as English } from '../en-US/_commands.ts';

const commands = {
    ping: {
        content: (latency) => `Latencia: ${latency}`
    }
} satisfies typeof English;

export { commands };
