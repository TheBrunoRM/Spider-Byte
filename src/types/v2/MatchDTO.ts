export interface MatchDTO {
    readonly data: Data;
}

export interface Data {
    readonly attributes: DataAttributes;
    readonly metadata: DataMetadata;
    readonly segments: Segment[];
    readonly streams: null;
    readonly expiryDate: string;
}

export interface DataAttributes {
    readonly id: string;
    readonly mode: string;
    readonly mapId: number;
}

export interface DataMetadata {
    readonly mapName: string;
    readonly mapModeName: string;
    readonly mapImageUrl: string;
    readonly timestamp: string;
    readonly duration: number;
    readonly modeName: string;
    readonly isRanked: boolean;
    readonly winningTeamId: number;
    readonly scores: null;
    readonly replayId: string;
}

export interface Segment {
    readonly type: SegmentType;
    readonly attributes: SegmentAttributes;
    readonly metadata: SegmentMetadata;
    readonly expiryDate: string;
    readonly stats: Stats;
}

export interface SegmentAttributes {
    readonly accountId: string;
    readonly heroId?: number;
}

export interface SegmentMetadata {
    readonly platformInfo?: PlatformInfo;
    readonly isBot?: boolean;
    readonly result?: MetadataResult;
    readonly outcome?: Outcome;
    readonly isMvp?: boolean;
    readonly isSvp?: boolean;
    readonly teamId?: number;
    readonly heroes?: Hero[];
    readonly name?: string;
    readonly imageUrl?: string;
    readonly color?: string;
    readonly roleName?: RoleName;
}

export interface Hero {
    readonly heroId: number;
    readonly name: string;
    readonly imageUrl: string;
}

export interface Outcome {
    readonly result: OutcomeResult;
    readonly type: OutcomeType;
}

export enum OutcomeResult {
    Loss = 'Loss',
    Win = 'Win'
}

export enum OutcomeType {
    Discrete = 'Discrete'
}

export interface PlatformInfo {
    readonly platformSlug: PlatformSlug;
    readonly platformUserId: null;
    readonly platformUserHandle: string;
    readonly platformUserIdentifier: string;
    readonly avatarUrl: string | null;
    readonly additionalParameters: null;
}

export enum PlatformSlug {
    Ign = 'ign'
}

export enum MetadataResult {
    Loss = 'loss',
    Win = 'win'
}

export enum RoleName {
    Duelist = 'Duelist',
    Strategist = 'Strategist',
    Vanguard = 'Vanguard'
}

export interface Stats {
    readonly timePlayed: TimePlayed;
    readonly kills: Kills;
    readonly deaths: Deaths;
    readonly assists: Assists;
    readonly kdRatio: KdRatio;
    readonly kdaRatio: KdaRatio;
    readonly totalHeroDamage: TotalHeroDamage;
    readonly totalHeroDamagePerMinute: TotalHeroDamagePerMinute;
    readonly totalHeroHeal: TotalHeroHeal;
    readonly totalHeroHealPerMinute: TotalHeroHealPerMinute;
    readonly totalDamageTaken: TotalDamageTaken;
    readonly totalDamageTakenPerMinute: TotalDamageTakenPerMinute;
    readonly lastKills: LastKills;
    readonly headKills: HeadKills;
    readonly soloKills: SoloKills;
    readonly sessionHitRate: SessionHitRate;
    readonly maxSurvivalKills?: SurvivalKills;
    readonly maxContinueKills?: ContinueKills;
    readonly maxContinueWins?: MaxContinueWins;
    readonly continueKills3: ContinueKills3;
    readonly continueKills4: ContinueKills4;
    readonly continueKills5: ContinueKills5;
    readonly continueKills6: ContinueKills6;
    readonly mainAttacks: MainAttacks;
    readonly mainAttackHits: MainAttackHits;
    readonly shieldHits: ShieldHits;
    readonly summonerHits: SummonerHits;
    readonly chaosHits: ChaosHits;
    readonly heroSessionHitRate?: HeroSessionHitRate;
    readonly heroMainAttacks?: HeroMainAttacks;
    readonly heroMainAttackHits?: HeroMainAttackHits;
    readonly heroShieldHits?: HeroShieldHits;
    readonly heroSummonerHits?: HeroSummonerHits;
    readonly heroChaosHits?: HeroChaosHits;
    readonly featureNormalData1: FeatureNormalData1;
    readonly featureNormalData2: FeatureNormalData2;
    readonly featureNormalData3: FeatureNormalData3;
    readonly featureCriticalRate1CritHits: FeatureCriticalRate1CritHits;
    readonly featureCriticalRate1Hits: FeatureCriticalRate1Hits;
    readonly featureCriticalRate2CritHits: FeatureCriticalRate2CritHits;
    readonly featureCriticalRate2Hits: FeatureCriticalRate2Hits;
    readonly featureHitRate1UseCount: FeatureHitRate1UseCount;
    readonly featureHitRate1RealHitHeroCount: FeatureHitRate1RealHitHeroCount;
    readonly featureHitRate1ChaosHits: FeatureHitRate1ChaosHits;
    readonly featureHitRate1AllyHits: FeatureHitRate1AllyHits;
    readonly featureHitRate1HeroHits: FeatureHitRate1HeroHits;
    readonly featureHitRate1EnemyHits: FeatureHitRate1EnemyHits;
    readonly featureHitRate1ShieldHits: FeatureHitRate1ShieldHits;
    readonly featureHitRate1SummonerHits: FeatureHitRate1SummonerHits;
    readonly featureSpecialData1Total: FeatureSpecialData1Total;
    readonly featureSpecialData1Value: FeatureSpecialData1Value;
    readonly sessionSurvivalKills?: SurvivalKills;
    readonly sessionContinueKills?: ContinueKills;
    readonly featureCriticalRate1?: FeatureCriticalRate1;
    readonly featureHitRate1?: FeatureHitRate1;
    readonly featureCriticalRate2?: FeatureCriticalRate2;
    readonly featureSpecialData1?: FeatureSpecialData1;
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
    Combat = 'combat'
}

