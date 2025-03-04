import type { MovementSpeed } from './HeroesDTO';
export interface HeroDTO {
  readonly id: string;
  readonly name: string;
  readonly real_name: string;
  readonly imageUrl: string;
  readonly badges: Badges;
  readonly ko?: Ko;
  readonly story_card?: string;
  readonly hero_card?: string;
  readonly role: string;
  readonly attack_type: string;
  readonly team: string[];
  readonly difficulty: string;
  readonly bio: string;
  readonly lore: string;
  readonly lore_card?: string;
  readonly transformations: Transformation[];
  readonly costumes: Costume[];
  readonly abilities: Ability[];
}

export interface Ability {
  readonly id: number;
  readonly icon: string;
  readonly name?: string;
  readonly type: string;
  readonly isCollab: boolean;
  readonly description?: string;
  readonly additional_fields?: Record<string, string>;
  readonly transformation_id: string;
}

export interface Badges {
  readonly gold?: string;
  readonly silver?: string;
}

export interface Costume {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly quality: string;
  readonly description: string;
  readonly appearance: string;
}

export interface Ko {
  readonly prompt_1?: string;
  readonly prompt_2?: string;
}

export interface Transformation {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly health: string | null;
  readonly movement_speed: MovementSpeed | null;
}
