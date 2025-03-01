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

export { MARVELRIVALS_DOMAIN, TRACKER_DOMAIN, RIVALSDB_DOMAIN, API_KEY };
