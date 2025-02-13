import type { commands as English } from '../en-US/_commands.ts';

const commands = {
    ping: {
        content: (latency) => `Latencia: ${latency}`
    },
    middlewares: {
        cooldown: {
            error: {
                content: (remaining) => `:clock1: Estás en enfriamiento. Por favor espera ${remaining} antes de usar este comando de nuevo.`
            }
        }
    }
} satisfies typeof English;

export { commands };
