import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { PlayerDTO } from '../../types/v2/PlayerDTO';

import { parseNameForRivalSkins } from '../functions/skins';

function getRankPath(rank: string) {
    let p: string;
    if (rank.includes('All')) {
        p = 'one_above_all.png';
    } else {
        const rankName = rank.split(' ')[0].toLowerCase();
        p = `${rankName}.png`;
    }
    return join(process.cwd(), 'assets', 'ranks', p);
}

export async function generateProfile(data: PlayerDTO['data'], playerID: string) {
    const mostplayed = data.segments.filter((x) => x.type === 'hero').sort((a, b) => (b.stats.timePlayed?.value ?? 0) - (a.stats.timePlayed?.value ?? 0)).at(0);
    const overview = data.segments.find((x) => x.type === 'overview')!;

    const background = await loadImage(join(process.cwd(), 'assets', 'profile', 'background.png'));

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#313338';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // const mapBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'map.png'));
    const userIcon = await loadImage(data.platformInfo.avatarUrl);
    const levelBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'level_bg.png'));

    // ctx.drawImage(mapBackground, -225, 0);
    if (mostplayed?.attributes.heroId) {
        const heroBackground = await loadImage(join(process.cwd(), 'assets', 'heroes_bg', `${mostplayed.attributes.heroId.toString()}.png`));
        ctx.drawImage(heroBackground, 0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(userIcon, 99, 43, 100, 100);
    if (mostplayed) {
        const historyIcon = await loadImage(`https://rivalskins.com/wp-content/uploads/marvel-assets/assets/hero-story-images/${parseNameForRivalSkins(mostplayed.metadata.name).replaceAll(' ', '%20')
            }%20Story.png`);
        ctx.drawImage(historyIcon, 768, 33, 344, 120);
    }

    ctx.font = '900 36px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const identifierMetrics = ctx.measureText(data.platformInfo.platformUserIdentifier);
    ctx.fillText(data.platformInfo.platformUserIdentifier, 215, 91);

    ctx.drawImage(levelBackground, 225 + identifierMetrics.width, 65);

    ctx.font = '900 20px RefrigeratorDeluxeBold';
    const levelMetrics = ctx.measureText(data.metadata.level.toString());
    ctx.fillStyle = 'black';
    ctx.fillText(data.metadata.level.toString(), 249 + identifierMetrics.width - levelMetrics.width / 2, 84);

    ctx.fillStyle = '#A0A0A0';
    ctx.font = '900 13px RefrigeratorDeluxeBold';
    ctx.fillText(playerID, 260, 110);

    if (overview.stats.ranked) {
        const rankIcon = await loadImage(getRankPath(overview.stats.ranked.metadata.tierName));
        ctx.drawImage(rankIcon, 652, 23, 120, 120);
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        ctx.fillStyle = overview.stats.ranked.metadata.color;
        const rankNameText = overview.stats.ranked.metadata.tierName.toUpperCase();
        const rankNameMetrics = ctx.measureText(rankNameText);
        ctx.fillText(rankNameText, 711 - rankNameMetrics.width / 2, 138);
    }

    if (overview.stats.kills) {
        ctx.fillStyle = 'black';
        ctx.font = '900 30px RefrigeratorDeluxeBold';
        const killsMetrics = ctx.measureText(overview.stats.kills.value.toString());
        ctx.fillText(overview.stats.kills.value.toString(), 425 - killsMetrics.width / 2, 295);
    }

    if (overview.stats.kdaRatio) {
        const kdaRatioMetrics = ctx.measureText(overview.stats.kdaRatio.value.toString());
        ctx.fillText(overview.stats.kdaRatio.value.toString(), 572 - kdaRatioMetrics.width / 2, 295);
    }

    if (overview.stats.matchesWon) {
        const winsMetrics = ctx.measureText(overview.stats.matchesWon.value.toString());
        ctx.fillText(overview.stats.matchesWon.value.toString(), 727 - winsMetrics.width / 2, 295);
    }

    if (overview.stats.totalMvp) {
        const mvpMetrics = ctx.measureText(overview.stats.totalMvp.value.toString());
        ctx.fillText(overview.stats.totalMvp.value.toString(), 861 - mvpMetrics.width / 2, 295);
    }

    if (overview.stats.totalSvp) {
        const svpMetrics = ctx.measureText(overview.stats.totalSvp.value.toString());
        ctx.fillText(overview.stats.totalSvp.value.toString(), 1_004 - svpMetrics.width / 2, 295);
    }

    const duelist = data.segments.find((x) => x.type === 'hero-role' && x.attributes.roleId === 'duelist');
    const strategist = data.segments.find((x) => x.type === 'hero-role' && x.attributes.roleId === 'strategist');
    const vanguard = data.segments.find((x) => x.type === 'hero-role' && x.attributes.roleId === 'vanguard');

    if (overview.stats.matchesPlayed && duelist?.stats.matchesWinPct && duelist.stats.kdaRatio && duelist.stats.kills && duelist.stats.deaths && duelist.stats.assists) {
        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${duelist.stats.matchesWinPct.value.toFixed(1)}%`, 180, 277);
        const kdaTextRatio = duelist.stats.kdaRatio.displayValue;
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 261);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(duelist.stats.kills.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(duelist.stats.deaths.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(duelist.stats.assists.value / overview.stats.matchesPlayed.value).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 278);
    }

    if (overview.stats.matchesPlayed && strategist?.stats.matchesWinPct && strategist.stats.kdaRatio && strategist.stats.kills && strategist.stats.deaths && strategist.stats.assists) {
        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${strategist.stats.matchesWinPct.value.toFixed(1)}%`, 180, 343);
        const kdaTextRatio = strategist.stats.kdaRatio.displayValue;
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 327);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(strategist.stats.kills.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(strategist.stats.deaths.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(strategist.stats.assists.value / overview.stats.matchesPlayed.value).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 345);
    }

    if (overview.stats.matchesPlayed && vanguard?.stats.matchesWinPct && vanguard.stats.kdaRatio && vanguard.stats.kills && vanguard.stats.deaths && vanguard.stats.assists) {
        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${vanguard.stats.matchesWinPct.value.toFixed(1)}%`, 180, 409);
        const kdaTextRatio = vanguard.stats.kdaRatio.displayValue;
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 393);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(vanguard.stats.kills.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(vanguard.stats.deaths.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(vanguard.stats.assists.value / overview.stats.matchesPlayed.value).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 410);
    }

    if (overview.stats.totalHeroDamagePerMinute) {
        ctx.fillStyle = 'black';
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const damageMetrics = ctx.measureText(overview.stats.totalHeroDamagePerMinute.displayValue);
        ctx.fillText(overview.stats.totalHeroDamagePerMinute.displayValue, 150 - damageMetrics.width / 2, 575);
    }

    if (overview.stats.totalHeroHealPerMinute) {
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const healingMetrics = ctx.measureText(overview.stats.totalHeroHealPerMinute.displayValue);
        ctx.fillText(overview.stats.totalHeroHealPerMinute.displayValue, 247 - healingMetrics.width / 2, 575);
    }

    if (overview.stats.totalDamageTakenPerMinute) {
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const damageTakenMetrics = ctx.measureText(overview.stats.totalDamageTakenPerMinute.displayValue);
        ctx.fillText(overview.stats.totalDamageTakenPerMinute.displayValue, 195 - damageTakenMetrics.width / 2, 632);
    }

    const topHeroes = data.segments.filter((x) => x.type === 'hero').slice(0, 3);

    for (let i = 0; i < topHeroes.length; i++) {
        const hero = topHeroes.at(i)!;
        const y = 432 + i * 61;
        const heroIcon = await loadImage(hero.metadata.imageUrl);

        ctx.drawImage(heroIcon, 370, y, 50, 50);
        ctx.fillStyle = hero.metadata.color;

        if (hero.stats.matchesPlayed) {
            const matchesMetrics = ctx.measureText(hero.stats.matchesPlayed.displayValue);
            ctx.fillText(hero.stats.matchesPlayed.displayValue, 490 - matchesMetrics.width / 2, y + 35);
        }

        if (hero.stats.matchesWinPct) {
            const wrMetrics = ctx.measureText(hero.stats.matchesWinPct.displayValue);
            ctx.fillText(hero.stats.matchesWinPct.displayValue, 637 - wrMetrics.width / 2, y + 35);
        }

        if (hero.stats.totalMvp) {
            const heroMvpMetrics = ctx.measureText(hero.stats.totalMvp.displayValue);
            ctx.fillText(hero.stats.totalMvp.displayValue, 763 - heroMvpMetrics.width / 2, y + 35);
        }

        if (hero.stats.totalSvp) {
            const heroSvpMetrics = ctx.measureText(hero.stats.totalSvp.displayValue);
            ctx.fillText(hero.stats.totalSvp.displayValue, 902 - heroSvpMetrics.width / 2, y + 35);
        }

        if (hero.stats.kills && hero.stats.deaths && hero.stats.assists && overview.stats.matchesPlayed) {
            const kdaText = `${(hero.stats.kills.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(hero.stats.deaths.value / overview.stats.matchesPlayed.value).toFixed(0)}/${(hero.stats.assists.value / overview.stats.matchesPlayed.value).toFixed(0)}`;
            const kdaMetrics = ctx.measureText(kdaText);
            ctx.fillText(kdaText, 1_040 - kdaMetrics.width / 2, y + 35);
        }
    }

    return canvas.encode('png');
}
