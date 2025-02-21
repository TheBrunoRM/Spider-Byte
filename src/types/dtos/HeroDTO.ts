export interface HeroDTO {
  readonly id: string;
  readonly name: string;
  readonly real_name: string;
  readonly imageUrl: string;
  readonly badges: Badges;
  readonly ko: Ko;
  readonly story_card: string;
  readonly hero_card: string;
  readonly role: string;
  readonly attack_type: string;
  readonly team: string[];
  readonly difficulty: string;
  readonly bio: string;
  readonly lore: string;
  readonly lore_card: string;
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
  readonly "Special Mechanic"?: string;
  readonly Kick?: string;
  readonly Punch?: string;
  readonly Damage?: string;
  readonly Casting?: string;
  readonly "Attack Interval"?: string;
  readonly "Maximum Distance"?: string;
  readonly Charges?: string;
  readonly "Critical Hit"?: string;
  readonly "Damage Falloff"?: string;
  readonly "Recharge Speed"?: string;
  readonly "Projectile Speed"?: string;
  readonly "Spider-Tracer Damage"?: string;
  readonly "Spider-Tracer Duration"?: string;
  readonly Cooldown?: string;
  readonly "Kick Damage"?: string;
  readonly "Kicking Distance"?: string;
  readonly "Projectile Damage"?: string;
  readonly Range?: string;
  readonly Duration?: string;
  readonly "Energy Cost"?: string;
  readonly "Slow Effect"?: string;
  readonly "Slow Duration"?: string;
  readonly "Stun Duration"?: string;
  readonly "Special Effect"?: string;
  readonly "Bonus Health (Self)"?: string;
  readonly "Hits Required to Stun"?: string;
  readonly "Disappearance Time To Trigger Detection"?: string;
  readonly "Maximum Webbing Length"?: string;
  readonly "Sprinting Speed"?: string;
  readonly "Wall-Crawling Speed"?: string;
  readonly Health?: string;
  readonly "Movement Speed"?: string;
  readonly "Team-Up Bonus"?: string;
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
