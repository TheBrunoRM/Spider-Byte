export interface HeroesDTO {
  readonly id: string;
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
  readonly icon?: string;
  readonly name?: string;
  readonly type: Type;
  readonly isCollab: boolean;
  readonly description?: string;
  readonly additional_fields?: Record<string, string>;
  readonly transformation_id: string;
}

export enum Type {
  Normal = 'Normal',
  Passive = 'Passive',
  Ultimate = 'Ultimate',
  Weapon = 'Weapon',
  Movement = 'Movement'
}

export enum AttackType {
  HitscanHeroes = 'Hitscan Heroes',
  MeleeHeroes = 'Melee Heroes',
  Projectile = 'Projectile'
}

export interface Costume {
  readonly id: string;
  readonly name: string;
  readonly icon: string | null;
  readonly quality: Quality;
  readonly description: string;
  readonly appearance: string;
}

export enum Quality {
  Blue = 'BLUE',
  NoQuality = 'NO_QUALITY',
  Orange = 'ORANGE',
  Purple = 'PURPLE'
}

export enum Role {
  Duelist = 'Duelist',
  Strategist = 'Strategist',
  Vanguard = 'Vanguard'
}

export interface Transformation {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly health: string | null;
  readonly movement_speed: string | null;
}
