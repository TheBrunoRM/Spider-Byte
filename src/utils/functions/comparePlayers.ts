import type { PlayerDTO } from '../../types/dtos/PlayerDTO';

const rankFilter = Object.freeze({
    1: 'Bronze III',
    2: 'Bronze II',
    3: 'Bronze I',
    4: 'Silver III',
    5: 'Silver II',
    6: 'Silver I',
    7: 'Gold III',
    8: 'Gold II',
    9: 'Gold I',
    10: 'Platinum III',
    11: 'Platinum II',
    12: 'Platinum I',
    13: 'Diamond III',
    14: 'Diamond II',
    15: 'Diamond I',
    16: 'Grandmaster III',
    17: 'Grandmaster II',
    18: 'Grandmaster I',
    19: 'Celestial III',
    20: 'Celestial II',
    21: 'Celestial I',
    22: 'Eternity',
    23: 'One Above All'
} as const);

type Rank = keyof typeof rankFilter;

function getMaxNumber(val1?: number, val2?: number): number {
    return Math.max(val1 || 0, val2 || 0);
}

function getRankValue(rank: undefined | string): number {
    return rank
        ? Number(Object.keys(rankFilter).find((key) => rankFilter[key as unknown as Rank] === rank) || 0)
        : 0;
}

function getMaxRank(rank1?: string, rank2?: string): string {
    const rankValue1 = getRankValue(rank1);
    const rankValue2 = getRankValue(rank2);
    if (rankValue1 === 0 && rankValue2 === 0) {
        return 'Unranked';
    }
    return rankValue1 >= rankValue2
        ? rank1 ?? 'Unranked'
        : rank2 ?? 'Unranked';
}

function getComparisonStat(
    player1: PlayerDTO,
    player2: PlayerDTO,
    statAccessor: (player: PlayerDTO) => undefined | number
) {
    const value1 = statAccessor(player1) || 0;
    const value2 = statAccessor(player2) || 0;
    return {
        value: getMaxNumber(value1, value2),
        fromPlayer: value1 >= value2
            ? player1.player.name
            : player2.player.name,
        difference: Math.abs(value1 - value2)
    };
}

export function comparePlayers(player1: PlayerDTO, player2: PlayerDTO): ComparisonResult {
    return {
        highestRank: {
            value: getMaxRank(player1.player.rank.rank, player2.player.rank.rank),
            fromPlayer: getMaxRank(player1.player.rank.rank, player2.player.rank.rank) === player1.player.rank.rank
                ? player1.player.name
                : player2.player.name
        },
        highestLevel: getComparisonStat(player1, player2, (p) => Number(p.player.level)),
        highestWins: getComparisonStat(player1, player2, (p) => p.overall_stats.total_wins),
        highestMatches: getComparisonStat(player1, player2, (p) => p.overall_stats.total_matches),
        highestKills: getComparisonStat(
            player1,
            player2,
            (p) => (p.overall_stats.ranked.total_kills || 0) + (p.overall_stats.unranked.total_kills || 0)
        ),
        highestDeaths: getComparisonStat(
            player1,
            player2,
            (p) => (p.overall_stats.ranked.total_deaths || 0) + (p.overall_stats.unranked.total_deaths || 0)
        ),
        highestAssists: getComparisonStat(
            player1,
            player2,
            (p) => (p.overall_stats.ranked.total_assists || 0) + (p.overall_stats.unranked.total_assists || 0)
        ),
        highestTimePlayed: getComparisonStat(
            player1,
            player2,
            (p) => p.overall_stats.ranked.total_time_played_raw || 0
        )
    };
}

interface StatComparison {
    value: number | string;
    fromPlayer: string;
    difference?: number;
}

interface ComparisonResult {
    highestRank: StatComparison;
    highestLevel: StatComparison;
    highestWins: StatComparison;
    highestMatches: StatComparison;
    highestKills: StatComparison;
    highestDeaths: StatComparison;
    highestAssists: StatComparison;
    highestTimePlayed: StatComparison;
}
