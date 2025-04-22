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

const seasons = [{
    name: 'S0: Doom\'s rise',
    value: 0
}, {
    name: 'S1: Eternal Night Falls',
    value: 1
}, {
    name: 'S1.5: Eternal Night Falls',
    value: 1.5
}, {
    name: 'S2: Hellfire Gala',
    value: 2
}] as const;

function getSeasonName(season?: number): string {
    if (season === undefined) {
        return seasons[seasons.length - 1].name;
    }
    const seasonData = seasons.find((s) => s.value === season) ?? seasons[seasons.length - 1];
    return seasonData.name;
}

export async function generateRankChart(user: PlayerDTO, scoreInfo: ExpectedScoreInfo[], season?: number): Promise<Buffer> {
    scoreInfo = scoreInfo.toReversed();
    const WIDTH = 2_560;
    const HEIGHT = 1_440;
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    const MARGIN = {
        top: 720,
        right: 170,
        bottom: 120,
        left: 260
    };
    const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
    const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const lastPoint = scoreInfo[scoreInfo.length - 1];

    // Process data
    const dates = scoreInfo.map((d) => new Date(d.match_time_stamp));
    const scores = scoreInfo.map((d) => d.new_score);
    // const minY = 0;
    const maxY = Math.max(1, dates.length - 1);
    const xScale = (index: number) => MARGIN.left + index / maxY * chartWidth;
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const scoreRange = maxScore - minScore;
    const yScale = (score: number) => {
        if (scoreRange === 0) {
            const buffer = chartHeight * 0.25;
            return MARGIN.top + buffer + (chartHeight - buffer * 2) / 2;
        }
        return MARGIN.top + chartHeight - (score - minScore) / scoreRange * chartHeight;
    };

    // Draw background
    const background = await loadImage(await Bun.file(join(process.cwd(), 'assets', 'rank', 'background.png')).bytes());
    ctx.drawImage(background, 0, 0);

    // Chart title in top right
    ctx.font = '900 70px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    const chartTitle = 'Ranked Score Chart';
    const titleMetrics = ctx.measureText(chartTitle);
    ctx.fillText(chartTitle, 2_416, 110 + titleMetrics.emHeightAscent);

    // Season subtitle
    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const seasonTitle = `at ${getSeasonName(season)}`;
    const seasonMetrics = ctx.measureText(seasonTitle);
    ctx.fillText(seasonTitle, 2_416, 110 + titleMetrics.emHeightAscent + seasonMetrics.emHeightAscent + 10);

    // Add trend statistics
    const initialScore = scoreInfo[0].new_score;
    const finalScore = lastPoint.new_score;
    const scoreDiff = finalScore - initialScore;
    const scoreDiffText = scoreDiff >= 0
        ? `+${Math.round(scoreDiff)}`
        : `${Math.round(scoreDiff)}`;
    const trendText = `Score trend: ${scoreDiffText} points`;

    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = scoreDiff >= 0
        ? '#4CAF50'
        : '#F44336';
    ctx.textAlign = 'right';
    ctx.fillText(trendText, 2_416, 110 + titleMetrics.emHeightAscent + seasonMetrics.emHeightAscent + 65);

    // Calculate win/loss stats
    const totalMatches = scoreInfo.length - 1;
    let wins = 0;
    let losses = 0;

    for (let i = 1; i < scoreInfo.length; i++) {
        const matchScoreDiff = scoreInfo[i].new_score - scoreInfo[i - 1].new_score;
        if (matchScoreDiff > 0) {
            wins++;
        } else if (matchScoreDiff < 0) {
            losses++;
        }
    }

    // Display match statistics
    const matchStatsText = `Matches: ${totalMatches} (${wins}W / ${losses}L)`;
    const winRate = totalMatches > 0
        ? Math.round(wins / totalMatches * 100)
        : 0;
    const winRateText = `Win rate: ${winRate}%`;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(matchStatsText, 2_416, 110 + titleMetrics.emHeightAscent + seasonMetrics.emHeightAscent + 120);

    ctx.fillStyle = winRate >= 50
        ? '#4CAF50'
        : '#F44336';
    ctx.fillText(winRateText, 2_416, 110 + titleMetrics.emHeightAscent + seasonMetrics.emHeightAscent + 175);

    ctx.textAlign = 'left';

    // Player info section
    const userIcon = await loadUserIcon(user.player.icon.player_icon_id);
    drawCircularImage(ctx, userIcon, 144, 37, 300, 300);
    const levelBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'level_bg.png'));
    ctx.drawImage(levelBackground, 254, 289, 69, 48);

    // Player name
    ctx.font = '900 70px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const playerNameMetrics = ctx.measureText(user.player.name);
    ctx.fillText(user.player.name, 487, 110 + playerNameMetrics.emHeightAscent);

    // Team name if exists
    if (user.player.team.club_team_id) {
        ctx.fillStyle = '#737373';
        const clubTeamName = `#${user.player.team.club_team_mini_name}`;
        const teamIdMetrics = ctx.measureText(clubTeamName);
        ctx.fillText(clubTeamName, playerNameMetrics.width + teamIdMetrics.width + 330, 110 + teamIdMetrics.emHeightAscent);
    }

    // Player UID
    ctx.font = '900 40px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const uid = `Player UID: ${user.player.uid}`;
    const idMetrics = ctx.measureText(uid);
    ctx.fillText(uid, 487, 110 + playerNameMetrics.emHeightAscent + idMetrics.emHeightAscent + 10);

    // Player level
    ctx.font = '900 40px RefrigeratorDeluxeBold';
    const playerLevel = user.player.level.toString();
    const levelMetrics = ctx.measureText(playerLevel);
    ctx.fillStyle = 'black';
    ctx.fillText(playerLevel, 253 + levelMetrics.width / 2, 293 + levelMetrics.emHeightAscent);

    // Current rank info
    const actualRankImage = await loadRankIcon(lastPoint.new_level);
    ctx.drawImage(actualRankImage, 294, 420, 300, 300);

    // Rank text
    ctx.font = '900 60px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const { rank: lastPointRank, tier: lastPointTier, color: lastPointColor } = getRankDetails(lastPoint.new_level);
    const rankText = `${lastPointRank} ${lastPointTier}`;
    const rankTextMetrics = ctx.measureText(rankText);
    ctx.fillText(rankText, 594, 514 + rankTextMetrics.emHeightAscent);

    // Current score
    ctx.font = '900 50px RefrigeratorDeluxeBold';
    ctx.fillStyle = '#737373';
    const scoreText = `${lastPoint.new_score.toString().split('.')[0]} RS`;
    const scoreTextMetrics = ctx.measureText(scoreText);
    ctx.fillText(scoreText, 594, 577 + scoreTextMetrics.emHeightAscent);

    // Draw progression lines and fill
    scoreInfo.forEach((point, i) => {
        if (i === 0) {
            return;
        }

        const { color } = getRankDetails(scoreInfo[i - 1].new_level);

        // Line segment
        ctx.strokeStyle = color;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(xScale(i - 1), yScale(scoreInfo[i - 1].new_score));
        ctx.lineTo(xScale(i), yScale(point.new_score));
        ctx.stroke();

        // Gradient fill
        const gradient = ctx.createLinearGradient(0, yScale(Math.max(scoreInfo[i - 1].new_score, point.new_score)), 0, MARGIN.top + chartHeight);
        gradient.addColorStop(0, `${color}CC`);
        gradient.addColorStop(1, `${color}00`);

        // Area below line
        ctx.beginPath();
        ctx.moveTo(xScale(i - 1), yScale(scoreInfo[i - 1].new_score));
        ctx.lineTo(xScale(i), yScale(point.new_score));
        ctx.lineTo(xScale(i), MARGIN.top + chartHeight);
        ctx.lineTo(xScale(i - 1), MARGIN.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        // Point circle
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(xScale(i - 1), yScale(scoreInfo[i - 1].new_score), 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw the last point in the loop
        if (i === scoreInfo.length - 1) {
            ctx.fillStyle = lastPointColor;
            ctx.beginPath();
            ctx.arc(xScale(i), yScale(point.new_score), 8, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Draw rank icons at rank changes
    let lastRank = '';
    for (let i = 0; i < scoreInfo.length; i++) {
        const point = scoreInfo[i];
        const { tier, rank } = getRankDetails(point.new_level);

        // Show icon when rank changes
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
            ctx.fillText(tier, x + ICON_SIZE, y + ICON_SIZE / 2);

            lastRank = rank;
        }

        // Always show final point rank
        if (i === scoreInfo.length - 1) {
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
            ctx.fillText(tier, x + ICON_SIZE, y + ICON_SIZE / 2);
        }
    }

    // Y-axis score ticks
    const NUM_Y_TICKS = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 24px RefrigeratorDeluxeBold';

    for (let i = 0; i <= NUM_Y_TICKS; i++) {
        const score = minScore + (maxScore - minScore) * (i / NUM_Y_TICKS);
        const y = yScale(score);

        ctx.beginPath();
        ctx.moveTo(MARGIN.left - 30, y);
        ctx.lineTo(MARGIN.left - 20, y);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillText(
            Math.round(score).toString().split('.')[0],
            MARGIN.left - 40,
            y
        );
    }

    // X-axis date labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 20px RefrigeratorDeluxeBold';

    let lastMonth = -1;
    let lastDay = -1;

    const formatDate = (date: Date): string => {
        const day = date.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        return `${month} ${day}`;
    };

    // Draw vertical lines and rotated date labels
    for (let i = 0; i < dates.length; i++) {
        const currentDate = dates[i];
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        if (currentMonth !== lastMonth || currentDay !== lastDay) {
            const x = xScale(i);

            // Dotted vertical reference line
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.moveTo(x, yScale(scoreInfo[i].new_score));
            ctx.lineTo(x, MARGIN.top + chartHeight);
            ctx.strokeStyle = '#FFFFFF33';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            // Rotated date text
            ctx.save();
            const dateText = formatDate(currentDate);
            ctx.translate(x, MARGIN.top + chartHeight + 15);
            ctx.rotate(3 * Math.PI / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(dateText, 0, 0);
            ctx.restore();

            lastMonth = currentMonth;
            lastDay = currentDay;
        }
    }

    return canvas.encode('png');
}
