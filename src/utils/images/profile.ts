import { createCanvas, loadImage } from '@napi-rs/canvas';
import { join } from 'node:path';

import type { HeroesRanked, PlayerDTO } from '../../types/dtos/PlayerDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { Mutable } from '../types';

import { loadHeroHistory, loadHeroSquare, loadUserIcon } from './_';
import { Role } from '../../types/dtos/HeroesDTO';

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

export async function generateProfile(data: PlayerDTO, allHeroes: HeroesDTO[], gameMode: 'ranked' | 'casual' | 'both' = 'both') {
    let concatedHeroes: HeroesRanked[];
    switch (gameMode) {
        case 'ranked':
            concatedHeroes = data.heroes_ranked;
            break;
        case 'casual':
            concatedHeroes = data.heroes_unranked;
            break;
        case 'both':
            concatedHeroes = data.heroes_ranked.concat(data.heroes_unranked);
            break;
    }
    const mostplayed = concatedHeroes.toSorted((a, b) => b.play_time - a.play_time).at(0);
    const background = await loadImage(join(process.cwd(), 'assets', 'profile', 'background.png'));

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#313338';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const mapBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'profile_map.png'));
    const userIcon = await loadUserIcon(data.player.icon.player_icon_id);
    const levelBackground = await loadImage(join(process.cwd(), 'assets', 'profile', 'level_bg.png'));

    ctx.drawImage(mapBackground, -225, 0);
    if (mostplayed?.hero_id) {
        const heroBackground = await loadImage(join(process.cwd(), 'assets', 'heroes_bg', `${mostplayed.hero_id}.png`));
        ctx.drawImage(heroBackground, 0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(userIcon, 99, 43, 100, 100);
    if (mostplayed) {
        const heroHistoryImage = await loadHeroHistory(mostplayed.hero_id);
        const histH = 120;
        const histW = 344;
        const histX = 768;
        const histY = 33;

        const heroHistoryCanvas = createCanvas(histW, histH);
        const heroHistoryCtx = heroHistoryCanvas.getContext('2d');

        heroHistoryCtx.drawImage(heroHistoryImage, 0, 0, histW, histH);

        const gradient = heroHistoryCtx.createLinearGradient(0, 0, histW, 0);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.5)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

        heroHistoryCtx.globalCompositeOperation = 'destination-in';
        heroHistoryCtx.fillStyle = gradient;
        heroHistoryCtx.fillRect(0, 0, histW, histH);

        ctx.drawImage(heroHistoryCanvas, histX, histY);
    }

    ctx.font = '900 36px RefrigeratorDeluxeBold';
    ctx.fillStyle = 'white';
    const identifierMetrics = ctx.measureText(data.player.name);
    ctx.fillText(data.player.name, 215, 91);

    ctx.drawImage(levelBackground, 225 + identifierMetrics.width, 65);

    ctx.font = '900 20px RefrigeratorDeluxeBold';
    const levelMetrics = ctx.measureText(data.player.level.toString());
    ctx.fillStyle = 'black';
    ctx.fillText(data.player.level.toString(), 249 + identifierMetrics.width - levelMetrics.width / 2, 84);

    ctx.fillStyle = '#A0A0A0';
    ctx.font = '900 13px RefrigeratorDeluxeBold';
    ctx.fillText(data.uid.toString(), 260, 110);

    if (data.player.rank.color && data.player.rank.image) {
        const rankIcon = await loadImage(getRankPath(data.player.rank.rank));
        ctx.drawImage(rankIcon, 652, 23, 120, 120);
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        ctx.fillStyle = data.player.rank.color;
        const rankNameText = data.player.rank.rank.toUpperCase();
        const rankNameMetrics = ctx.measureText(rankNameText);
        ctx.fillText(rankNameText, 711 - rankNameMetrics.width / 2, 138);
    }

    ctx.fillStyle = 'black';
    ctx.font = '900 30px RefrigeratorDeluxeBold';
    const kills = (data.overall_stats.ranked.total_kills + data.overall_stats.unranked.total_kills).toString();
    const killsMetrics = ctx.measureText(kills);
    ctx.fillText(kills, 425 - killsMetrics.width / 2, 295);

    const kdaRatio = (
        (data.overall_stats.ranked.total_kills + data.overall_stats.unranked.total_kills + data.overall_stats.ranked.total_assists + data.overall_stats.unranked.total_assists)
        / (data.overall_stats.ranked.total_deaths + data.overall_stats.unranked.total_deaths)
    ).toFixed(1);
    const kdaRatioMetrics = ctx.measureText(kdaRatio);
    ctx.fillText(kdaRatio, 572 - kdaRatioMetrics.width / 2, 295);

    const winsMetrics = ctx.measureText(data.overall_stats.total_wins.toString());
    ctx.fillText(data.overall_stats.total_wins.toString(), 727 - winsMetrics.width / 2, 295);

    const totalMvp = (data.overall_stats.ranked.total_mvp + data.overall_stats.unranked.total_mvp).toString();
    const totalSvp = (data.overall_stats.ranked.total_svp + data.overall_stats.unranked.total_svp).toString();

    const mvpMetrics = ctx.measureText(totalMvp);
    ctx.fillText(totalMvp, 861 - mvpMetrics.width / 2, 295);

    const svpMetrics = ctx.measureText(totalSvp);
    ctx.fillText(totalSvp, 1_004 - svpMetrics.width / 2, 295);

    let heal = 0;
    let damage = 0;
    let damage_taken = 0;
    let play_time = 0;

    const duelist = {
        wins: 0,
        play_time: 0,
        mvp: 0,
        svp: 0,
        matches: 0,
        kills: 0,
        assists: 0,
        deaths: 0
    };
    const strategist = {
        wins: 0,
        play_time: 0,
        mvp: 0,
        svp: 0,
        matches: 0,
        kills: 0,
        assists: 0,
        deaths: 0
    };
    const vanguard = {
        wins: 0,
        play_time: 0,
        mvp: 0,
        svp: 0,
        matches: 0,
        kills: 0,
        assists: 0,
        deaths: 0
    };

    for (const hero of concatedHeroes) {
        const role = allHeroes.find((x) => Number(x.id) === hero.hero_id)?.role;
        if (!role) {
            continue;
        }

        switch (role) {
            case Role.Duelist:
                duelist.wins += hero.wins;
                duelist.play_time += hero.play_time;
                duelist.mvp += hero.mvp;
                duelist.svp += hero.svp;
                duelist.matches += hero.matches;
                duelist.kills += hero.kills;
                duelist.assists += hero.assists;
                duelist.deaths += hero.deaths;
                damage += hero.damage;
                heal += hero.heal;
                damage_taken += hero.damage_taken;
                play_time += hero.play_time;
                break;
            case Role.Strategist:
                strategist.wins += hero.wins;
                strategist.play_time += hero.play_time;
                strategist.mvp += hero.mvp;
                strategist.svp += hero.svp;
                strategist.matches += hero.matches;
                strategist.kills += hero.kills;
                strategist.assists += hero.assists;
                strategist.deaths += hero.deaths;
                damage += hero.damage;
                heal += hero.heal;
                damage_taken += hero.damage_taken;
                play_time += hero.play_time;
                break;
            case Role.Vanguard:
                vanguard.wins += hero.wins;
                vanguard.play_time += hero.play_time;
                vanguard.mvp += hero.mvp;
                vanguard.svp += hero.svp;
                vanguard.matches += hero.matches;
                vanguard.kills += hero.kills;
                vanguard.assists += hero.assists;
                vanguard.deaths += hero.deaths;
                damage += hero.damage;
                heal += hero.heal;
                damage_taken += hero.damage_taken;
                play_time += hero.play_time;
                break;
        }
    }

    {
        const pct = duelist.wins
            ? (duelist.wins / duelist.matches * 100).toFixed(1)
            : '0.0';
        const kdaTextRatio = duelist.kills || duelist.assists
            ? ((duelist.kills + duelist.assists) / duelist.deaths).toFixed(1)
            : '0.0';

        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${pct}%`, 180, 277);
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 261);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(duelist.kills
            ? duelist.kills / duelist.matches
            : 0).toFixed(0)}/${(duelist.deaths
                ? duelist.deaths / duelist.matches
                : 0).toFixed(0)}/${(duelist.assists
                    ? duelist.assists / duelist.matches
                    : 0).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 278);
    }

    {
        const pct = strategist.wins
            ? (strategist.wins / strategist.matches * 100).toFixed(1)
            : '0.0';
        const kdaTextRatio = strategist.kills || strategist.assists
            ? ((strategist.kills + strategist.assists) / strategist.deaths).toFixed(1)
            : '0.0';

        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${pct}%`, 180, 343);
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 327);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(strategist.kills
            ? strategist.kills / strategist.matches
            : 0).toFixed(0)}/${(strategist.deaths
                ? strategist.deaths / strategist.matches
                : 0).toFixed(0)}/${(strategist.assists
                    ? strategist.assists / strategist.matches
                    : 0).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 345);
    }

    {
        const pct = vanguard.wins
            ? (vanguard.wins / vanguard.matches * 100).toFixed(1)
            : '0.0';
        const kdaTextRatio = vanguard.kills || vanguard.assists
            ? ((vanguard.kills + vanguard.assists) / vanguard.deaths).toFixed(1)
            : '0.0';

        ctx.fillStyle = 'black';
        ctx.font = '900 20px RefrigeratorDeluxeBold';
        ctx.fillText(`${pct}%`, 180, 409);
        const kdaTextRatioMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaTextRatio, 280 - kdaTextRatioMetrics.width / 2, 393);

        ctx.fillStyle = '#818181';
        ctx.font = '900 18px RefrigeratorDeluxeBold';
        const kdaText = `${(vanguard.kills
            ? vanguard.kills / vanguard.matches
            : 0).toFixed(0)}/${(vanguard.deaths
                ? vanguard.deaths / vanguard.matches
                : 0).toFixed(0)}/${(vanguard.assists
                    ? vanguard.assists / vanguard.matches
                    : 0).toFixed(0)}`;
        const kdaTextMetrics = ctx.measureText(kdaTextRatio);
        ctx.fillText(kdaText, 255 - kdaTextMetrics.width / 2, 410);
    }

    {
        const damagePerMinute = (damage / play_time * 60).toFixed(0);
        ctx.fillStyle = 'black';
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const damageMetrics = ctx.measureText(damagePerMinute);
        ctx.fillText(damagePerMinute, 150 - damageMetrics.width / 2, 575);
    }

    {
        const healPerMinute = (heal / play_time * 60).toFixed(0);
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const healingMetrics = ctx.measureText(healPerMinute);
        ctx.fillText(healPerMinute, 247 - healingMetrics.width / 2, 575);
    }

    {
        const damageTakenPerMinute = (damage_taken / play_time * 60).toFixed(0);
        ctx.font = '900 25px RefrigeratorDeluxeBold';
        const damageTakenMetrics = ctx.measureText(damageTakenPerMinute);
        ctx.fillText(damageTakenPerMinute, 195 - damageTakenMetrics.width / 2, 632);
    }

    const rawHeroes: Record<number, Mutable<Pick<HeroesRanked, 'hero_thumbnail' | 'matches' | 'assists' | 'hero_id' | 'deaths' | 'kills' | 'wins' | 'mvp' | 'svp'>>> = {};

    for (const i of concatedHeroes) {
        if (i.hero_id in rawHeroes) {
            rawHeroes[i.hero_id].matches += i.matches;
            rawHeroes[i.hero_id].assists += i.assists;
            rawHeroes[i.hero_id].deaths += i.deaths;
            rawHeroes[i.hero_id].kills += i.kills;
            rawHeroes[i.hero_id].wins += i.wins;
            rawHeroes[i.hero_id].mvp += i.mvp;
            rawHeroes[i.hero_id].svp += i.svp;
        } else {
            rawHeroes[i.hero_id] = {
                matches: i.matches,
                assists: i.assists,
                deaths: i.deaths,
                kills: i.kills,
                wins: i.wins,
                mvp: i.mvp,
                svp: i.svp,
                hero_id: i.hero_id,
                hero_thumbnail: i.hero_thumbnail
            };
        }
    }

    const topHeroes = Object.values(rawHeroes).toSorted((a, b) => b.matches - a.matches).slice(0, 3);

    for (let i = 0; i < topHeroes.length; i++) {
        const hero = topHeroes.at(i)!;
        const y = 432 + i * 61;
        const heroIcon = await loadHeroSquare(hero.hero_id);

        ctx.drawImage(heroIcon, 370, y, 50, 50);
        // ctx.fillStyle = hero.metadata.color;

        const matchesMetrics = ctx.measureText(hero.matches.toString());
        ctx.fillText(hero.matches.toString(), 490 - matchesMetrics.width / 2, y + 35);

        const winPct = `${(hero.wins / hero.matches * 100).toFixed(1)}%`;
        const wrMetrics = ctx.measureText(winPct);
        ctx.fillText(winPct, 637 - wrMetrics.width / 2, y + 35);

        const heroMvpMetrics = ctx.measureText(hero.mvp.toString());
        ctx.fillText(hero.mvp.toString(), 763 - heroMvpMetrics.width / 2, y + 35);

        const heroSvpMetrics = ctx.measureText(hero.svp.toString());
        ctx.fillText(hero.svp.toString(), 902 - heroSvpMetrics.width / 2, y + 35);

        const kdaText = `${(hero.kills / hero.matches).toFixed(0)}/${(hero.deaths / hero.matches).toFixed(0)}/${(hero.assists / hero.matches).toFixed(0)}`;
        const kdaMetrics = ctx.measureText(kdaText);
        ctx.fillText(kdaText, 1_040 - kdaMetrics.width / 2, y + 35);
    }

    return canvas.encode('png');
}
