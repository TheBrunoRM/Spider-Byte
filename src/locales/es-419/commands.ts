import type { commands as English } from '../en-US/commands.ts';

const commands = {
    ping: {
        content: (latency) => `Latencia: ${latency}`
    },
    middlewares: {
        cooldown: {
            error: {
                user: (remaining) => `:clock1: Estás en enfriamiento para este comando. Por favor, espera ${remaining} antes de usar este comando nuevamente.`,
                channel: (remaining) => `:clock1: Este canal está en enfriamiento para este comando. Por favor, espera ${remaining} antes de usar este comando nuevamente.`
            }
        }
    }
} satisfies typeof English;

export { commands };
