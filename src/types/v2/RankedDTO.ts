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
    readonly data: (DatumClass | string)[][];
}

export interface DatumClass {
    readonly metadata: DatumMetadata;
    readonly value: (number | string)[];
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
    readonly color: Color;
}

export enum Color {
    A7693F = '#A7693F',
    Ffda57 = '#FFDA57',
    The7B9196 = '#7B9196'
}

export interface HistoryMetadata {
    readonly key: string;
    readonly name: string;
    readonly description: string;
}
