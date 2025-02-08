export interface HeroesDTO {
  id: string;
  name: string;
  real_name: string;
  imageUrl: string;
  role: Role;
  attack_type: AttackType;
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
  icon?: null | string;
  name?: string;
  type: Type;
  isCollab: boolean;
  description?: string;
  additional_fields?: AdditionalFields;
  transformation_id: string;
}

export interface AdditionalFields {
  Key?: Key;
  'Wall-Crawling Speed'?: string;
  Cooldown?: string;
  Damage?: string;
  Casting?: string;
  'Attack Interval'?: string;
  'Maximum Distance'?: string;
  'Maximum Pull-In Distance'?: string;
  "Dragon's Defense Cooldown Reduction Per Hit"?: string;
  'Block Time'?: string;
  'Damage Reduction'?: string;
  'Max Health/Damage Blocked Conversion'?: string;
  'Bonus Health/Damage Blocked Conversion'?: string;
  Range?: string;
  Duration?: string;
  'Attack Speed'?: string;
  'Dashing Speed Without Target'?: string;
  'Dashing Distance Without Target'?: string;
  'Healing Per Second'?: string;
  'Excess Healing/Max Health Conversion'?: string;
  'Dashing Speed'?: string;
  'Maximum Dash Distance'?: string;
  'First Flying Kick Damage'?: string;
  'Second Flying Kick Damage'?: string;
  'Damage Boost'?: string;
  'Movement Boost'?: string;
  "K'un-Lun Kick Bonus Range"?: string;
  'Yat Jee Chung Kuen Bonus Range'?: string;
  'Yat Jee Chung Kuen Cooldown Reduction'?: string;
  'Bonus Health'?: string;
  'Team-up Bonus'?: string;
  'Slow Rate'?: string;
  'Special Effect'?: string;
  'Projectile Speed'?: string;
  'Spell Field Range'?: string;
  'Spell Field Damage'?: string;
  'Spell Field Duration'?: string;
  'Team-Up Bonus'?: string;
  'Bonus Health Duration'?: string;
  'Bonus Health/Healing Conversion'?: string;
  'Cooldown Reduction Per KO Engaged'?: string;
  'Max Rage'?: string;
  'Rage Per Hit Taken'?: string;
  'Rage Per Savage Claw Hit'?: string;
  'Rage Gain From Taking Hits'?: string;
  'Rage Per Feral Leap Snatch'?: string;
  'Rage Per Vicious Rampage Hit'?: string;
  'Rage Per Last Stand Knockback'?: string;
  'Rage Per Berserk Claw Strike Hit'?: string;
  'Base Damage'?: string;
  'Percentage Damage'?: string;
  'Average Speed'?: string;
  'Smash Damage'?: string;
  'Snatch Damage'?: string;
  'Knockdown Duration'?: string;
  'Berserk Claw Strike Duration'?: string;
  'Berserk Claw Strike Base Damage'?: string;
  'Berserk Claw Strike Attack Interval'?: string;
  'Berserk Claw Strike Maximum Distance'?: string;
  'Berserk Claw Strike Percentage Damage'?: string;
  'Impact Range'?: string;
  'Knockdown Time'?: string;
  'Knockback Range'?: string;
  'Knockback Damage'?: string;
  'Impact Base Damage'?: string;
  'Impact Percentage Damage'?: string;
  'Snatching Damage Over Time'?: string;
  'Team-Up Target'?: string;
  'Maximum Waving Duration'?: string;
  Ammo?: string;
  'Fire Rate'?: string;
  'Critical Hit'?: CriticalHit;
  'Damage Falloff'?: string;
  'Critical Damage'?: string;
  'Bullets Fired Each Cast'?: string;
  'Cooldown Reduction On Hit'?: string;
  'Crosshair Spread Radius (at 10m)'?: string;
  'Firing Phase'?: string;
  'Recall Phase'?: string;
  'Spread Angle'?: string;
  'Recall Window'?: string;
  'Special Mechanic'?: string;
  'Number of Projectiles'?: string;
  Charges?: string;
  'Energy Cost'?: string;
  'Rewind Time'?: string;
  'Bonus Health/Damage Taken Conversion'?: string;
  'Healing Amount'?: string;
  'Buff Duration'?: string;
  'Healing Boost'?: string;
  'Critical Hit Damage Reduction'?: string;
  Health?: string;
  'Movement Speed'?: MovementSpeed;
  'Maximum Projectile Count'?: string;
  'Number of Bounces'?: string;
  'Healing Amount (Self)'?: string;
  'Maximum Damage Shared Per Target'?: string;
  'Health Upon Revival'?: string;
  'Aquatic Dominion Charge Per Hit'?: string;
  'Projectile Damage'?: string;
  'Spell Field Damage Falloff'?: string;
  'Enhanced Monstro Spawn Projectile Speed'?: string;
  'Enhanced Monstro Spawn Projectile Damage'?: string;
  'Maximum Duration'?: string;
  'Vertical Moving Distance'?: string;
  Default?: string;
  Enhanced?: string;
  'Monstro Spawn Damage'?: string;
  'Monstro Spawn Health'?: string;
  'Default Charging Speed'?: string;
  'Monstro Spawn Fire Rate'?: string;
  'Monstro Spawn Attack Range'?: string;
  'Monstro Spawn Damage Falloff'?: string;
  'Monstro Spawn Maximum Duration'?: string;
  'Monstro Spawn Maximum Quantity'?: string;
  'Projectile Speed (Summon Monstro Spawn)'?: string;
  'Hit Delay'?: string;
  'Immobilize Duration'?: string;
  'Recharge Speed'?: string;
  'Invincibility Duration'?: string;
  'Maximum Energy'?: string;
  'Energy Recovery Speed'?: string;
  'Reload Time Reduction'?: string;
  'Maximum Locking Distance'?: string;
  'Spider-Nest Health'?: string;
  'Pull-back Distance'?: string;
  'Minimum Dash Distance'?: string;
  'Maximum Cyber-Bond Distance'?: string;
  'Sweep Range'?: string;
  'Arachno-Mine Attack Interval'?: string;
  'Maximum Arachno-Mine Quantity'?: string;
  'Spider-Drone Generation Interval'?: string;
  'Bonus Health (Self)'?: string;
  'Charge Time'?: string;
  'Seize Damage'?: string;
  'Slow Duration'?: string;
  'Culling Duration'?: string;
  'Culling Threshold'?: string;
  'Next Kraken Impact After A Culling'?: string;
  'Roterstern Fire Rate Boost'?: string;
  'Max Elasticity'?: string;
  'Inflated Duration'?: string;
  'Gained Elasticity'?: string;
  'Dual-Target Pull Damage'?: string;
  'Initial Projectile Range'?: string;
  'Single-Target Pull Range'?: string;
  'Initial Projectile Damage'?: string;
  'Single-Target Pull Damage'?: string;
  'Secondary Projectile Damage'?: string;
  'Secondary Release Maximum Distance'?: string;
  'Bonus Health (Ally)'?: string;
  'Maximum Select Distance'?: string;
  'Shield Value'?: string;
  'Self Slow Rate'?: string;
  'Reflected Projectile Speed'?: string;
  'Damage Absorbed - Damage Reflected Conversion Rate'?: string;
  'Maximum Leaps'?: string;
  'Minimum Leaps'?: string;
  'Damage/Health Conversion'?: string;
  'Bonus Max Health'?: string;
  'Maximum Thorforce'?: string;
  'Thorforce Recovery Speed'?: string;
  'Bonus Health Per Thorforce'?: string;
  'Thorforce Consumption Cooldown'?: string;
  'Mjolnir Bash Energy Recovery Per Thorforce'?: string;
  'Thorforce Cost'?: string;
  'Dash Distance'?: string;
  'Maximum Charge Time'?: string;
  'Key (Enhanced)'?: Key;
  'Max Shield Duration'?: string;
  Height?: string;
  'Descending Speed'?: string;
  'Horizontal Movement Speed'?: string;
  'Special Effect 1'?: string;
  'Special Effect 2'?: string;
  'Chthonian Burst Recharge Per Hit'?: string;
  'Detection Interval'?: string;
  'Stun Duration Per Detection'?: string;
  'Spell Field Generation Delay'?: string;
  'Energy Recovery Delay'?: string;
  'Explosion Range'?: string;
  'Projectile Absorption Range'?: string;
  'Iron Ring Charging Speed'?: string;
  Kick?: string;
  Punch?: string;
  'Kick Damage'?: string;
  'Kicking Distance'?: string;
  'Slow Effect'?: string;
  'Stun Duration'?: string;
  'Hits Required to Stun'?: string;
  'Disappearance Time To Trigger Detection'?: string;
  'Maximum Webbing Length'?: string;
  'Sprinting Speed'?: string;
  'Minimum Distance'?: string;
  CoolDown?: string;
  'Ammo Consumption'?: string;
  'Special Mechanic 1'?: string;
  'Special Mechanic 2'?: string;
  'Two-handed Repulsors'?: string;
  'Beam Length'?: string;
  Missiles?: string;
  'Damage Over Time'?: string;
  'Explosion Damage'?: string;
  'Dispersive Spell Field'?: string;
  'Movement Mode'?: string;
  'Flying Kick Damage'?: string;
  'Flying Kick Distance'?: string;
  'Flying Kick Stun Duration'?: string;
  'Flying Kick Casting Window'?: string;
  'CastingSpinning Kick Damage'?: string;
  'Power Jump Energy Cost'?: string;
  'Energy Cost (Sprinting)'?: string;
  'Plasma Range'?: string;
  'Plasma Duration'?: string;
  'Number of Plasma Globules'?: string;
  'Aiming down sights times'?: string;
  'Jump Height'?: string;
  'Imprison Duration'?: string;
  'Squirrel Horde Health'?: string;
  'Squirrel Horde Movement Speed'?: string;
  'Skating Speed'?: string;
  'Time Required to Start Skating'?: string;
  'Cast to heal the ally once'?: string;
  'Maximum Bounce Distance'?: string;
  'Damage Falloff Per Bounce'?: string;
  'Maximum Number of Bounces'?: string;
  'Pull-In Range'?: string;
  'Bouncing Range'?: string;
  'Pull-In Damage'?: string;
  'Grappling Hook Speed'?: string;
  'Grappling Hook Length'?: string;
  Frequency?: string;
  'Number of Hits'?: string;
  'Activation Delay'?: string;
  'Descending Range'?: string;
  'Conversion Rate'?: string;
  'Energy Cost Special Effect'?: string;
  'Combo Ability Casting Window'?: string;
  "Summons' Health"?: string;
  'Maximum Duration for Summons'?: string;
  'Upward Slash Damage'?: string;
  'Thornlash Wall Health'?: string;
  'Trigger Condition'?: string;
  'Double Jump Cooldown'?: string;
  'Casting Angle'?: string;
  'Healing Per Hit'?: string;
  'Area of Effect Healing'?: string;
  Vulnerability?: string;
  'Blinding Duration'?: string;
  'Vulnerability Duration'?: string;
  Delay?: string;
  'Explosion Delay'?: string;
  'Dash Speed'?: string;
  'Nastrond Crow Health'?: string;
  'Explosion Damage Falloff'?: string;
  'Dash Direction'?: string;
  'Maximum Revive Distance'?: string;
  'Bonus Health From Armor Pack'?: string;
  'Healing Amount (Ally)'?: string;
  'Projectile Speed Reduction'?: string;
  'Melee Range'?: string;
  'Max Flying Distance'?: string;
  'Shield Flying Speed'?: string;
  'Maximum Shield Value'?: string;
  'Recovery Shield Value'?: string;
  'Ricochet Damage Falloff'?: string;
  'Cooldown After Destroyed'?: string;
  'Delayed Recovery After Release'?: string;
  'Fearless Leap Height'?: string;
  'Number of Ricochets'?: string;
  'Spell Area Duration'?: string;
  'Health Recovery Rate'?: string;
  'Bonus Damage'?: string;
  'Triggering Distance'?: string;
  'Minimum Charge Time'?: string;
  'Slow Rate While Charging'?: string;
  'Blast Arrows Per Cast'?: string;
  'First Damage'?: string;
  'Second Damage'?: string;
  'First Spell Field Range'?: string;
  'Second Spell Field Range'?: string;
  'Afterimage Duration'?: string;
  'Afterimage Generation Interval'?: string;
  'Caster & Ally One-time Healing Amount'?: string;
  'Excess Healing/Bonus Health Conversion'?: string;
  'One-time Healing Amount'?: string;
  'Healing Over Time Amount'?: string;
  'Illusion Health'?: string;
  'Sedation Duration'?: string;
  'Out-of-Combat Movement Speed'?: string;
  'Time Required to Leave Combat'?: string;
  'Life Orb Cooldown'?: string;
  'Soul Separation Duration'?: string;
  'Recovery Speed'?: string;
  'Anti-Heal Duration'?: string;
  'Generate Dark Magic'?: string;
  'Anti-Heal Activation Delay at Peak Dark Magic'?: string;
  'Free-Flight Duration'?: string;
  'Rune Stone Health'?: string;
  'Illusion Damage'?: string;
  'Illusion Healing'?: string;
  'Illusion Duration'?: string;
  'Maximum Illusion Quantity'?: string;
  'Tornado Duration'?: string;
  'Maximum Selection Duration'?: string;
  Thunder?: string;
  Tornado?: string;
  'Damage Boost (Ally)'?: string;
  'Damage Boost (Self)'?: string;
  'Movement Boost (Ally)'?: string;
  'Movement Boost (Self)'?: string;
  'Enemy Slow Rate'?: string;
  'Enhanced Thunder'?: string;
  'Enhanced Tornado'?: string;
  'Strike Frequency'?: string;
  'Gatling Gun'?: string;
  'Slow Rate While Idling'?: string;
  'Interval Between Volleys'?: string;
  'Slow Rate While Shooting'?: string;
  'Interval Between Missiles'?: string;
  'Shoulder-mounted Missiles'?: string;
  'Maximum Number of Missiles Per Volley'?: string;
  'Maximum Number of Locked-on Missiles Per Target'?: string;
  'Backward Jump Distance'?: string;
  'Cable Length'?: string;
  'Cable Attachment Angle'?: string;
  'Turret Health'?: string;
  'Deliverance Fire Rate Boost'?: string;
  'Adjudication Fire Rate Boost'?: string;
  'Speed at Maximum Charge Time'?: string;
  'Speed at Minimum Charge Time'?: string;
  "Ally's Shield Value"?: string;
  "Caster's Shield Value"?: string;
  'Max Duration'?: string;
}

