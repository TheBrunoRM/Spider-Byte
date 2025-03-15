export interface HeroDTO {
  readonly id: string;
  readonly name: string;
  readonly real_name: string;
  readonly imageUrl: string;
  readonly badges: undefined | Badges;
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
  readonly additional_fields: AdditionalFields;
  readonly transformation_id: string;
}

export interface AdditionalFields {
  readonly Key?: string;
  readonly 'Special Effect'?: string;
  readonly Damage?: string;
  readonly Casting?: string;
  readonly 'Attack Range'?: string;
  readonly 'Attack Interval'?: string;
  readonly Cooldown?: string;
  readonly Duration?: string;
  readonly 'Movement Boost'?: string;
  readonly 'Spell Field Range'?: string;
  readonly 'Maximum Distance'?: string;
  readonly Range?: string;
  readonly 'Energy Cost'?: string;
  readonly 'Bonus Max Health'?: string;
  readonly 'Bonus Health Growth'?: string;
}

export interface Badges {
  readonly gold: string;
  readonly silver: string;
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
  readonly prompt_1: string;
  readonly prompt_2: string;
}

export interface Transformation {
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly health: string;
  readonly movement_speed: string;
}
