export interface PatchNotesDTO {
    readonly total_patches: number;
    readonly formatted_patches: FormattedPatch[];
}

export interface FormattedPatch {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly overview: string;
    readonly fullContent: string;
    readonly imagePath: string;
}
