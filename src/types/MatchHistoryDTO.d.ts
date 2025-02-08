export interface MatchHistoryDTO {
  match_history: MatchHistory[];
}

export interface MatchHistory {
  match_map_id: number;
  map_thumbnail: string;
  match_play_duration: number;
  match_season: number;
  match_uid: string;
  match_winner_side: number;
  mvp_uid: number;
  svp_uid: number;
  score_info: MatchHistoryScoreInfo;
  match_time_stamp: number;
  play_mode_id: number;
  game_mode_id: number;
  match_player: MatchPlayer;
}

export interface MatchPlayer {
  assists: number;
  kills: number;
  deaths: number;
  is_win: boolean | number;
  disconnected: boolean;
  player_uid: number;
  camp: number | null;
  score_info: MatchPlayerScoreInfo;
  player_hero: PlayerHero;
}

export interface PlayerHero {
  hero_id: number;
  hero_name: string;
  hero_type: string;
  kills: number;
  deaths: number;
  assists: number;
  play_time: number;
  total_hero_damage: number;
  total_damage_taken: number;
  total_hero_heal: number;
}

export interface MatchPlayerScoreInfo {
  add_score: number | null;
  level: number | null;
  new_level: number | null;
  new_score: number | null;
}

export interface MatchHistoryScoreInfo {
  '0'?: number;
  '1'?: number;
}
