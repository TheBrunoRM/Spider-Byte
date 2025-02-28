import { LogLevels, Logger, delay } from 'seyfert/lib/common';
import { type IValidation, createValidate } from 'typia';
import { LimitedCollection } from 'seyfert';

import type { LeaderboardPlayerHeroDTO } from '../../types/dtos/LeaderboardPlayerHeroDTO';
import type { FormattedPatch, PatchNotesDTO } from '../../types/dtos/PatchNotesDTO';
import type { FindedPlayerDTO } from '../../types/dtos/FindedPlayerDTO';
import type { MatchHistoryDTO } from '../../types/dtos/MatchHistoryDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { PlayerDTO } from '../../types/v2/PlayerDTO';
import type { RankedDTO } from '../../types/v2/RankedDTO';
import type { HeroDTO } from '../../types/dtos/HeroDTO';
import type { APIError } from '../../types/v2/APIError';
import type { CareerDTO } from '../../types/v2/Career';

import { isProduction } from '../constants';

const isHeroes = createValidate<HeroesDTO[]>();
const isHero = createValidate<HeroDTO>();
const isFindedPlayer = createValidate<FindedPlayerDTO>();
const isMatchHistory = createValidate<MatchHistoryDTO>();
const isLeaderboardPlayerHero = createValidate<LeaderboardPlayerHeroDTO>();
const isPatchNotes = createValidate<PatchNotesDTO>();
const isFormattedPatch = createValidate<FormattedPatch>();
const isPlayer = createValidate<PlayerDTO>();
const isRanked = createValidate<RankedDTO>();
const isCareer = createValidate<CareerDTO>();

const TRACKER_DOMAIN = Bun.env.TRACKER!;
const MARVELRIVALS_DOMAIN = Bun.env.MARVELRIVALS!;

if (!TRACKER_DOMAIN) {
  throw new Error('TRACKER is not defined');
}
if (!MARVELRIVALS_DOMAIN) {
  throw new Error('MARVELRIVALS is not defined');
}

export class Api {
  logger = new Logger({
    name: '[Rivals API]',
    logLevel: isProduction
      ? LogLevels.Info
      : LogLevels.Debug
  });

  // First, add the new cache collection to the cache object
  cache = {
    searchPlayer: new LimitedCollection<string, FindedPlayerDTO | null>({
      expire: 15 * 60e3
    }),
    fetchPlayer: new LimitedCollection<string, PlayerDTO | null>({
      expire: 15 * 60e3
    }),
    leaderboardPlayerHero: new LimitedCollection<string, LeaderboardPlayerHeroDTO | null>({
      expire: 15 * 60e3
    }),
    patchNotes: new LimitedCollection<string, PatchNotesDTO | null>({
      expire: 60 * 60e3
    }),
    rankedStats: new LimitedCollection<string, RankedDTO | null>({
      expire: 15 * 60e3
    }),
    heroes: [] as HeroesDTO[]
  };

  // Then modify the fetchJson method to use caching
  private readonly baseTrackerUrl = TRACKER_DOMAIN;

  private readonly trackerApiUrl: string = `${this.baseTrackerUrl}/api/v2/marvel-rivals/standard`;

  private readonly retryDelay: number = 1_000;

  private readonly maxRetries: number = 3;

  private readonly baseMarvelRivalsUrl: string = MARVELRIVALS_DOMAIN;

  private readonly marvelRivalsApiUrl: string = `${this.baseMarvelRivalsUrl}/api/v1`;

  private readonly cdnUrl: string = `${this.baseMarvelRivalsUrl}/rivals`;

  private apiKeyIndex = 0;

  constructor(private readonly apiKeys: string[]) { }

  public buildImage(path: string) {
    return `${this.cdnUrl}${path}`;
  }

  private rotateApiKey() {
    const i = this.apiKeyIndex++;
    if (this.apiKeyIndex >= this.apiKeys.length) {
      this.apiKeyIndex = 0;
    }
    return this.apiKeys[i];
  }

