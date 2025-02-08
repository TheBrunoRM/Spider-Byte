export interface PlayerDTO {
  uid: number;
  name: string;
  updates: Updates;
  player: Player;
  isPrivate: boolean;
  overall_stats: OverallStats;
  match_history: MatchHistory[];
  rank_history: RankHistory[];
  hero_matchups: HeroMatchup[];
  team_mates: TeamMate[];
  heroes_ranked: HeroesRanked[];
  heroes_unranked: HeroesRanked[];
  maps: Map[];
}

export interface HeroMatchup {
  hero_id: number;
  hero_name: string;
  hero_class: string;
  hero_thumbnail: string;
  matches: number;
  wins: number;
  win_rate: string;
}

export interface HeroesRanked {
  hero_id: number;
  hero_name: string;
  matches: number;
  wins: number;
  mvp: number;
  svp: number;
  kills: number;
  deaths: number;
  assists: number;
  play_time: number;
  damage: number;
  heal: number;
  damage_taken: number;
  main_attack: MainAttack;
}

export interface MainAttack {
  total: number;
  hits: number;
}

export interface Map {
  map_id: number;
  map_thumbnail: string;
  matches: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  play_time: number;
}

export interface MatchHistory {
  match_uid: string;
  map_id: number;
  map_thumbnail: string;
  duration: number;
  season: number;
  winner_side: number;
  mvp_uid: number;
  svp_uid: number;
  match_time_stamp: number;
  play_mode_id: number;
  game_mode_id: number;
  score_info: ScoreInfo;
  player_performance: PlayerPerformance;
}

export interface PlayerPerformance {
  player_uid: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  is_win: number;
  disconnected: boolean;
  camp: number;
  score_change: number | null;
  level: number | null;
  new_level: number | null;
  new_score: number | null;
}

export interface ScoreInfo {
  '0'?: number;
  '1'?: number;
}

export interface OverallStats {
  total_matches: number;
  total_wins: number;
  unranked: Ranked;
  ranked: Ranked;
}

export interface Ranked {
  total_matches: number;
  total_wins: number;
  total_assists: number;
  total_deaths: number;
  total_kills: number;
  total_time_played: string;
}

export interface Player {
  uid: number;
  level: string;
  name: string;
  rank: Rank;
  team: Team;
  info: Info;
}

export interface Info {
  completed_achievements: string;
  login_os: string;
  rank_game_season: RankGameSeason;
}

export interface RankGameSeason {
  '1001001': The1001001;
}

export interface The1001001 {
  rank_game_id: number;
  level: number;
  rank_score: number;
  max_level: number;
  max_rank_score: number;
  update_time: number;
  win_count: number;
  protect_score: number;
  diff_score: number;
}

export interface Rank {
  rank: string;
  image: null;
  color: null;
}

export interface Team {
  club_team_id: string;
  club_team_mini_name: string;
  club_team_type: string;
}

export interface RankHistory {
  match_time_stamp: number;
  level_progression: LevelProgression;
  score_progression: ScoreProgression;
}

export interface LevelProgression {
  from: number;
  to: number;
}

export interface ScoreProgression {
  add_score: number;
  total_score: number;
}

export interface TeamMate {
  player_info: PlayerInfo;
  matches: number;
  wins: number;
  win_rate: string;
}

export interface PlayerInfo {
  nick_name: string;
  player_icon: string;
  player_uid: number;
}

export interface Updates {
  info_update_time: string;
  last_history_update: null;
  last_inserted_match: null;
  last_update_request: null;
}
