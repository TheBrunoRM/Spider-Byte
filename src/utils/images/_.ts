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
        console.log(`Failed to fetch ${fetchURL}`);
        const placeholdersPath = join(process.cwd(), 'assets', 'placeholders', `${id}.png`);
        const placeholdersFile = Bun.file(placeholdersPath);
        if (await placeholdersFile.exists()) {
            return loadImage(placeholdersPath);
        }
        return;
    }
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}

export async function loadIcon(iconID: string) {
    return loadImageFromCache(
        'user_icon',
        iconID,
        `${MARVELRIVALS_DOMAIN}/rivals/players/heads/player_head_${iconID}.png`
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
