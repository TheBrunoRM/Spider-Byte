import { config } from 'seyfert';

const BOT_TOKEN = Bun.env.BOT_TOKEN;

if (!BOT_TOKEN?.trim()) {
    throw new Error('Bun.env.BOT_TOKEN is not a valid token');
}

export default config.bot({
    token: BOT_TOKEN,
    locations: {
        base: 'dist',
        commands: 'commands',
        langs: 'locales',
        events: 'events'
    },
    intents: ['GuildMessages']
});
