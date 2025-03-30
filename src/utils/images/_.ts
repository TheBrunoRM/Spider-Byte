import { loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import { MARVELRIVALS_DOMAIN, RIVALSDB_DOMAIN } from '../env';
import { getRank } from '../functions/rank-timeline';

const cdnURL = `${MARVELRIVALS_DOMAIN}/rivals`;

export async function loadIcon(iconID: string) {
    const path = join(process.cwd(), 'cache', 'user_icon', `${iconID}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(`${MARVELRIVALS_DOMAIN}/rivals/players/heads/player_head_${iconID}.png`);
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}

export async function loadRankIcon(level: number) {
    const path = join(process.cwd(), 'cache', 'rank_icon', `${level}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const { imageURL } = getRank(level);
    const response = await fetch(imageURL);
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}

export async function loadHeroThumbnail(thumbnail: string) {
    const path = join(process.cwd(), 'cache', 'hero_thumbnail', `${thumbnail}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(`${cdnURL}/${thumbnail}`);
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}

export async function loadHeroSquare(hero_id: number) {
    const path = join(process.cwd(), 'cache', 'hero_square', `${hero_id}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(`${RIVALSDB_DOMAIN}/images/heroes/${hero_id}/base/square.png`);
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}
