import { createIs } from 'typia';

import type { HeroesDTO } from './dtos/HeroesDTO';

export const isHeroes = createIs<HeroesDTO[]>();
