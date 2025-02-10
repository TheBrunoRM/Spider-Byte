export interface MatchDTO {
    match_details: MatchDetails;
}

export interface MatchDetails {
    match_uid: string;
    game_mode: GameMode;
    replay_id: string;
    mvp_uid: number;
    mvp_hero_id: number;
    svp_uid: number;
    svp_hero_id: number;
    dynamic_fields: DynamicFields;
    match_players: MatchPlayer[];
}

export interface DynamicFields {
}

export interface GameMode {
    game_mode_id: number;
    game_mode_name: string;
}

export interface MatchPlayer {
    player_uid: number;
    nick_name: string;
    player_icon: number;
    camp: number;
    cur_hero_id: number;
    cur_hero_icon: string;
    is_win: number;
    kills: number;
    deaths: number;
    assists: number;
    total_hero_damage: number;
    total_hero_heal: number;
    total_damage_taken: number;
    player_heroes: PlayerHero[];
}

export interface PlayerHero {
    hero_id: number;
    play_time: number;
    kills: number;
    deaths: number;
    assists: number;
    session_hit_rate: number;
    hero_icon: string;
}
