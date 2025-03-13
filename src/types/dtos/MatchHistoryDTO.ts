export interface MatchHistoryDTO {
  readonly match_history: MatchHistory[];
}

export interface MatchHistory {
  readonly match_map_id: number;
  readonly map_thumbnail?: string;
  readonly match_play_duration: number;
  readonly match_season: string;
  readonly match_uid: string;
  readonly match_winner_side: number;
  readonly mvp_uid: number;
  readonly svp_uid: number;
  readonly score_info: Record<string, number> | null;
  readonly match_time_stamp: number;
  readonly play_mode_id: number;
  readonly game_mode_id: number;
  readonly match_player: MatchPlayer;
}

export interface MatchPlayer {
  readonly assists: number;
  readonly kills: number;
  readonly deaths: number;
  readonly is_win: IsWin;
  readonly disconnected: boolean;
  readonly player_uid: number;
  readonly camp: number | null;
  readonly score_info: ScoreInfo;
  readonly player_hero: PlayerHero;
}

export interface IsWin {
  readonly score: number;
  readonly is_win: boolean;
}

export interface PlayerHero {
  readonly hero_id: number;
  readonly hero_name: string;
  readonly hero_type: string;
  readonly kills: number;
  readonly deaths: number;
  readonly assists: number;
  readonly play_time: number;
  readonly total_hero_damage: number;
  readonly total_damage_taken: number;
  readonly total_hero_heal: number;
}

export interface ScoreInfo {
  readonly add_score: number | null;
  readonly level: number | null;
  readonly new_level: number | null;
  readonly new_score: number | null;
}
