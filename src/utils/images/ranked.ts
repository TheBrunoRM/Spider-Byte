import type { MakeRequired } from 'seyfert/lib/common';

import { loadImage, Canvas } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { ScoreInfo } from '../../types/dtos/MatchHistoryDTO';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';

import { drawCircularImage, loadRankIcon, loadUserIcon } from './_';
import { getRankDetails } from '../functions/rank-utils';

export interface ExpectedScoreInfo extends MakeRequired<ScoreInfo> {
    match_time_stamp: number;
}

export async function generateRankChart(user: PlayerDTO, scoreInfo: ExpectedScoreInfo[]): Promise<Buffer> {
    scoreInfo = scoreInfo.toReversed();
    const WIDTH = 2_560;
    const HEIGHT = 1_440;
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const MARGIN = {
        top: 720,
        right: 170,
        bottom: 120,
        left: 260,
    };
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const lastPoint = scoreInfo[scoreInfo.length - 1];

    // Procesar datos
    const dates = scoreInfo.map((d) => new Date(d.match_time_stamp));
    const scores = scoreInfo.map((d) => d.new_score);

    // Escalas
    const minY = 0;
    const maxY = dates.length;
    const xScale = (index: number) => {
        if (scoreInfo.length === 1 || maxY === minY) {
            return MARGIN.left + chartWidth / 2; // Center the point
        }
        return MARGIN.left + (index - minY) / (maxY - minY) * chartWidth;
    };
    // // Escalas
    // const minTime = dates[0].getTime();
    // const maxTime = dates[dates.length - 1].getTime();
    // const xScale = (date: Date) => {
    //     if (scoreInfo.length === 1 || maxTime === minTime) {
    //         return MARGIN.left + chartWidth / 2; // Center the point
    //     }
    //     return MARGIN.left + (date.getTime() - minTime) / (maxTime - minTime) * chartWidth;
    // };

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
        ctx.fillText(clubTeamName, playerNameMetrics.width + teamIdMetrics.width + 330, 107 + teamIdMetrics.emHeightAscent);
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
    const scoreText = `${lastPoint.new_score.toString().split('.')[0]} RS`;
    const scoreTextMetrics = ctx.measureText(scoreText);
    ctx.fillText(scoreText, 594, 577 + scoreTextMetrics.emHeightAscent);

    scoreInfo.forEach((point, i) => {
        if (i === 0) {
            return;
        }
        const { color } = getRankDetails(scoreInfo[i - 1].new_level);

        // Draw line segment
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(xScale(i - 1), yScale(scoreInfo[i - 1].new_score));
        ctx.lineTo(xScale(i), yScale(point.new_score));
        ctx.stroke();

        // Add gradient below line
        const gradient = ctx.createLinearGradient(0, yScale(Math.max(scoreInfo[i - 1].new_score, point.new_score)), 0, MARGIN.top + chartHeight);
        gradient.addColorStop(0, color + 'CC'); // Semi-transparent color
        gradient.addColorStop(1, color + '00'); // Fully transparent

        // Create area below the line segment
        ctx.beginPath();
        ctx.moveTo(xScale(i - 1), yScale(scoreInfo[i - 1].new_score));
        ctx.lineTo(xScale(i), yScale(point.new_score));
        ctx.lineTo(xScale(i), MARGIN.top + chartHeight); // Bottom right corner
        ctx.lineTo(xScale(i - 1), MARGIN.top + chartHeight); // Bottom left corner
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw circle for the point
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(xScale(i - 1), yScale(scoreInfo[i - 1].new_score), 8, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw the final point
    ctx.fillStyle = lastPointColor;
    ctx.beginPath();
    ctx.arc(xScale(maxY - 1), yScale(lastPoint.new_score), 8, 0, Math.PI * 2);
    ctx.fill();

    let lastRank = '';
    for (let i = 0; i < scoreInfo.length; i++) {
        const point = scoreInfo[i];
        const { tier, rank } = getRankDetails(point.new_level);
        if (rank !== lastRank) {
            const rankImage = await loadRankIcon(point.new_level);
            const ICON_SIZE = 80;
            const TIER_FONT_SIZE = 32;
            const ICON_OFFSET = 10;

            const x = xScale(i) - ICON_SIZE / 2;
            const y = yScale(point.new_score) - ICON_SIZE - ICON_OFFSET;

            ctx.drawImage(rankImage, x, y, ICON_SIZE, ICON_SIZE);

            ctx.font = `bold ${TIER_FONT_SIZE}px RefrigeratorDeluxeBold`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';


            ctx.fillStyle = 'white';
            ctx.fillText(
                tier,
                x + ICON_SIZE,
                y + ICON_SIZE / 2
            );

            lastRank = rank;
        }
        // Draw the LAST point rank icon
        if (i === scoreInfo.length - 1) {
            const rankImage = await loadRankIcon(point.new_level);
            const ICON_SIZE = 80;
            const TIER_FONT_SIZE = 32;
            const ICON_OFFSET = 10;

            const x = xScale(i) - ICON_SIZE / 2;
            const y = yScale(point.new_score) - ICON_SIZE - ICON_OFFSET;

            ctx.drawImage(rankImage, x, y, ICON_SIZE, ICON_SIZE);

            ctx.font = `bold ${TIER_FONT_SIZE}px Arial`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            ctx.fillStyle = 'white';
            ctx.fillText(
                tier,
                x + ICON_SIZE,
                y + ICON_SIZE / 2
            );
        }
    }

    ctx.fillStyle = '#FFF';
    ctx.font = '20px RefrigeratorDeluxeBold';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    const NUM_Y_TICKS = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px Arial';

    for (let i = 0; i <= NUM_Y_TICKS; i++) {
        const score = minScore + (maxScore - minScore) * (i / NUM_Y_TICKS);
        const y = yScale(score);

        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(MARGIN.left - 30, y);
        ctx.lineTo(MARGIN.left - 20, y);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw score text - increase spacing from margin
        ctx.fillText(
            Math.round(score).toString().split('.')[0],
            MARGIN.left - 40,
            y
        );
    }

    // Y-axis label - move further left to prevent overlap
    // ctx.save();
    // ctx.translate(MARGIN.left - 140, MARGIN.top + chartHeight / 2);
    // ctx.rotate(-Math.PI / 2);
    // ctx.textAlign = 'center';
    // ctx.font = 'bold 28px Arial';
    // ctx.fillText('Score (RS)', 0, 0);
    // ctx.restore();

    return canvas.encode('png');
}
