import { loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import { getRank } from '../functions/rank-timeline';

const cdnURL = `${Bun.env.MARVELRIVALS!}/rivals`;

export async function loadIcon(iconID: string) {
    const path = join(process.cwd(), 'cache', 'user_icon', `${iconID}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(`https://marvelrivalsapi.com/rivals/players/heads/player_head_${iconID}.png`);
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
    const path = join(process.cwd(), 'cache', 'rank_icon', `${thumbnail}.png`);
    const file = Bun.file(path);
    if (await file.exists()) {
        return loadImage(path);
    }
    const response = await fetch(`${cdnURL}/${thumbnail}`);
    const bytes = await response.bytes();
    await Bun.write(path, bytes);
    return loadImage(path);
}