export enum AssistsDisplayCategory {
    Combat = 'Combat'
}

export enum AssistsDisplayName {
    Assists = 'Assists'
}

export enum AssistsDisplayType {
    Number = 'Number'
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

export interface FeatureCriticalRate1 {
    readonly displayName: string;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: string;
}

export enum FeatureCriticalRate1Category {
    Feature = 'feature',
    HeroFeature = 'heroFeature'
}

export interface FeatureCriticalRate1CritHits {
    readonly displayName: FeatureCriticalRate1CritHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
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
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate1HitsDisplayName {
    FeatureCriticalRate1Hits = 'Feature Critical Rate 1 Hits'
}

export interface FeatureCriticalRate2 {
    readonly displayName: string;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: string;
}

export interface FeatureCriticalRate2CritHits {
    readonly displayName: FeatureCriticalRate2CritHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate2CritHitsDisplayName {
    FeatureCriticalRate2CritHits = 'Feature Critical Rate 2 Crit Hits'
}

export interface FeatureCriticalRate2Hits {
    readonly displayName: FeatureCriticalRate2HitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureCriticalRate2HitsDisplayName {
    FeatureCriticalRate2Hits = 'Feature Critical Rate 2 Hits'
}

export interface FeatureHitRate1 {
    readonly displayName: string;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: FeatureHitRate1DisplayType;
}

export enum FeatureHitRate1DisplayType {
    NumberPrecision2 = 'NumberPrecision2'
}

export interface FeatureHitRate1AllyHits {
    readonly displayName: FeatureHitRate1AllyHitsDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureHitRate1UseCountDisplayName {
    FeatureHitRate1UseCount = 'Feature Hit Rate 1 Use Count'
}

export interface FeatureNormalData1 {
    readonly displayName: string;
    readonly displayCategory?: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export interface FeatureNormalData2 {
    readonly displayName: string;
    readonly displayCategory?: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export interface FeatureNormalData3 {
    readonly displayName: FeatureNormalData3DisplayName;
    readonly displayCategory?: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum FeatureNormalData3DisplayName {
    EternalBondHealing = 'Eternal Bond Healing',
    FeatureNormalData3 = 'Feature Normal Data 3',
    OmegaHurricaneKOs = 'Omega Hurricane KOs'
}

export interface FeatureSpecialData1 {
    readonly displayName: string;
    readonly category: FeatureCriticalRate1Category;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: FeatureHitRate1DisplayType;
}

export interface FeatureSpecialData1Total {
    readonly displayName: FeatureSpecialData1TotalDisplayName;
    readonly displayCategory: FeatureCriticalRate1CritHitsDisplayCategory;
    readonly category: FeatureCriticalRate1Category;
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
    readonly category: FeatureCriticalRate1Category;
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

export interface HeroChaosHits {
    readonly displayName: HeroChaosHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroChaosHitsDisplayName {
    HeroChaosHits = 'Hero Chaos Hits'
}

export interface HeroMainAttackHits {
    readonly displayName: HeroMainAttackHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroMainAttackHitsDisplayName {
    HeroMainAttackHits = 'Hero Main Attack Hits'
}

export interface HeroMainAttacks {
    readonly displayName: HeroMainAttacksDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroMainAttacksDisplayName {
    HeroMainAttacks = 'Hero Main Attacks'
}

export interface HeroSessionHitRate {
    readonly displayName: HeroSessionHitRateDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroSessionHitRateDisplayName {
    HeroSessionHitRate = 'Hero Session Hit Rate'
}

export interface HeroShieldHits {
    readonly displayName: HeroShieldHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroShieldHitsDisplayName {
    HeroShieldHits = 'Hero Shield Hits'
}

export interface HeroSummonerHits {
    readonly displayName: HeroSummonerHitsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number | null;
    readonly displayValue: string | null;
    readonly displayType: AssistsDisplayType;
}

export enum HeroSummonerHitsDisplayName {
    HeroSummonerHits = 'Hero Summoner Hits'
}

export interface KdRatio {
    readonly displayName: KdRatioDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: FeatureHitRate1DisplayType;
}

export enum KdRatioDisplayName {
    KDRatio = 'K/D Ratio'
}

export interface KdaRatio {
    readonly displayName: KdaRatioDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: FeatureHitRate1DisplayType;
}

export enum KdaRatioDisplayName {
    KDARatio = 'KDA Ratio'
}

export interface Kills {
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

export interface ContinueKills {
    readonly displayName: MaxContinueKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MaxContinueKillsDisplayName {
    ContinueKills = 'Continue Kills'
}

export interface MaxContinueWins {
    readonly displayName: MaxContinueWinsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MaxContinueWinsDisplayName {
    Continuewins = 'Continue wins'
}

export interface SurvivalKills {
    readonly displayName: MaxSurvivalKillsDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum MaxSurvivalKillsDisplayName {
    SurvivalKills = 'Survival Kills'
}

export interface SessionHitRate {
    readonly displayName: SessionHitRateDisplayName;
    readonly displayCategory: AssistsDisplayCategory;
    readonly category: AssistsCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum SessionHitRateDisplayName {
    SessionHitRate = 'Session Hit Rate'
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

export interface TimePlayed {
    readonly displayName: TimePlayedDisplayName;
    readonly displayCategory: TimePlayedDisplayCategory;
    readonly category: TimePlayedCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: TimePlayedDisplayType;
}

export enum TimePlayedCategory {
    Game = 'game'
}

export enum TimePlayedDisplayCategory {
    Game = 'Game'
}

export enum TimePlayedDisplayName {
    TimePlayed = 'Time Played'
}

export enum TimePlayedDisplayType {
    TimeMilliseconds = 'TimeMilliseconds'
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
    Damage = 'damage'
}

export enum TotalDamageTakenDisplayCategory {
    Damage = 'Damage'
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
    readonly displayName: TotalHeroHealPerMinuteDisplayNameEnum;
    readonly displayCategory: TotalDamageTakenDisplayCategory;
    readonly category: TotalDamageTakenCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalHeroHealPerMinuteDisplayNameEnum {
    Healing = 'Healing'
}

export interface TotalHeroHealPerMinute {
    readonly displayName: TotalHeroHealPerMinuteDisplayName;
    readonly displayCategory: TotalHeroHealPerMinuteDisplayNameEnum;
    readonly category: TotalHeroHealPerMinuteCategory;
    readonly metadata: AssistsMetadata;
    readonly value: number;
    readonly displayValue: string;
    readonly displayType: AssistsDisplayType;
}

export enum TotalHeroHealPerMinuteCategory {
    Healing = 'healing'
}

export enum TotalHeroHealPerMinuteDisplayName {
    HealingMin = 'Healing/Min'
}

export enum SegmentType {
    Hero = 'hero',
    Player = 'player'
}
