import type { MakeRequired } from 'seyfert/lib/common';

import { loadImage, Canvas } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { ScoreInfo } from '../../types/dtos/MatchHistoryDTO';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';

import { drawCircularImage, loadRankIcon, loadUserIcon } from './_';
import { getRankDetails } from '../functions/rank-utils';

export interface ExpectedScoreInfo extends MakeRequired<ScoreInfo> {
    match_time_stamp: number;
    date: string;
}

export async function generateRankChart(user: PlayerDTO, scoreInfo: ExpectedScoreInfo[]): Promise<Buffer> {
    scoreInfo = scoreInfo.slice(0, 15).toReversed();
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
    const lastPoint = scoreInfo[scoreInfo.length - 1];

    // Procesar datos
    const dates = scoreInfo.map((d) => new Date(d.match_time_stamp));
    const scores = scoreInfo.map((d) => d.new_score);

    // Escalas
    const minTime = dates[0].getTime();
    const maxTime = dates[dates.length - 1].getTime();
    const xScale = (date: Date) => {
        if (scoreInfo.length === 1 || maxTime === minTime) {
            return MARGIN.left + chartWidth / 2; // Center the point
        }
        return MARGIN.left + (date.getTime() - minTime) / (maxTime - minTime) * chartWidth;
    };

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const yScale = (score: number) => {
        if (scoreInfo.length === 1 || maxScore === minScore) {
            return MARGIN.top + chartHeight / 2; // Center the point
        }
        return MARGIN.top + chartHeight - (score - minScore) / (maxScore - minScore) * chartHeight;
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

    ctx.font = '900 40px RefrigeratorDeluxeBold';
    const playerLevel = user.player.level.toString();
    const levelMetrics = ctx.measureText(playerLevel);
    ctx.fillStyle = 'black';
    ctx.fillText(playerLevel, 253 + levelMetrics.width / 2, 293 + levelMetrics.emHeightAscent);

    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const uid = user.player.uid.toString();
    const idMetrics = ctx.measureText(uid);
    ctx.fillText(uid, 730, 224 + idMetrics.emHeightAscent);

    const actualRankImage = await loadRankIcon(lastPoint.new_level);
    ctx.drawImage(actualRankImage, 294, 420, 300, 300);

    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const { rank: lastPointRank, tier: lastPointTier, color: lastPointColor } = getRankDetails(lastPoint.new_level);
    const rankText = `${lastPointRank} ${lastPointTier}`;
    const rankTextMetrics = ctx.measureText(rankText);
    ctx.fillText(rankText, 594, 514 + rankTextMetrics.emHeightAscent);

    ctx.font = '900 30px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const scoreText = `${lastPoint.new_score.toLocaleString().split('.')[0]} RS`;
    const scoreTextMetrics = ctx.measureText(scoreText);
    ctx.fillText(scoreText, 594, 577 + scoreTextMetrics.emHeightAscent);

    scoreInfo.forEach((point, i) => {
        if (i === 0) {
            return;
        }
        const { color } = getRankDetails(scoreInfo[i - 1].new_level);
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(xScale(dates[i - 1]), yScale(scoreInfo[i - 1].new_score));
        ctx.lineTo(xScale(dates[i]), yScale(point.new_score));
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(xScale(dates[i - 1]), yScale(scoreInfo[i - 1].new_score), 12, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = lastPointColor;
    ctx.beginPath();
    ctx.arc(xScale(dates[dates.length - 1]), yScale(lastPoint.new_score), 8, 0, Math.PI * 2);
    ctx.fill();

    let lastRank = '';
    for (let i = 0; i < scoreInfo.length; i++) {
        const point = scoreInfo[i];
        const { color, tier, rank } = getRankDetails(point.new_level);
        if (rank !== lastRank) {
            const rankImage = await loadRankIcon(point.new_level);
            const ICON_SIZE = 80;
            const TIER_FONT_SIZE = 32;
            const ICON_OFFSET = 10;

            const x = xScale(dates[i]) - ICON_SIZE / 2;
            const y = yScale(point.new_score) - ICON_SIZE - ICON_OFFSET;

            ctx.drawImage(rankImage, x, y, ICON_SIZE, ICON_SIZE);

            ctx.font = `bold ${TIER_FONT_SIZE}px Arial`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';


            ctx.fillStyle = color;
            ctx.fillText(
                tier,
                x + ICON_SIZE,
                y + ICON_SIZE / 2
            );

            lastRank = rank;
        }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = '20px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    for (const date of [...new Set(scoreInfo.map((d) => d.date))]) {
        const x = xScale(new Date(scoreInfo.find((item) => item.date === date)!.match_time_stamp));
        ctx.fillText(date, x, HEIGHT - MARGIN.bottom + 60);
    }

    return canvas.encode('png');
}

// async function loadRankImage(imageUrl: string) {
//     try {
//         const filename = imageUrl.split('/').pop() || 'unranked.png';
//         const buffer = await Bun.file(join(process.cwd(), 'assets', 'ranks', filename)).bytes();
//         return await loadImage(buffer);
//     } catch {
//         return loadImage(await Bun.file(join(process.cwd(), 'assets', 'ranks', 'unranked.png')).bytes());
//     }
// }
