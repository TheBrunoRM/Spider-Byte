import type { SKRSContext2D } from '@napi-rs/canvas';

import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';
import sharp from 'sharp';

import type { RankHistory, PlayerDTO } from '../../types/dtos/PlayerDTO';

import { getRank } from '../functions/rank-timeline';

const CANVAS_WIDTH = 1_000;
const CANVAS_HEIGHT = 400;
const RANK_IMAGE_SIZE = 200;
const IMAGE_SIZE = 60;
const FONT_SIZE_LARGE = 40;
const FONT_SIZE_SMALL = 20;
const FONT_COLOR_WHITE = 'white';
const FONT_COLOR_GRAY = '#C9C9C9';
const LINE_WIDTH = 5;
const PADDING = 20;

export async function generateRankGraph(data: RankHistory[], player: PlayerDTO) {
    data = data.toReversed().slice(0, 15);

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    const background = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'spider_background.png')).bytes());
    ctx.drawImage(background, 0, 0);

    const scores = data.map((d) => d.score_progression.total_score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const normalizeScore = (score: number) => (score - minScore) / (maxScore - minScore) * (CANVAS_HEIGHT / 2 - PADDING);

    // Draw rank information
    const currentRank = player.player.rank;
    const score = player.rank_history.at(-1)?.score_progression.total_score.toFixed(0);
    const rankImage = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'ranks', `${currentRank.image.split('/').at(-1)}`)).bytes());
    const rankText = currentRank.rank;

    ctx.fillStyle = FONT_COLOR_WHITE;
    ctx.textAlign = 'left';
    ctx.font = `bold ${FONT_SIZE_LARGE}px RefrigeratorDeluxeBold`;

    const textWidth = ctx.measureText(rankText).width;
    const spacing = 2;
    const totalWidth = RANK_IMAGE_SIZE + spacing + textWidth;
    const rankX = (CANVAS_WIDTH - totalWidth) / 2;
    const rankY = 50;

    ctx.drawImage(rankImage, rankX, rankY - 10, RANK_IMAGE_SIZE, RANK_IMAGE_SIZE);
    ctx.fillText(rankText, rankX + RANK_IMAGE_SIZE + spacing, rankY + RANK_IMAGE_SIZE / 2);

    ctx.font = `${FONT_SIZE_SMALL}px RefrigeratorDeluxe`;
    ctx.fillStyle = FONT_COLOR_GRAY;
    const pointsText = `${score} RP`;
    const pointsTextWidth = ctx.measureText(pointsText).width;
    const pointsX = rankX + RANK_IMAGE_SIZE + spacing + (textWidth - pointsTextWidth) / 2;
    const pointsY = rankY + RANK_IMAGE_SIZE / 2 + 25;

    ctx.fillText(pointsText, pointsX, pointsY);

    // Draw rank progression lines and images
    for (let i = 0; i < data.length; i++) {
        const before = data.at(i - 1);
        const actual = data[i];
        const next = data.at(i + 1);

        const fromX = CANVAS_WIDTH / data.length * i + PADDING;
        const fromY = CANVAS_HEIGHT - normalizeScore(actual.score_progression.total_score) - PADDING;

        if (!next) {
            if (!before) {
                continue;
            }

            const toX = CANVAS_WIDTH - 50 / data.length * (i + 1) + PADDING;
            const toY = CANVAS_HEIGHT - normalizeScore(before.score_progression.total_score) - PADDING;

            drawLine(ctx, fromX, fromY, toX, toY, getRank(actual.level_progression.from).color);
            await drawImage(ctx, fromX, fromY, getRank(actual.level_progression.from).image);
            await drawImage(ctx, toX, toY, getRank(actual.level_progression.to).image);
            continue;
        }

        const toX = CANVAS_WIDTH / data.length * (i + 1) + PADDING;
        const toY = CANVAS_HEIGHT - normalizeScore(next.score_progression.total_score) - PADDING;

        drawLine(ctx, fromX, fromY, toX, toY, getRank(actual.level_progression.from).color);
        await drawImage(ctx, fromX, fromY, getRank(actual.level_progression.from).image);
    }

    return canvas.encode('png');
}

function drawLine(ctx: SKRSContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}

async function drawImage(ctx: SKRSContext2D, x: number, y: number, url: string, imageSize = IMAGE_SIZE) {
    const subImageSize = imageSize / 2;
    const bufferImage = await Bun.file(join(process.cwd(), 'assets', 'ranks', url)).bytes();
    const resizedImage = await sharp(bufferImage).resize(imageSize, imageSize).toBuffer();
    const image = await loadImage(resizedImage);
    ctx.drawImage(image, x - subImageSize, y - subImageSize, imageSize, imageSize);
}
