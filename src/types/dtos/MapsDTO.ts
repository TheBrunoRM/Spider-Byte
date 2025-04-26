
export interface MapsDTO {
    readonly total_maps: number;
    readonly maps: MapDTO[];
}

export interface MapDTO {
    readonly id: number;
    readonly name: string;
    readonly full_name: string;
    readonly location: string;
    readonly description?: string;
    readonly game_mode: string;
    readonly is_competitve: boolean;
    readonly sub_map: SubMap;
    readonly video: string | null;
    readonly images: string[];
}

export interface SubMap {
    readonly id: number | null;
    readonly name: string | null;
    readonly thumbnail: string | null;
}