export enum CriticalHit {
  No = 'No',
  None = 'None',
  ProjectileYesSpellFieldNo = 'Projectile: Yes; Spell Field: No',
  Yes = 'Yes',
}

export enum Key {
  C = 'C',
  E = 'E',
  F = 'F',
  KeyShift = 'Shift',
  LeftClick = 'Left Click',
  None = 'None',
  Passive = 'Passive',
  Q = 'Q',
  RightClick = 'Right Click',
  Shift = 'SHIFT',
  Space = 'Space',
  V = 'V',
}

export enum MovementSpeed {
  MovementSpeed6MS = '6 m/s',
  The20MS = '20m/s',
  The6MS = '6m/s',
}

export enum Type {
  Normal = 'Normal',
  Passive = 'Passive',
  Ultimate = 'Ultimate',
  Weapon = 'Weapon',
}

export enum AttackType {
  HitscanHeroes = 'Hitscan Heroes',
  MeleeHeroes = 'Melee Heroes',
  ProjectileHeroes = 'Projectile Heroes',
}

export interface Costume {
  id: string;
  name: string;
  icon: string;
  quality: Quality;
  description: string;
  appearance: string;
}

export enum Quality {
  Blue = 'BLUE',
  NoQuality = 'NO_QUALITY',
  Orange = 'ORANGE',
  Purple = 'PURPLE',
}

export enum Role {
  Duelist = 'Duelist',
  Strategist = 'Strategist',
  Vanguard = 'Vanguard',
}

export interface Transformation {
  id: string;
  name: string;
  icon: string;
  health: null | string;
  movement_speed: MovementSpeedEnum | null;
}

export enum MovementSpeedEnum {
  MovementSpeed6MS = '6m/s',
  The6MS = '6 m/s',
  The7MS = '7m/s',
}
