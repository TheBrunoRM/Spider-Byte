import type { Image } from '@napi-rs/canvas';

import { type SKRSContext2D, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import { getRankDetails } from '../functions/rank-utils';
import { STICKY_CDN_DOMAIN } from '../env';

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

export function loadUserIcon(iconID: string) {
    return loadImageFromCache(
        'user_icon',
        iconID,
        `${STICKY_CDN_DOMAIN}/Content/Marvel/UI/Textures/Show/PlayerHead/img_playerhead_${iconID}.png`
    );
}

export function loadHeroHistory(heroID: number) {
    return loadImageFromCache(
        'hero_history',
        heroID,
        `${STICKY_CDN_DOMAIN}/heroes/history/${heroID}.png`
    );
}

export function loadRankIcon(level: number) {
    const { image, rank } = getRankDetails(level);
    return loadImageFromCache(
        'rank_icon',
        rank,
        image
    );
}

export function loadHeroSquare(hero_id: number) {
    return loadImageFromCache(
        'hero_square',
        hero_id,
        `${STICKY_CDN_DOMAIN}/heroes/transformations/${hero_id}/0.png`
    );
}

export function drawCircularImage(ctx: SKRSContext2D, image: Image, x: number, y: number, width: number, height: number, radius = Math.min(width, height) / 2) {
    ctx.save();
    ctx.beginPath();
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
}
