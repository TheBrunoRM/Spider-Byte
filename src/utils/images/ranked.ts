import { loadImage, Canvas } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { RankHistoryDataPoint } from '../functions/rank-utils';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';

import { drawCircularImage, loadUserIcon } from './_';

export async function generateRankChart(user: PlayerDTO, data: RankHistoryDataPoint[]): Promise<Buffer> {
    const WIDTH = 2_560;
    const HEIGHT = 1_440;
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const MARGIN = {
        top: 720,
        right: 220,
        bottom: 120,
        left: 220
    };
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const lastPoint = data[data.length - 1];

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

    const background = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'rank', 'background.png')).bytes());
    ctx.drawImage(background, 0, 0);
    const userIcon = await loadUserIcon(user.player.icon.player_icon_id);
    drawCircularImage(ctx, userIcon, 144, 37, 300, 300);
    const levelBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'level_bg.png'));
    ctx.drawImage(levelBackground, 254, 289, 69, 48);

    ctx.font = '900 70px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const playerNameMetrics = ctx.measureText(user.player.name);
    ctx.fillText(user.player.name, 487, 107 + playerNameMetrics.emHeightAscent);
    if (user.player.team.club_team_id) {
        ctx.fillStyle = '#737373';
        const clubTeamName = `#${user.player.team.club_team_mini_name}`;
        const teamIdMetrics = ctx.measureText(clubTeamName);
        ctx.fillText(clubTeamName, playerNameMetrics.width + teamIdMetrics.width + 300, 107 + teamIdMetrics.emHeightAscent);
    }

    ctx.font = '900 30px RefrigeratorDeluxeBold';
    const playerLevel = user.player.level.toString();
    const levelMetrics = ctx.measureText(playerLevel);
    ctx.fillStyle = 'black';
    ctx.fillText(playerLevel, 249 + levelMetrics.width / 2, 289 + levelMetrics.emHeightAscent);

    ctx.font = '900 30px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const uid = user.player.uid.toString();
    const idMetris = ctx.measureText(uid);
    ctx.fillText(uid, 730, 224 + idMetris.emHeightAscent);

    const actualRankImage = await loadRankImage(lastPoint.image);
    ctx.drawImage(actualRankImage, 294, 420, 300, 300);

    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const rankText = `${lastPoint.rank} ${lastPoint.tier}`;
    const rankTextMetrics = ctx.measureText(rankText);
    ctx.fillText(rankText, 594, 514 + rankTextMetrics.emHeightAscent);

    ctx.font = '900 30px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const scoreText = `${lastPoint.score.toLocaleString().split('.')[0]} RS`;
    const scoreTextMetrics = ctx.measureText(scoreText);
    ctx.fillText(scoreText, 594, 577 + scoreTextMetrics.emHeightAscent);

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
        ctx.arc(xScale(dates[i - 1]), yScale(data[i - 1].score), 12, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = lastPoint.color;
    ctx.beginPath();
    ctx.arc(xScale(dates[dates.length - 1]), yScale(lastPoint.score), 8, 0, Math.PI * 2);
    ctx.fill();

    let lastRank = '';
    for (let i = 0; i < data.length; i++) {
        const point = data[i];
        if (point.rank === lastRank) {
            continue;
        }

        const ICON_SIZE = 120;
        const x = xScale(dates[i]) - ICON_SIZE / 2;
        const y = yScale(point.score) - ICON_SIZE / 2;

        ctx.drawImage(await loadRankImage(point.image), x, y, ICON_SIZE, ICON_SIZE);
        lastRank = point.rank;
    }

    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    for (const date of [...new Set(data.map((d) => d.date))]) {
        const x = xScale(new Date(data.find((item) => item.date === date)!.realDate));
        ctx.fillText(date, x, HEIGHT - MARGIN.bottom + 60);
    }


    return canvas.encode('png');
}

async function loadRankImage(imageUrl: string) {
    const filename = imageUrl.split('/').pop() || 'unranked.png';
    const buffer = await Bun.file(join(process.cwd(), 'assets', 'ranks', filename)).bytes();
    return loadImage(buffer);
}
