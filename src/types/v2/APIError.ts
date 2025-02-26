export interface APIError {
    readonly errors: Error[];
}

export interface Error {
    readonly code: string;
    readonly message: string;
    readonly data: Data;
}

export interface Data {
}
