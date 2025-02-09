import { type SKRSContext2D, GlobalFonts, type Image } from '@napi-rs/canvas';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';
import sharp from 'sharp';

import type { RankHistory, PlayerDTO } from '../../types/dtos/PlayerDTO';

import { getRank } from '../functions/rank-timeline';

GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'MarvelRegular-Dj83.ttf'), 'MarvelRegular');

export async function generateRankGraph(data: RankHistory[], player: PlayerDTO) {
    data.reverse();
    const canvas = createCanvas(1_000, 400);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'spider_background.png')).bytes());

    ctx.drawImage(background, 0, 0);
    const minScore = Math.min(...data.map((d) => d.score_progression.total_score));
    const maxScore = Math.max(...data.map((d) => d.score_progression.total_score));
    const normalizeScore = (score: number) => (score - minScore) / (maxScore - minScore) * (canvas.height / 2 - 40);

    const currentRank = player.player.rank;
    const score = player.rank_history.at(-1)?.score_progression.total_score.toFixed(0);
    const rankImage = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'ranks', `${currentRank.image.split('/').at(-1)}`)).bytes());
    const rankImageSize = 200;
    const rankText = currentRank.rank;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = 'bold 40px Arial';


    const textWidth = ctx.measureText(rankText).width;

    const spacing = 2;

    const totalWidth = rankImageSize + spacing + textWidth;

    const rankX = (canvas.width - totalWidth) / 2;
    const rankY = 50;

    ctx.drawImage(rankImage, rankX, rankY - 10, rankImageSize, rankImageSize);

    ctx.fillText(rankText, rankX + rankImageSize + spacing, rankY + rankImageSize / 2);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#C9C9C9';
    const pointsText = `${score} RP`;

    const pointsTextWidth = ctx.measureText(pointsText).width;

    const pointsX = rankX + rankImageSize + spacing + (textWidth - pointsTextWidth) / 2;

    const pointsY = rankY + rankImageSize / 2 + 25;

    ctx.fillText(pointsText, pointsX, pointsY);

    for (let i = 0; i < data.length; i++) {
        const before = data.at(i - 1);
        const actual = data[i];
        const next = data.at(i + 1);

        const fromX = canvas.width / data.length * i + 25;
        const fromY = canvas.height - normalizeScore(actual.score_progression.total_score) - 20; // Subtract 20 for padding

        if (!next) {
            if (!before) {
                continue;
            }
            const toX = canvas.width - 50 / data.length * (i + 1) + 25;
            const toY = canvas.height - normalizeScore(before.score_progression.total_score + before.score_progression.add_score) - 20;

            // Draw the line
            ctx.beginPath();
            ctx.strokeStyle = getRank(actual.level_progression.from).color;
            ctx.lineWidth = 5;
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            await drawImage(ctx, fromX, fromY, getRank(actual.level_progression.from).image);
            await drawImage(ctx, toX, toY, getRank(actual.level_progression.to).image);
            continue;
        }

        const toX = canvas.width / data.length * (i + 1) + 25;
        const toY = canvas.height - normalizeScore(next.score_progression.total_score) - 20;

        ctx.beginPath();
        ctx.strokeStyle = getRank(actual.level_progression.from).color;
        ctx.lineWidth = 5;
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        await drawImage(ctx, fromX, fromY, getRank(actual.level_progression.from).image);
    }

    return canvas.encode('png');
}

async function drawImage(ctx: SKRSContext2D, x: number, y: number, url: string, imageSize = 60) {
    // const imageSize = 60;
    const subImageSize = imageSize / 2;
    let image: Image;
    if (!url.startsWith('http')) {
        image = await loadImage(url);
        ctx.drawImage(image, x - subImageSize, y - subImageSize, imageSize, imageSize);
        return;
    }
    const path = join(process.cwd(), 'cache', url.split('/').at(-1)!);
    const file = Bun.file(path);
    if (await file.exists()) {
        image = await loadImage(path);
    } else {
        const buffer = await (await fetch(url)).arrayBuffer();
        const resizedImage = await sharp(buffer).resize(imageSize, imageSize).toBuffer();
        image = await loadImage(resizedImage);
        await Bun.write(path, buffer);
    }
    ctx.drawImage(image, x - subImageSize, y - subImageSize, imageSize, imageSize);
}
