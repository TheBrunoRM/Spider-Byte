export interface HeroDTO {
  id: string;
  name: string;
  real_name: string;
  imageUrl: string;
  role: string;
  attack_type: string;
  team: string[];
  difficulty: string;
  bio: string;
  lore: string;
  transformations: Transformation[];
  costumes: Costume[];
  abilities: Ability[];
}

export interface Ability {
  id: number;
  icon: string;
  name?: string;
  type: string;
  isCollab: boolean;
  description?: string;
  additional_fields?: AdditionalFields;
  transformation_id: string;
}

export interface AdditionalFields {
  Key?: string;
  "Special Mechanic"?: string;
  Kick?: string;
  Punch?: string;
  Damage?: string;
  Casting?: string;
  "Attack Interval"?: string;
  "Maximum Distance"?: string;
  Cooldown?: string;
  "Kick Damage"?: string;
  "Kicking Distance"?: string;
  "Projectile Speed"?: string;
  "Projectile Damage"?: string;
  Range?: string;
  Duration?: string;
  "Energy Cost"?: string;
  "Slow Effect"?: string;
  "Slow Duration"?: string;
  "Stun Duration"?: string;
  "Special Effect"?: string;
  "Bonus Health (Self)"?: string;
  "Hits Required to Stun"?: string;
  "Disappearance Time To Trigger Detection"?: string;
  Charges?: string;
  "Recharge Speed"?: string;
  "Maximum Webbing Length"?: string;
  "Sprinting Speed"?: string;
  "Wall-Crawling Speed"?: string;
  Health?: string;
  "Movement Speed"?: string;
  "Team-Up Bonus"?: string;
}

export interface Costume {
  id: string;
  name: string;
  icon: string;
  quality: string;
  description: string;
  appearance: string;
}

export interface Transformation {
  id: string;
  name: string;
  icon: string;
  health: string;
  movement_speed: string;
}
