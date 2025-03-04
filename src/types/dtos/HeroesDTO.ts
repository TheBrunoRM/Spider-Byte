export interface HeroesDTO {
  readonly id: number;
  readonly name: string;
  readonly real_name: string;
  readonly imageUrl: string;
  readonly role: Role;
  readonly attack_type: AttackType;
  readonly team: string[];
  readonly difficulty: string;
  readonly bio: string;
  readonly lore: string;
  readonly transformations: Transformation[];
  readonly costumes: Costume[];
  readonly abilities: Ability[];
}

export interface Ability {
  readonly id: number;
  readonly name: string;
  readonly icon: string;
  readonly type: Type;
  readonly isCollab: boolean;
  readonly additional_fields?: Record<string, string>;
}

export enum Type {
  Normal = 'Normal',
  Passive = 'Passive',
  Ultimate = 'Ultimate',
  Weapon = 'Weapon'
}

export enum AttackType {
  HitscanHeroes = 'Hitscan Heroes',
  MeleeHeroes = 'Melee Heroes',
  ProjectileHeroes = 'Projectile Heroes'
}

export interface Costume {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
  readonly quality: Quality;
  readonly description: string;
  readonly appearance: string;
}

export interface Quality {
  readonly name: Name;
  readonly color: Color;
  readonly value: number;
  readonly icon: Icon;
}

export enum Color {
  Gray = 'gray'
}

export enum Icon {
  CostumesRarityQuality1png = '/costumes/rarity/quality_1.png'
}

export enum Name {
  Default = 'Default'
}

export enum Role {
  Duelist = 'Duelist',
  Strategist = 'Strategist',
  Vanguard = 'Vanguard'
}

export interface Transformation {
  readonly id: number;
  readonly name: string;
  readonly icon: string;
  readonly health: string | null;
  readonly movement_speed: MovementSpeed | null;
}

export enum MovementSpeed {
  MovementSpeed6MS = '6 m/s',
  The0MS = '0 m/s',
  The6MS = '6m/s',
  The7MS = '7m/s'
}
