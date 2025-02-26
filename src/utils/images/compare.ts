import type { Image } from '@napi-rs/canvas';

import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { PlayerDTO } from '../../types/v2/PlayerDTO';

const Y_ICON = 84;
const Y_NAME = 221;
let background: Image | null = null;

export async function generateCompare(players: [PlayerDTO['data'], PlayerDTO['data']]) {
    background ??= await loadImage(join(process.cwd(), 'assets', 'compare', 'background.png'));

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(background, 0, 0);
    ctx.font = 'bold 30px leaderboard';

    const statsData = players.map((player) => {
        const playerStats = player.segments[0].stats;
        const kills = playerStats.kills?.value ?? 0;
        const deaths = playerStats.deaths?.value ?? 0;
        const assists = playerStats.assists?.value ?? 0;

        const values = [
            playerStats.matchesPlayed?.value ?? 0,
            playerStats.matchesWon?.value ?? 0,
            playerStats.matchesWinPct?.displayValue ?? '0',
            kills,
            deaths,
            assists,
            playerStats.kdRatio?.value.toFixed(2) ?? 0,
            playerStats.totalMvp?.value ?? 0
        ];

        return {
            kills,
            deaths,
            assists,
            values
        };
    });

    for (let i = 0; i < 2; i++) {
        const data = players.at(i)!;
        const xAvatar = i === 0
            ? 65.5
            : 251.5;
        const avatar = await loadImage(
            await (await fetch(data.platformInfo.avatarUrl)).arrayBuffer()
        );

        ctx.drawImage(avatar, xAvatar, Y_ICON, 100, 100);

        ctx.fillStyle = 'white';
        const nameText = players[i].platformInfo.platformUserIdentifier;
        const nameMetrics = ctx.measureText(nameText);
        ctx.fillText(nameText, xAvatar + 50 - nameMetrics.width / 2, Y_NAME);

        const playerStats = statsData.at(i)!;
        const otherPlayerStats = statsData.at(i === 0
            ? 1
            : 0)!;

        for (let j = 0; j < playerStats.values.length; j++) {
            const offSetY = j * 98;
            const Y_STAT = 291 + offSetY + 30;
            const statText = `${playerStats.values.at(j)!}`;// lmao
            const statMetrics = ctx.measureText(statText);

            if (j === 4) {
                if (otherPlayerStats.values.at(j)! > playerStats.values.at(j)!) {
                    ctx.fillStyle = '#dfb540';
                } else {
                    ctx.fillStyle = 'white';
                }
            } else if (playerStats.values.at(j)! > otherPlayerStats.values.at(j)!) {
                ctx.fillStyle = '#dfb540';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.fillText(statText, xAvatar + avatar.width / 2 - statMetrics.width / 2 - 20, Y_STAT);
        }
    }

    return canvas.encode('png');
}
