import { loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import { MARVELRIVALS_DOMAIN, RIVALSDB_DOMAIN } from '../env';
import { getRank } from '../functions/rank-timeline';

const cdnURL = `${MARVELRIVALS_DOMAIN}/rivals`;

async function loadImageFromCache(
    cacheDir: string,
    id: string | number,
    fetchURL: string
) {
    const path = join(process.cwd(), 'cache', cacheDir, `${id}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(fetchURL);
    if (!response.ok) {
        const placeholderPath = join(process.cwd(), 'assets', 'placeholders', `${cacheDir}.png`);
        const placeholdersFile = Bun.file(placeholderPath);
        if (await placeholdersFile.exists()) {
            return loadImage(placeholderPath);
        }
        throw new Error(`Failed to fetch ${fetchURL}`);
    }
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}

export async function loadUserIcon(iconID: string) {
    return loadImageFromCache(
        'user_icon',
        iconID,
        `${MARVELRIVALS_DOMAIN}/rivals/players/heads/player_head_${iconID}.png`
    );
}

export async function loadHeroHistory(heroID: number) {
    return loadImageFromCache(
        'hero_history',
        heroID,
        `${RIVALSDB_DOMAIN}/images/heroes/${heroID}/story-images/hero-story.png`
    );
}

export async function loadRankIcon(level: number) {
    const { imageURL } = getRank(level);
    return loadImageFromCache(
        'rank_icon',
        level,
        imageURL
    );
}

export async function loadHeroThumbnail(thumbnail: string) {
    return loadImageFromCache(
        'hero_thumbnail',
        thumbnail,
        `${cdnURL}/${thumbnail}`
    );
}

export async function loadHeroSquare(hero_id: number) {
    return loadImageFromCache(
        'hero_square',
        hero_id,
        `${RIVALSDB_DOMAIN}/images/heroes/${hero_id}/base/square.png`
    );
}
