import { loadImage, Canvas } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { RankHistoryDataPoint } from '../functions/rank-utils';
// import fetch from 'node-fetch';


export async function generateRankChart(data: RankHistoryDataPoint[]): Promise<Buffer> {
    const WIDTH = 2_560;
    const HEIGHT = 1_440;
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const MARGIN = {
        top: 720,
        right: 220,
        bottom: 90,
        left: 220
    };
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    // Procesar datos
    const dates = data.map((d) => new Date(d.realDate));
    const scores = data.map((d) => d.score);

    // Escalas
    const xScale = (date: Date) => {
        const minTime = dates[0].getTime();
        const maxTime = dates[dates.length - 1].getTime();
        if (data.length === 1 || maxTime === minTime) {
            return MARGIN.left + chartWidth / 2; // Center the point
        }
        return MARGIN.left + (date.getTime() - minTime) / (maxTime - minTime) * chartWidth;
    };

    const yScale = (score: number) => {
        const min = Math.min(...scores);
        const max = Math.max(...scores);
        if (data.length === 1 || max === min) {
            return MARGIN.top + chartHeight / 2; // Center the point
        }
        return MARGIN.top + chartHeight - (score - min) / (max - min) * chartHeight;
    };

    // Fondo
    const background = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'rank', 'background.png')).bytes());
    ctx.drawImage(background, 0, 0);

    data.forEach((point, i) => {
        if (i === 0) {
            return;
        }
        ctx.strokeStyle = data[i - 1].color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(xScale(dates[i - 1]), yScale(data[i - 1].score));
        ctx.lineTo(xScale(dates[i]), yScale(point.score));
        ctx.stroke();

        ctx.fillStyle = data[i - 1].color;
        ctx.beginPath();
        ctx.arc(xScale(dates[i - 1]), yScale(data[i - 1].score), 8, 0, Math.PI * 2);
        ctx.fill();
    });

    // Último punto
    const lastPoint = data[data.length - 1];
    ctx.fillStyle = lastPoint.color;
    ctx.beginPath();
    ctx.arc(xScale(dates[dates.length - 1]), yScale(lastPoint.score), 8, 0, Math.PI * 2);
    ctx.fill();

    let lastRank = '';
    for (const [i, point] of data.entries()) {
        if (point.rank === lastRank) {
            continue;
        }

        try {
            const ICON_SIZE = 90; // Aumentado de 30 a 60
            const x = xScale(dates[i]) - ICON_SIZE / 2;
            const y = yScale(point.score) - ICON_SIZE / 2;

            ctx.drawImage(await loadRankImage(point.image), x, y, ICON_SIZE, ICON_SIZE);
            lastRank = point.rank;
        } catch (_) {
            console.error('Error cargando imagen:', point.image);
        }
    }

    // Fechas
    const uniqueDates = [...new Set(data.map((d) => d.date))];
    const datePositions = uniqueDates.map((d) => xScale(new Date(data.find((item) => item.date === d)!.realDate)));

    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    uniqueDates.forEach((date, i) => {
        ctx.fillText(date, datePositions[i], HEIGHT - MARGIN.bottom + 33);
    });


    return canvas.encode('png');
}

async function loadRankImage(imageUrl: string) {
    const filename = imageUrl.split('/').pop() || 'unranked.png';
    const buffer = await Bun.file(join(process.cwd(), 'assets', 'ranks', filename)).bytes();
    return loadImage(buffer);
}