  // Patch Notes
  public getPatchNotesById(id: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `patch-note/${id}`,
      validator: isFormattedPatch
    });
  }

  public getPatchNotes() {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: 'patch-notes',
      validator: isPatchNotes,
      cache: this.cache.patchNotes
    });
  }

  // Career
  public async getCareer(id: string, { mode, season }: {
    mode: 'all';
    season: 1 | 2 | 3;
  }) {
    return this.fetchWithRetry({
      domain: this.trackerApiUrl,
      endpoint: `profile/ign/${id}/segments/career`,
      validator: isCareer,
      query: {
        mode,
        season: season.toString()
      }
    });
  }

  // Matches
  public getMatchHistory(id: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `player/${id}/match-history`,
      validator: isMatchHistory
    });
  }

  // Players
  public searchPlayer(username: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `find-player/${username}`,
      validator: isFindedPlayer,
      cache: this.cache.searchPlayer
    });
  }

  public async getPlayer(nameOrId: string) {
    if (/^\d+$/.exec(nameOrId)) {
      return [await this.fetchPlayer(nameOrId), nameOrId] as const;
    }

    const playerFound = await this.searchPlayer(nameOrId);
    if (!playerFound) {
      return [playerFound, ''] as const;
    }
    return [await this.fetchPlayer(playerFound.uid), playerFound.uid] as const;
  }

  async fetchPlayer(id: string): Promise<PlayerDTO['data'] | undefined | APIError> {
    const url = `${this.trackerApiUrl}/profile/ign/${encodeURIComponent(id)}`;
    const response = await this.fetchJson<PlayerDTO>(`fetch-player/${id}`, url, this.cache.fetchPlayer);

    if (!response) {
      return undefined;
    }

    // validamos que response no sea un APIError
    if ('errors' in response) {
      return response;
    }

    // Validate response with typia
    const validation = isPlayer(response);
    if (!validation.success) {
      console.error('Invalid API response:', validation.errors);
      return undefined;
    }

    return response.data;
  }

  // Ranked
  public async getRankedStats(name: string) {
    const url = `${TRACKER_DOMAIN}/standard/profile/ign/${encodeURIComponent(name)}/stats/overview/ranked`;
    const response = await this.fetchJson<RankedDTO>(`ranked-stats/${name}`, url, this.cache.rankedStats);

    if (!response) {
      return undefined;
    }

    // Validate response with typia
    const validation = isRanked(response);
    if (!validation.success) {
      console.error('Invalid API response:', validation.errors);
      return undefined;
    }

    return (response as RankedDTO).data;
  }

  // Heroes
  public getLeaderboardHero(nameOrId: string, platform: 'xbox' | 'pc' | 'ps' = 'pc') {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `heroes/leaderboard/${nameOrId}`,
      validator: isLeaderboardPlayerHero,
      cache: this.cache.leaderboardPlayerHero,
      query: {
        platform
      }
    });
  }

  public async getHeroes() {
    if (this.cache.heroes.length) {
      return this.cache.heroes;
    }
    const heroes = await this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: 'heroes',
      validator: isHeroes
    });
    if (heroes) {
      this.cache.heroes = heroes;
    }
    return this.cache.heroes;
  }

  public getHero(nameOrId: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `heroes/hero/${nameOrId}`,
      validator: isHero
    });
  }

  // internal
  private async fetchWithRetry<T>({
    domain,
    cache,
    endpoint,
    validator,
    retries = this.maxRetries,
    query
  }: {
    endpoint: string;
    domain: Api['marvelRivalsApiUrl' | 'trackerApiUrl'];
    validator: (data: unknown) => IValidation<T>; // Validador de types
    cache?: LimitedCollection<string, null | T>;
    query?: Record<string, string>;
    retries?: number;
  }): Promise<null | T> {
    let data: unknown;
    try {
      this.logger.debug(endpoint);

      const response = await this.fetchApi({
        domain,
        endpoint,
        query: new URLSearchParams(query)
      });

      // Si la respuesta es 404 (Not Found), retorna null
      if (response.status === 404) {
        cache?.set(endpoint, null);
        return null;
      }

      data = await response.json();
    } catch (error) {
      if (retries > 0) {
        await delay(this.retryDelay);
        return this.fetchWithRetry({
          endpoint,
          validator,
          cache,
          retries: retries - 1,
          domain,
          query
        });
      }
      throw error;
    }

    const check = validator(data);

    if (!check.success) {
      console.log(check.errors);
      throw new Error(check.errors.map((err) => `Expected: ${err.expected} on ${err.path}`).join('\n'));
    }
    cache?.set(endpoint, check.data);
    return check.data;
  }

  private async fetchJson<T>(cacheKey: string, url: string, cache: LimitedCollection<string, NoInfer<T> | null>): Promise<APIError | null | T> {
    try {
      // Check cache first
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey)!;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Chrome/121',
          Accept: 'application/json',
          'Accept-Language': 'es-AR,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          DNT: '1',
          'Upgrade-Insecure-Requests': '1'
        },
        credentials: 'omit',
        referrerPolicy: 'strict-origin-when-cross-origin',
        mode: 'cors'
      });

      if (response.status === 400) {
        return await response.json() as APIError;
      }

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const jsonData = await response.json();
      // Store in cache before returning
      cache.set(cacheKey, jsonData as T);

      return jsonData as T;
    } catch (error) {
      throw new Error(`Failed to fetch JSON: ${String(error)}`);
    }
  }

  private async fetchApi({ domain, endpoint, query }: {
    domain: Api['marvelRivalsApiUrl' | 'trackerApiUrl'];
    endpoint: string;
    query: URLSearchParams;
  }) {
    const url = `${domain}/${endpoint}?${query}`;

    const headers = {
      'x-api-key': this.rotateApiKey(),
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, { headers });

    if (!response.ok || response.status !== 200) {
      const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
      this.logger.error(errorMessage);
    }

    return response;
  }

}
