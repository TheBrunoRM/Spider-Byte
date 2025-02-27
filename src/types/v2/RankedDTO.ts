export interface RankedDTO {
    readonly data: Data;
}

export interface Data {
    readonly history: History;
    readonly leaderboard: null;
    readonly expiryDate: string;
    readonly bestMatches: null;
}

export interface History {
    readonly metadata: HistoryMetadata;
    readonly data: [string, DatumClass][];
}

export interface DatumClass {
    readonly metadata: DatumMetadata;
    readonly value: [string, number];
    readonly displayValue: string;
    readonly displayType: DisplayType;
}

export enum DisplayType {
    Array = 'Array'
}

export interface DatumMetadata {
    readonly name: string;
    readonly shortName: string;
    readonly imageUrl: string;
    readonly color: `#${string}`;
}

export interface HistoryMetadata {
    readonly key: string;
    readonly name: string;
    readonly description: string;
}
