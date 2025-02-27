import type { SKRSContext2D, Image } from '@napi-rs/canvas';

import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';
import sharp from 'sharp';

import type { DatumClass, RankedDTO } from '../../types/v2/RankedDTO';
import type { PlayerDTO } from '../../types/v2/PlayerDTO';

const CANVAS_WIDTH = 1_000;
const CANVAS_HEIGHT = 400;
const HORIZONTAL_PADDING = 40;
// const VERTICAL_PADDING = 60;
const TOP_MARGIN = 220;
const BOTTOM_MARGIN = 40;
const GRAPH_WIDTH = CANVAS_WIDTH - HORIZONTAL_PADDING * 2;
const LINE_WIDTH = 5;
const IMAGE_SIZE = 60;
const RANK_IMAGE_SIZE = 200;
// const DATE_FONT_SIZE = 14;
// const DATE_COLOR = '#99aab5';
const FONT_COLOR_WHITE = '#FFFFFF';
const FONT_COLOR_GRAY = '#99aab5';
const GLOW_COLOR = '#FFFFFF';
const FONT_SIZE_LARGE = 40;
const FONT_SIZE_SMALL = 20;

let background: Image | null = null;

export async function generateRankGraph(ranked: RankedDTO['data'], player: PlayerDTO['data']) {
    const rankHistory = ranked.history.data;
    if (!rankHistory.length) {
        return null;
    }

    const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');

    background ??= await loadImage(await Bun.file(join(process.cwd(), 'assets', 'rank', 'background.png')).bytes());
    ctx.drawImage(background, 0, 0);

    // Get last 15 matches for the graph
    const data = rankHistory.slice(0, 15).toReversed();
    const rankLevels = data.map((d) => {
        const datum = d[1];
        return datum.value[1];
    });
    const minLevel = Math.min(...rankLevels);
    const maxLevel = Math.max(...rankLevels);

    const normalizeScore = (level: number) => {
        const normalizedValue = (level - minLevel) / (maxLevel - minLevel);
        const availableHeight = CANVAS_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;
        const startY = CANVAS_HEIGHT - BOTTOM_MARGIN;
        return startY - normalizedValue * availableHeight;
    };

    // Draw current rank
    const currentRank = rankHistory[0][1] as DatumClass | null;
    if (currentRank) {
        const rankText = currentRank.value[0];
        const rankPath = getRankPath(rankText);
        const rankImage = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'ranks', rankPath)).bytes());
        const textWidth = ctx.measureText(rankText).width;
        const spacing = 2;
        const totalWidth = RANK_IMAGE_SIZE + spacing + textWidth;
        const rankX = (CANVAS_WIDTH - totalWidth) / 2;
        const rankY = 50;

        ctx.fillStyle = FONT_COLOR_WHITE;
        ctx.textAlign = 'left';
        ctx.font = `bold ${FONT_SIZE_LARGE}px RefrigeratorDeluxeBold`;


        ctx.drawImage(rankImage, rankX, rankY - 10, RANK_IMAGE_SIZE, RANK_IMAGE_SIZE);
        ctx.fillText(rankText, rankX + RANK_IMAGE_SIZE + spacing, rankY + RANK_IMAGE_SIZE / 2);

        ctx.font = `lighter ${FONT_SIZE_SMALL}px RefrigeratorDeluxeBold`;
        ctx.fillStyle = FONT_COLOR_GRAY;

        const pointsText = `${player.segments[0].stats.ranked?.displayValue ?? 0} RS`;
        const pointsTextWidth = ctx.measureText(pointsText).width;
        const pointsX = rankX + RANK_IMAGE_SIZE + spacing + (textWidth - pointsTextWidth) / 2;
        const pointsY = rankY + RANK_IMAGE_SIZE / 2 + 25;

        ctx.fillText(pointsText, pointsX, pointsY);
    }

    // Draw rank progression
    for (let i = 0; i < data.length; i++) {
        const current = data[i][1];
        const next = data[i + 1]?.[1] as DatumClass | null;
        const fromX = GRAPH_WIDTH / (data.length - 1) * i + HORIZONTAL_PADDING;
        const fromY = normalizeScore(parseFloat(current.value[1].toString()));

        // Draw date marker
        // const date = new Date(data[i][0] as unknown as string);
        // drawDate(ctx, fromX, CANVAS_HEIGHT - VERTICAL_PADDING / 3, date);

        if (!next) {
            continue;
        }

        const toX = GRAPH_WIDTH / (data.length - 1) * (i + 1) + HORIZONTAL_PADDING;
        const toY = normalizeScore(parseFloat(next.value[1].toString()));

        drawCurveLine(ctx, fromX, fromY, toX, toY, current.metadata.color);
        await drawPointWithGlow(ctx, fromX, fromY, getRankPath(current.metadata.name));
    }

    // Draw last point
    const lastRank = data[data.length - 1][1];
    await drawPointWithGlow(
        ctx,
        CANVAS_WIDTH - HORIZONTAL_PADDING,
        normalizeScore(parseFloat(lastRank.value[1].toString())),
        getRankPath(lastRank.metadata.name)
    );

    return canvas.encode('png');
}

// Update drawDate to handle Date objects
// function drawDate(ctx: SKRSContext2D, x: number, y: number, date: Date) {
//     ctx.font = `lighter ${DATE_FONT_SIZE}px RefrigeratorDeluxeBold`;
//     ctx.fillStyle = DATE_COLOR;
//     ctx.textAlign = 'center';

//     const formattedDate = date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric'
//     });

//     ctx.fillText(formattedDate, x, y + 10);
// }
// function drawDate(ctx: SKRSContext2D, x: number, y: number, timestamp: number) {
//     ctx.font = `lighter ${DATE_FONT_SIZE}px RefrigeratorDeluxeBold`;
//     ctx.fillStyle = DATE_COLOR;
//     ctx.textAlign = 'center';

//     const date = new Date(timestamp * 1_000);
//     const formattedDate = date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric'
//     });

//     ctx.fillText(formattedDate, x, y + 10);
// }

function drawCurveLine(ctx: SKRSContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) {
    const controlX = (fromX + toX) / 2;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = LINE_WIDTH;
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(controlX, fromY, toX, toY);
    ctx.stroke();
}

async function drawPointWithGlow(ctx: SKRSContext2D, x: number, y: number, url: string) {
    ctx.shadowColor = GLOW_COLOR;
    ctx.shadowBlur = 15;
    await drawImage(ctx, x, y, url);

    ctx.shadowBlur = 0;
}

async function drawImage(ctx: SKRSContext2D, x: number, y: number, url: string, imageSize = IMAGE_SIZE) {
    const subImageSize = imageSize / 2;
    const bufferImage = await Bun.file(join(process.cwd(), 'assets', 'ranks', url)).bytes();
    const resizedImage = await sharp(bufferImage).resize(imageSize, imageSize).toBuffer();
    const image = await loadImage(resizedImage);
    ctx.drawImage(image, x - subImageSize, y - subImageSize, imageSize, imageSize);
}

function getRankPath(rank: string) {
    if (rank.includes('One Above All')) {
        return 'one_above_all.png';
    }
    const rankName = rank.split(' ')[0].toLowerCase();
    return `${rankName}.png`;
}
