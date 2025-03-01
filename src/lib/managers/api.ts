import { LogLevels, Logger, delay } from 'seyfert/lib/common';
import { type IValidation, createValidate } from 'typia';

import type { LeaderboardPlayerHeroDTO } from '../../types/dtos/LeaderboardPlayerHeroDTO';
import type { FormattedPatch, PatchNotesDTO } from '../../types/dtos/PatchNotesDTO';
import type { FindedPlayerDTO } from '../../types/dtos/FindedPlayerDTO';
import type { MatchHistoryDTO } from '../../types/dtos/MatchHistoryDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';
import type { UpdateDTO } from '../../types/dtos/UpdateDTO';
import type { RankedDTO } from '../../types/v2/RankedDTO';
import type { HeroDTO } from '../../types/dtos/HeroDTO';
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
const isUpdatedPlayer = createValidate<UpdateDTO>();

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

  // Then modify the fetchJson method to use caching
  private readonly baseTrackerUrl = TRACKER_DOMAIN;

  private readonly trackerApiUrl: string = `${this.baseTrackerUrl}/api/v2/marvel-rivals/standard`;

  private readonly retryDelay: number = 1_000;

  private readonly maxRetries: number = 3;

  private readonly baseMarvelRivalsUrl: string = MARVELRIVALS_DOMAIN;

  private readonly marvelRivalsApiUrl: string = `${this.baseMarvelRivalsUrl}/api/v1`;

  private readonly cdnUrl: string = `${this.baseMarvelRivalsUrl}/rivals`;

  private apiKeyIndex = 0;

  constructor(private readonly apiKeys: string[], private readonly redisClient: ReturnType<typeof import('@redis/client')['createClient']>) { }

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
      validator: isFormattedPatch,
      cacheKey: `patch-notes/${id}`
    });
  }

  public getPatchNotes() {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: 'patch-notes',
      validator: isPatchNotes,
      cacheKey: 'patch-notes'
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
      },
      cacheKey: `career/${id}/${mode}/${season}`
    });
  }

  // Matches
  public getMatchHistory(id: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `player/${id}/match-history`,
      validator: isMatchHistory,
      cacheKey: `match-history/${id}`
    });
  }

  // Players
  updatePlayer(id: number) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `player/${id}/update`,
      validator: isUpdatedPlayer
    });
  }

  public async searchPlayer(username: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `find-player/${encodeURIComponent(username)}`,
      validator: isFindedPlayer,
      cacheKey: `find-player/${username}`
    });
  }

  public async getPlayer(nameOrId: string) {
    if (/^\d+$/.exec(nameOrId)) {
      return this.fetchPlayer(nameOrId);
    }

    const playerFound = await this.searchPlayer(nameOrId);
    if (!playerFound) {
      return playerFound;
    }
    return this.fetchPlayer(playerFound.uid);
  }

  fetchPlayer(id: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `player/${id}`,
      validator: isPlayer,
      cacheKey: `player/${id}`
    });
  }

  // async fetchPlayer(id: string): Promise<PlayerDTO | undefined | APIError> {
  //   if (await this.redisClient.EXISTS(`player/${id}`)) {
  //     const user = await this.redisClient.GET(`player/${id}`);
  //     if (!user || user === 'null') {
  //       return undefined;
  //     }
  //     return JSON.parse(user) as PlayerDTO | APIError;
  //   }

  //   const url = `${this.trackerApiUrl}/profile/ign/${encodeURIComponent(id)}`;
  //   const response = await this.fetchJson<PlayerDTO>(url);

  //   await this.redisClient.SET(`player/${id}`, JSON.stringify(response), {
  //     EX: 15 * 60
  //   });

  //   if (!response) {
  //     return undefined;
  //   }

  //   // validamos que response no sea un APIError
  //   if ('errors' in response) {
  //     return response;
  //   }

  //   // Validate response with typia
  //   const validation = isPlayer(response);
  //   if (!validation.success) {
  //     console.error('Invalid API response:', validation.errors);
  //     return undefined;
  //   }

  //   return response;
  // }

  // Ranked
  public getRankedStats(name: string) {
    return this.fetchWithRetry({
      domain: this.trackerApiUrl,
      endpoint: `profile/ign/${encodeURIComponent(name)}/stats/overview/ranked`,
      validator: isRanked,
      cacheKey: `ranked-stats/${name}`
    });
  }

  // Heroes
  public getLeaderboardHero(nameOrId: string, platform: 'xbox' | 'pc' | 'ps' = 'pc') {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `heroes/leaderboard/${nameOrId}`,
      validator: isLeaderboardPlayerHero,
      cacheKey: `leaderboard-hero/${nameOrId}/${platform}`,
      query: {
        platform
      }
    });
  }

  public async getHeroes() {
    const heroes = await this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: 'heroes',
      validator: isHeroes,
      cacheKey: 'heroes'
    });
    return heroes ?? [];
  }

  public getHero(nameOrId: string) {
    return this.fetchWithRetry({
      domain: this.marvelRivalsApiUrl,
      endpoint: `heroes/hero/${nameOrId}`,
      validator: isHero,
      cacheKey: `hero/${nameOrId}`
    });
  }

  // internal
  private async fetchWithRetry<T>({
    domain,
    cacheKey,
    endpoint,
    validator,
    retries = this.maxRetries,
    query,
    expireTime
  }: {
    endpoint: string;
    domain: Api['marvelRivalsApiUrl' | 'trackerApiUrl'];
    validator: (data: unknown) => IValidation<T>;
    cacheKey?: string;
    query?: Record<string, string>;
    retries?: number;
    expireTime?: number;
  }): Promise<null | T> {
    if (cacheKey) {
      const cachedData = await this.redisClient.GET(cacheKey);
      if (cachedData) {
        if (cachedData === 'null') {
          return null;
        }
        return JSON.parse(cachedData) as T;
      }
    }

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
        if (cacheKey) {
          await this.redisClient.SET(cacheKey, 'null', {
            EX: expireTime
          });
        }
        return null;
      }

      data = await response.json();
    } catch (error) {
      if (retries > 0) {
        await delay(this.retryDelay);
        return this.fetchWithRetry({
          endpoint,
          validator,
          cacheKey,
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
    if (cacheKey) {
      await this.redisClient.SET(cacheKey, JSON.stringify(check.data), {
        EX: expireTime
      });
    }
    return check.data;
  }

  // private async fetchJson<T>(url: string): Promise<APIError | null | T> {
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         'User-Agent': 'Chrome/121',
  //         Accept: 'application/json',
  //         'Accept-Language': 'es-AR,en;q=0.9',
  //         'Accept-Encoding': 'gzip, deflate, br',
  //         Connection: 'keep-alive',
  //         'Cache-Control': 'no-cache',
  //         Pragma: 'no-cache',
  //         DNT: '1',
  //         'Upgrade-Insecure-Requests': '1'
  //       },
  //       credentials: 'omit',
  //       referrerPolicy: 'strict-origin-when-cross-origin',
  //       mode: 'cors'
  //     });

  //     if (response.status === 400) {
  //       return await response.json() as APIError;
  //     }

  //     if (!response.ok) {
  //       throw new Error(await response.text());
  //     }

  //     const jsonData = await response.json();

  //     return jsonData as T;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch JSON: ${String(error)}`);
  //   }
  // }

  private async fetchApi({ domain, endpoint, query }: {
    domain: Api['marvelRivalsApiUrl' | 'trackerApiUrl'];
    endpoint: string;
    query: URLSearchParams;
  }) {
    const url = `${domain}/${endpoint}?${query}`;

    const headers = {
      'x-api-key': this.rotateApiKey(),
      'Content-Type': 'application/json',
      'User-Agent': 'Chrome/121',
      Accept: 'application/json',
      'Accept-Language': 'es-AR,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      DNT: '1',
      'Upgrade-Insecure-Requests': '1'
    };

    const response = await fetch(url, {
      headers,
      credentials: 'omit',
      referrerPolicy: 'strict-origin-when-cross-origin',
      mode: 'cors'
    });

    if (!response.ok || response.status !== 200) {
      const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
      this.logger.error(errorMessage);
    }

    return response;
  }
}
