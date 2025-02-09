import { config } from 'seyfert';

const BOT_TOKEN = Bun.env.BOT_TOKEN;

if (!BOT_TOKEN?.trim()) {
    throw new Error('Bun.env.BOT_TOKEN is not a valid token');
}

const API_KEY = Bun.env.API_KEY?.split(',');

if (!API_KEY?.length) {
    throw new Error('Bun.env.API_KEY is not a valid api key');
}

export default config.bot({
    token: BOT_TOKEN,
    locations: {
        base: 'dist',
        commands: 'commands',
        langs: 'locales'
    },
    apiKeys: API_KEY
});
