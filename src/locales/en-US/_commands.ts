export const commands = {
    middlewares: {
        cooldown: {
            error: {
                content: (remaining: string) => `:clock1: You are on cooldown. Please wait ${remaining} before using this command again.`
            }
        }
    },
    ping: {
        content: (latency: number) => `Ping: ${latency}`
    }
};
