export interface XeroHeroeDTO {
    readonly name: string;
    readonly fullName: string;
    readonly role: string;
    readonly difficulty: number;
    readonly stats: XeroHeroeDTOStats;
    readonly lore: Lore;
    readonly images: Images;
    readonly abilities: Ability[];
}

export interface Ability {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly description: string;
    readonly stats: AbilityStats;
}

export interface AbilityStats {
    readonly Key: string;
    readonly Casting?: string;
    readonly 'Special Effect'?: string;
    readonly Damage?: string;
    readonly Range?: string;
    readonly Ammo?: string;
    readonly 'Critical Hit'?: string;
    readonly 'Healing Amount'?: string;
    readonly Duration?: string;
    readonly 'Energy Cost'?: string;
    readonly 'Blinding Duration'?: string;
    readonly Vulnerability?: string;
    readonly 'Vulnerability Duration'?: string;
    readonly 'Movement Speed'?: string;
    readonly 'Maximum Distance'?: string;
    readonly Cooldown?: string;
    readonly 'Team-up Bonus'?: string;
    readonly 'Healing Per Hit'?: string;
    readonly 'Area of Effect Healing'?: string;
    readonly 'Fire Rate'?: string;
    readonly 'Healing Boost'?: string;
}

export interface Images {
    readonly card: string;
    readonly base: string[];
    readonly playerheads: string[];
    readonly nameplates: string[];
    readonly lordIcons: string[];
    readonly costumes: Costume[];
}

export interface Costume {
    readonly name: string;
    readonly description: string;
    readonly price: Price;
    readonly source: Source;
    readonly image: string | null;
}

export interface Price {
    readonly amount: string;
}

export interface Source {
    readonly name: string;
    readonly date: string;
    readonly uuid: string;
    readonly season: string;
    readonly quality: string;
}

export interface Lore {
    readonly description: string;
    readonly fullLore: string;
}

export interface XeroHeroeDTOStats {
    readonly base: Base;
    readonly competive: Competive;
}

export interface Base {
    readonly Health: string;
    readonly 'Movement Speed': string;
}

export interface Competive {
    readonly matches: number;
    readonly wins: number;
    readonly bans: number;
    readonly winRate: string;
}
