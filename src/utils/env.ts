const API_KEY = Bun.env.API_KEY?.split(',') ?? [];

if (!API_KEY.length) {
    throw new Error('Bun.env.API_KEY is not a valid api key');
}

const TRACKER_DOMAIN = Bun.env.TRACKER!;

if (!TRACKER_DOMAIN) {
    throw new Error('TRACKER is not defined');
}

const MARVELRIVALS_DOMAIN = Bun.env.MARVELRIVALS!;

if (!MARVELRIVALS_DOMAIN) {
    throw new Error('MARVELRIVALS is not defined');
}

const RIVALSDB_DOMAIN = Bun.env.RIVALSDB!;

if (!RIVALSDB_DOMAIN) {
    throw new Error('RIVALSDB is not defined');
}

const STICKY_API_DOMAIN = Bun.env.STICKY_API!;

if (!STICKY_API_DOMAIN) {
    throw new Error('STICKY_API is not defined');
}

const WEBHOOK_ID = Bun.env.WEBHOOK_ID!;

if (!WEBHOOK_ID) {
    throw new Error('WEBHOOK_ID is not defined');
}

const WEBHOOK_TOKEN = Bun.env.WEBHOOK_TOKEN!;

if (!WEBHOOK_TOKEN) {
    throw new Error('WEBHOOK_TOKEN is not defined');
}

const TOPGG_TOKEN = Bun.env.TOPGG_TOKEN!;

if (!TOPGG_TOKEN) {
    throw new Error('TOPGG_TOKEN is not defined');
}

export { MARVELRIVALS_DOMAIN, STICKY_API_DOMAIN, RIVALSDB_DOMAIN, TRACKER_DOMAIN, WEBHOOK_TOKEN, TOPGG_TOKEN, WEBHOOK_ID, API_KEY };
