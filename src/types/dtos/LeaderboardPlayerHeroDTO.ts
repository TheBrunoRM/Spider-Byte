export interface LeaderboardPlayerHeroDTO {
    _id?: number;
    players: Player[];
}

export interface Player {
    info: Info;
    player_uid: number;
    matches: number;
    wins: number;
    kills: number;
    deaths: number;
    assists: number;
    play_time: string;
    total_hero_damage: string;
    total_damage_taken: string;
    total_hero_heal: string;
    mvps: number;
    svps: number;
}

export interface Info {
    name: string;
    cur_head_icon_id: string;
    rank_season: RankSeason;
    login_os: string;
}

export interface RankSeason {
    // rank_game_id: number;
    level?: number;
    // rank_score: string;
    // max_level: number;
    // max_rank_score: string;
    // update_time: number;
    // win_count: number;
    // protect_score: number;
    // diff_score: string;
}
