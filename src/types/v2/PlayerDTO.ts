export interface PlayerDTO {
    readonly data: Data;
}

export interface Data {
    readonly platformInfo: PlatformInfo;
    readonly userInfo: UserInfo;
    readonly metadata: DataMetadata;
    readonly segments: Segment[];
    readonly availableSegments: any[];
    readonly expiryDate: string;
}

export interface DataMetadata {
    readonly lastUpdated: LastUpdated;
    readonly isPC: boolean;
    readonly clubMiniName: string | null;
    readonly isPrivateCareerOverview: boolean;
    readonly isPrivateCareerStatistics: boolean;
    readonly isPrivateBattleHistory: boolean;
    readonly level: number;
    readonly gamemodes: Gamemode[];
    readonly currentSeason: number;
    readonly defaultSeason: number;
    readonly seasons: Season[];
}

export interface Gamemode {
    readonly id: string;
    readonly name: string;
}

export interface LastUpdated {
    readonly value: string;
    readonly displayValue: string;
}

export interface Season {
    readonly id: number;
    readonly name: string;
    readonly shortName: string;
}

export interface PlatformInfo {
    readonly platformSlug: string;
    readonly platformUserId: null;
    readonly platformUserHandle: string;
    readonly platformUserIdentifier: string;
    readonly avatarUrl: string;
    readonly additionalParameters: null;
}

export interface BaseSegment<T extends Type, M extends Record<string, unknown>> {
    readonly type: T;
    readonly attributes: Attributes;
    readonly metadata: M;
    readonly expiryDate: string;
    readonly stats: Stats;
}

export interface RankedPeaksSegment extends BaseSegment<'ranked-peaks', {}> { }
export interface OverviewSegment extends BaseSegment<'overview', Pick<SegmentMetadata, 'name'>> { }
export interface HeroSegment extends BaseSegment<'hero', Pick<SegmentMetadata, 'imageUrl' | 'roleName' | 'color' | 'name'>> { }
export interface HeroRoleSegment extends BaseSegment<'hero-role', Pick<SegmentMetadata, 'imageUrl' | 'name'>> { }

export type Segment = RankedPeaksSegment | OverviewSegment | HeroRoleSegment | HeroSegment;

export interface Attributes {
    readonly season?: number;
    readonly mode?: Mode;
    readonly heroId?: number;
    readonly role?: Role;
    readonly roleId?: Role;
}

export enum Mode {
    All = 'all'
}

export enum Role {
    Duelist = 'duelist',
    Strategist = 'strategist',
    Vanguard = 'vanguard'
}

export interface SegmentMetadata {
    readonly name: string;
    readonly imageUrl: string;
    readonly roleName: RoleName;
    readonly color: string;
}

export enum RoleName {
    Duelist = 'Duelist',
    Strategist = 'Strategist',
    Vanguard = 'Vanguard'
}

export interface Stats {
    readonly timePlayed?: TimePlayed;
    readonly matchesPlayed?: MatchesPlayed;
    readonly matchesWon?: MatchesWon;
    readonly matchesWinPct?: MatchesWinPct;
    readonly kills?: Kills;
    readonly deaths?: Deaths;
    readonly assists?: Assists;
    readonly kdRatio?: KdRatio;
    readonly kdaRatio?: KdaRatio;
    readonly totalHeroDamage?: TotalHeroDamage;
    readonly totalHeroDamagePerMinute?: TotalHeroDamagePerMinute;
    readonly totalHeroHeal?: TotalHeroHeal;
    readonly totalHeroHealPerMinute?: TotalHeroHealPerMinute;
    readonly totalDamageTaken?: TotalDamageTaken;
    readonly totalDamageTakenPerMinute?: TotalDamageTakenPerMinute;
    readonly lastKills?: LastKills;
    readonly headKills?: HeadKills;
    readonly soloKills?: SoloKills;
    readonly maxSurvivalKills?: MaxKills;
    readonly maxContinueKills?: MaxKills;
    readonly continueKills3?: ContinueKills3;
    readonly continueKills4?: ContinueKills4;
    readonly continueKills5?: ContinueKills5;
    readonly continueKills6?: ContinueKills6;
    readonly mainAttacks?: MainAttacks;
    readonly mainAttackHits?: MainAttackHits;
    readonly shieldHits?: ShieldHits;
    readonly summonerHits?: SummonerHits;
    readonly chaosHits?: ChaosHits;
    readonly totalMvp?: TotalMvp;
    readonly totalSvp?: TotalSvp;
    readonly ranked?: Ranked;
    readonly peakRanked?: Ranked;
    readonly peakTiers?: PeakTiers;
    readonly lifetimePeakRanked?: LifetimePeakRanked;
    readonly timePlayedWon?: TimePlayedWon;
    readonly survivalKills?: SurvivalKills;
    readonly continueKills?: ContinueKills;
    readonly featureNormalData1?: FeatureNormalData1;
    readonly featureNormalData2?: FeatureNormalData2;
    readonly featureNormalData3?: FeatureNormalData3;
    readonly featureCriticalRate1CritHits?: FeatureCriticalRate1CritHits;
    readonly featureCriticalRate1Hits?: FeatureCriticalRate1Hits;
    readonly featureCriticalRate2CritHits?: FeatureCriticalRate2CritHits;
    readonly featureCriticalRate2Hits?: FeatureCriticalRate2Hits;
    readonly featureHitRate1UseCount?: FeatureHitRate1UseCount;
    readonly featureHitRate1RealHitHeroCount?: FeatureHitRate1RealHitHeroCount;
    readonly featureHitRate1ChaosHits?: FeatureHitRate1ChaosHits;
    readonly featureHitRate1AllyHits?: FeatureHitRate1AllyHits;
    readonly featureHitRate1HeroHits?: FeatureHitRate1HeroHits;
    readonly featureHitRate1EnemyHits?: FeatureHitRate1EnemyHits;
    readonly featureHitRate1ShieldHits?: FeatureHitRate1ShieldHits;
    readonly featureHitRate1SummonerHits?: FeatureHitRate1SummonerHits;
    readonly featureSpecialData1Total?: FeatureSpecialData1Total;
    readonly featureSpecialData1Value?: FeatureSpecialData1Value;
}

