import type { PlayerDTO } from '../../types/dtos/PlayerDTO';

const ranks = [
    'Unranked', // 0
    'Bronze III', 'Bronze II', 'Bronze I',
    'Silver III', 'Silver II', 'Silver I',
    'Gold III', 'Gold II', 'Gold I',
    'Platinum III', 'Platinum II', 'Platinum I',
    'Diamond III', 'Diamond II', 'Diamond I',
    'Grandmaster III', 'Grandmaster II', 'Grandmaster I',
    'Celestial III', 'Celestial II', 'Celestial I',
    'Eternity', 'One Above All'
] as const;

type Rank = typeof ranks[number];

const rankMap = new Map(ranks.map((rank, index) => [rank, index]));

function getMaxNumber(val1?: number, val2?: number): number {
    return Math.max(val1 || 0, val2 || 0);
}

function getRankValue(rank?: Rank): number {
    return rank
        ? rankMap.get(rank) || 0
        : 0;
}

function getMaxRank(rank1?: Rank, rank2?: Rank): Rank {
    const rankValue1 = getRankValue(rank1);
    const rankValue2 = getRankValue(rank2);
    return rankValue1 >= rankValue2
        ? rank1 ?? 'Unranked'
        : rank2 ?? 'Unranked';
}

function getComparisonStat(
    player1: PlayerDTO,
    player2: PlayerDTO,
    statAccessor: (player: PlayerDTO) => undefined | number
): StatComparison {
    const value1 = statAccessor(player1) || 0;
    const value2 = statAccessor(player2) || 0;
    const maxValue = getMaxNumber(value1, value2);
    return {
        value: maxValue,
        fromPlayer: maxValue === value1
            ? player1.player.name
            : player2.player.name,
        difference: Math.abs(value1 - value2)
    };
}

export function comparePlayers(player1: PlayerDTO, player2: PlayerDTO): ComparisonResult {
    const maxRank = getMaxRank(player1.player.rank.rank as Rank, player2.player.rank.rank as Rank);
    return {
        highestRank: {
            value: maxRank,
            fromPlayer: maxRank === player1.player.rank.rank
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
