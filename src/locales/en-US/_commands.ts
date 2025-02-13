export const commands = {
    middlewares: {
        cooldown: {
            error: {
                user: (remaining: string) => `:clock1: You are on cooldown for this command. Please wait ${remaining} before using this command again.`,
                channel: (remaining: string) => `:clock1: This channel is on cooldown for this command. Please wait ${remaining} before using this command again.`
            }
        }
    },
    ping: {
        content: (latency: number) => `Ping: ${latency}`
    }
};