export interface Assists {
    readonly displayName: AssistsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum AssistsCategory {
    Combat = 'combat',
    Healing = 'healing'
}

export enum AssistsDisplayCategory {
    Combat = 'Combat',
    Healing = 'Healing'
}

export enum AssistsDisplayName {
    Assists = 'Assists'
}

export enum AssistsDisplayType {
    Number = 'Number',
    NumberPrecision1 = 'NumberPrecision1'
}

export interface AssistsMetadata {
}

export interface ChaosHits {
    readonly displayName: ChaosHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ChaosHitsDisplayName {
    ChaosHits = 'Chaos Hits'
}

export interface ContinueKills {
    readonly displayName: ContinueKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ContinueKillsDisplayName {
    ContinueKills = 'Continue Kills'
}

export interface ContinueKills3 {
    readonly displayName: ContinueKills3DisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ContinueKills3DisplayName {
    ContinueKills3 = 'Continue Kills 3'
}

export interface ContinueKills4 {
    readonly displayName: ContinueKills4DisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ContinueKills4DisplayName {
    ContinueKills4 = 'Continue Kills 4'
}

export interface ContinueKills5 {
    readonly displayName: ContinueKills5DisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ContinueKills5DisplayName {
    ContinueKills5 = 'Continue Kills 5'
}

export interface ContinueKills6 {
    readonly displayName: ContinueKills6DisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ContinueKills6DisplayName {
    ContinueKills6 = 'Continue Kills 6'
}

export interface Deaths {
    readonly displayName: DeathsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum DeathsDisplayName {
    Deaths = 'Deaths'
}

export interface FeatureCriticalRate1CritHits {
    readonly displayName: FeatureCriticalRate1CritHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate1CritHitsCategory {
    Feature = 'feature'
}

export enum FeatureCriticalRate1CritHitsDisplayCategory {
    Feature = 'Feature'
}

export enum FeatureCriticalRate1CritHitsDisplayName {
    FeatureCriticalRate1CritHits = 'Feature Critical Rate 1 Crit Hits'
}

export interface FeatureCriticalRate1Hits {
    readonly displayName: FeatureCriticalRate1HitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate1HitsDisplayName {
    FeatureCriticalRate1Hits = 'Feature Critical Rate 1 Hits'
}

export interface FeatureCriticalRate2CritHits {
    readonly displayName: FeatureCriticalRate2CritHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: null;
    readonly displayValue: null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate2CritHitsDisplayName {
    FeatureCriticalRate2CritHits = 'Feature Critical Rate 2 Crit Hits'
}

export interface FeatureCriticalRate2Hits {
    readonly displayName: FeatureCriticalRate2HitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: null;
    readonly displayValue: null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate2HitsDisplayName {
    FeatureCriticalRate2Hits = 'Feature Critical Rate 2 Hits'
}

export interface FeatureHitRate1AllyHits {
    readonly displayName: FeatureHitRate1AllyHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1AllyHitsDisplayName {
    FeatureHitRate1AllyHits = 'Feature Hit Rate 1 Ally Hits'
}

export interface FeatureHitRate1ChaosHits {
    readonly displayName: FeatureHitRate1ChaosHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1ChaosHitsDisplayName {
    FeatureHitRate1ChaosHits = 'Feature Hit Rate 1 Chaos Hits'
}

export interface FeatureHitRate1EnemyHits {
    readonly displayName: FeatureHitRate1EnemyHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1EnemyHitsDisplayName {
    FeatureHitRate1EnemyHits = 'Feature Hit Rate 1 Enemy Hits'
}

export interface FeatureHitRate1HeroHits {
    readonly displayName: FeatureHitRate1HeroHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1HeroHitsDisplayName {
    FeatureHitRate1HeroHits = 'Feature Hit Rate 1 Hero Hits'
}

export interface FeatureHitRate1RealHitHeroCount {
    readonly displayName: FeatureHitRate1RealHitHeroCountDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1RealHitHeroCountDisplayName {
    FeatureHitRate1RealHitHeroCount = 'Feature Hit Rate 1 Real Hit Hero Count'
}

export interface FeatureHitRate1ShieldHits {
    readonly displayName: FeatureHitRate1ShieldHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1ShieldHitsDisplayName {
    FeatureHitRate1ShieldHits = 'Feature Hit Rate 1 Shield Hits'
}

export interface FeatureHitRate1SummonerHits {
    readonly displayName: FeatureHitRate1SummonerHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1SummonerHitsDisplayName {
    FeatureHitRate1SummonerHits = 'Feature Hit Rate 1 Summoner Hits'
}

export interface FeatureHitRate1UseCount {
    readonly displayName: FeatureHitRate1UseCountDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1UseCountDisplayName {
    FeatureHitRate1UseCount = 'Feature Hit Rate 1 Use Count'
}

export interface FeatureNormalData1 {
    readonly displayName: FeatureNormalData1DisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureNormalData1DisplayName {
    FeatureNormalData1 = 'Feature Normal Data 1'
}

export interface FeatureNormalData2 {
    readonly displayName: FeatureNormalData2DisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureNormalData2DisplayName {
    FeatureNormalData2 = 'Feature Normal Data 2'
}

export interface FeatureNormalData3 {
    readonly displayName: FeatureNormalData3DisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureNormalData3DisplayName {
    FeatureNormalData3 = 'Feature Normal Data 3'
}

export interface FeatureSpecialData1Total {
    readonly displayName: FeatureSpecialData1TotalDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureSpecialData1TotalDisplayName {
    FeatureSpecialData1Total = 'Feature Special Data 1 Total'
}

export interface FeatureSpecialData1Value {
    readonly displayName: FeatureSpecialData1ValueDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1CritHitsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureSpecialData1ValueDisplayName {
    FeatureSpecialData1Value = 'Feature Special Data 1 Value'
}

export interface HeadKills {
    readonly displayName: HeadKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum HeadKillsDisplayName {
    HeadKills = 'Head Kills'
}

export interface KdRatio {
    readonly displayName: KdRatioDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: KdRatioDisplayType;
}

export enum KdRatioDisplayName {
    KDRatio = 'K/D Ratio'
}

export enum KdRatioDisplayType {
    NumberPrecision2 = 'NumberPrecision2'
}

export interface KdaRatio {
    readonly percentile?: number;
    readonly displayName: KdaRatioDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: KdRatioDisplayType;
}

export enum KdaRatioDisplayName {
    KDARatio = 'KDA Ratio'
}

export interface Kills {
    readonly percentile?: number;
    readonly displayName: KillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum KillsDisplayName {
    Kills = 'Kills'
}

export interface LastKills {
    readonly displayName: LastKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum LastKillsDisplayName {
    LastKills = 'Last Kills'
}

export interface LifetimePeakRanked {
    readonly displayName: string;
    readonly category: string;
    readonly metadata: LifetimePeakRankedMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: string;
}

export interface LifetimePeakRankedMetadata {
    readonly unit: string;
    readonly iconUrl: string;
    readonly tierName: string;
    readonly tierShortName: string;
    readonly color: string;
    readonly season: number;
    readonly seasonName: string;
    readonly seasonShortName: string;
}

export interface MainAttackHits {
    readonly displayName: MainAttackHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MainAttackHitsDisplayName {
    MainAttackHits = 'Main Attack Hits'
}

export interface MainAttacks {
    readonly displayName: MainAttacksDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MainAttacksDisplayName {
    MainAttacks = 'Main Attacks'
}

export interface MatchesPlayed {
    readonly displayName: MatchesPlayedDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MatchesPlayedCategory {
    Game = 'game'
}

export enum MatchesPlayedDisplayCategory {
    Game = 'Game'
}

export enum MatchesPlayedDisplayName {
    MatchesPlayed = 'Matches Played'
}

export interface MatchesWinPct {
    readonly percentile?: number;
    readonly displayName: MatchesWinPctDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: MatchesWinPctDisplayType;
}

export enum MatchesWinPctDisplayName {
    Win = 'Win %'
}

export enum MatchesWinPctDisplayType {
    NumberPercentage = 'NumberPercentage'
}

export interface MatchesWon {
    readonly percentile?: number;
    readonly displayName: MatchesWonDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MatchesWonDisplayName {
    Wins = 'Wins'
}

export interface MaxKills {
    readonly displayName: string;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export interface Ranked {
    readonly displayName: string;
    readonly category: string;
    readonly metadata: PeakRankedMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: string;
}

export interface PeakRankedMetadata {
    readonly unit: string;
    readonly iconUrl: string;
    readonly tierName: string;
    readonly tierShortName: string;
    readonly color: string;
}

export interface PeakTiers {
    readonly displayName: string;
    readonly metadata: AssistsMetadata;
    readonly value: Value[];
    readonly displayValue: null;
    readonly displayType: string;
}

export interface Value {
    readonly displayName: string;
    readonly metadata: LifetimePeakRankedMetadata;
    readonly value: number;
    readonly displayValue: null;
    readonly displayType: string;
}

export interface ShieldHits {
    readonly displayName: ShieldHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum ShieldHitsDisplayName {
    ShieldHits = 'Shield Hits'
}

export interface SoloKills {
    readonly displayName: SoloKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum SoloKillsDisplayName {
    SoloKills = 'Solo Kills'
}

export interface SummonerHits {
    readonly displayName: SummonerHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum SummonerHitsDisplayName {
    SummonerHits = 'Summoner Hits'
}

export interface SurvivalKills {
    readonly displayName: SurvivalKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum SurvivalKillsDisplayName {
    SurvivalKills = 'Survival Kills'
}

export interface TimePlayed {
    readonly displayName: TimePlayedDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: TimePlayedDisplayType;
}

export enum TimePlayedDisplayName {
    TimePlayed = 'Time Played'
}

export enum TimePlayedDisplayType {
    TimeSeconds = 'TimeSeconds'
}

export interface TimePlayedWon {
    readonly displayName: TimePlayedWonDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: TimePlayedDisplayType;
}

export enum TimePlayedWonDisplayName {
    TimePlayedWon = 'Time Played Won'
}

export interface TotalDamageTaken {
    readonly displayName: TotalDamageTakenDisplayName;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalDamageTakenCategory {
    Damage = 'damage',
    Healing = 'healing'
}

export enum TotalDamageTakenDisplayCategory {
    Damage = 'Damage',
    Healing = 'Healing'
}

export enum TotalDamageTakenDisplayName {
    DamageBlocked = 'Damage Blocked'
}

export interface TotalDamageTakenPerMinute {
    readonly displayName: TotalDamageTakenPerMinuteDisplayName;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalDamageTakenPerMinuteDisplayName {
    DamageBlockedMin = 'Damage Blocked/Min'
}

export interface TotalHeroDamage {
    readonly displayName: TotalDamageTakenDisplayCategory;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export interface TotalHeroDamagePerMinute {
    readonly displayName: TotalHeroDamagePerMinuteDisplayName;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalHeroDamagePerMinuteDisplayName {
    DamageMin = 'Damage/Min'
}

export interface TotalHeroHeal {
    readonly displayName: AssistsDisplayCategory;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export interface TotalHeroHealPerMinute {
    readonly displayName: TotalHeroHealPerMinuteDisplayName;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalHeroHealPerMinuteDisplayName {
    HealingMin = 'Healing/Min'
}

export interface TotalMvp {
    readonly percentile?: number;
    readonly displayName: TotalMvpDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalMvpDisplayName {
    MVPs = 'MVPs'
}

export interface TotalSvp {
    readonly percentile?: number;
    readonly displayName: TotalSvpDisplayName;
    readonly displayCategory: MatchesPlayedDisplayCategory;
    readonly category: MatchesPlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalSvpDisplayName {
    SVPs = 'SVPs'
}

export type Type =
    'ranked-peaks' |
    'hero-role' |
    'overview' |
    'hero';

export interface UserInfo {
    readonly userId: null;
    readonly isPremium: boolean;
    readonly isVerified: boolean;
    readonly isInfluencer: boolean;
    readonly isPartner: boolean;
    readonly countryCode: null;
    readonly customAvatarUrl: null;
    readonly customHeroUrl: null;
    readonly customAvatarFrame: null;
    readonly customAvatarFrameInfo: null;
    readonly premiumDuration: null;
    readonly socialAccounts: any[];
    readonly pageviews: number;
    readonly xpTier: null;
    readonly isSuspicious: null;
}
