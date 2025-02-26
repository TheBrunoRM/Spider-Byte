import { type IValidation, createValidate, validate } from 'typia';
import { LogLevels, Logger, delay } from 'seyfert/lib/common';
import { LimitedCollection } from 'seyfert';
import * as puppeteer from 'puppeteer';

import type { LeaderboardPlayerHeroDTO } from '../../types/dtos/LeaderboardPlayerHeroDTO';
import type { FormattedPatch, PatchNotesDTO } from '../../types/dtos/PatchNotesDTO';
import type { FindedPlayerDTO } from '../../types/dtos/FindedPlayerDTO';
import type { MatchHistoryDTO } from '../../types/dtos/MatchHistoryDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { PlayerDTO } from '../../types/v2/PlayerDTO';
import type { RankedDTO } from '../../types/v2/RankedDTO';
import type { HeroDTO } from '../../types/dtos/HeroDTO';

import { isProduction } from '../constants';

const isHeroes = createValidate<HeroesDTO[]>();
const isHero = createValidate<HeroDTO>();
const isFindedPlayer = createValidate<FindedPlayerDTO>();
const isMatchHistory = createValidate<MatchHistoryDTO>();
const isLeaderboardPlayerHero = createValidate<LeaderboardPlayerHeroDTO>();
const isPatchNotes = createValidate<PatchNotesDTO>();
const isFormattedPatch = createValidate<FormattedPatch>();

const BASE_URL = Bun.env.BASE_URL!;
const BASE_URL_2 = Bun.env.BASE_URL_2!;

if (!BASE_URL) {
  throw new Error('BASE_URL is not defined');
}
if (!BASE_URL_2) {
  throw new Error('BASE_URL_2 is not defined');
}

export class Api {
  page?: puppeteer.Page;

  logger = new Logger({
    name: '[Rivals API]',
    logLevel: isProduction
      ? LogLevels.Info
      : LogLevels.Debug
  });

  // First, add the new cache collection to the cache object
  cache = {
    searchPlayer: new LimitedCollection<string, FindedPlayerDTO | undefined>({
      expire: 15 * 60e3
    }),
    fetchPlayer: new LimitedCollection<string, PlayerDTO | undefined>({
      expire: 15 * 60e3
    }),
    leaderboardPlayerHero: new LimitedCollection<string, LeaderboardPlayerHeroDTO | undefined>({
      expire: 15 * 60e3
    }),
    patchNotes: new LimitedCollection<string, PatchNotesDTO | undefined>({
      expire: 60 * 60e3
    }),
    rankedStats: new LimitedCollection<string, RankedDTO | undefined>({
      expire: 15 * 60e3
    }),
    heroes: [] as HeroesDTO[]
  };

  // Then modify the fetchJson method to use caching
  private readonly retryDelay: number = 1_000;

  private readonly maxRetries: number = 3;

  private readonly baseUrl: string = BASE_URL_2;

  private readonly cdnUrl: string = `${this.baseUrl}/rivals`;

  private readonly apiUrl: string = `${this.baseUrl}/api/v1`;

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

  private async fetchJson<T>(endpoint: string, url: string, cache: LimitedCollection<string, undefined | T>): Promise<undefined | T> {
    try {
      // Check cache first
      if (cache.has(endpoint)) {
        return cache.get(endpoint)!;
      }

      const page = await this.createPage();

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty'
      });

      // Enable JavaScript and cookies
      await page.setJavaScriptEnabled(true);

      const response = await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000
      });

      if (!response) {
        throw new Error('Failed to get response from the page');
      }

      if (!response.ok()) {
        return undefined;
      }

      const jsonData = await response.json();
      // Store in cache before returning
      cache.set(endpoint, jsonData as T);

      return jsonData as T;
    } catch (error) {
      throw new Error(`Failed to fetch JSON: ${String(error)}`);
    }
  }

  // Patch Notes
  public getPatchNotesById(id: string) {
    return this.fetchWithRetry(`patch-note/${id}`, isFormattedPatch);
  }

  public getPatchNotes() {
    return this.fetchWithCacheRetry(
      'patch-notes', isPatchNotes, this.cache.patchNotes
    );
  }

  // Players
  public searchPlayer(username: string) {
    return this.fetchWithCacheRetry(`find-player/${username}`, isFindedPlayer, this.cache.searchPlayer);
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

  public getMatchHistory(usernameOrId: string) {
    return this.fetchWithRetry(`player/${usernameOrId}/match-history`, isMatchHistory);
  }

  async fetchPlayer(name: string): Promise<PlayerDTO['data'] | undefined> {
    const url = `${BASE_URL}/standard/profile/ign/${encodeURIComponent(name)}`;
    const response = await this.fetchJson<PlayerDTO>(`fetch-player/${name}`, url, this.cache.fetchPlayer);

    if (!response) {
      return undefined;
    }

    // Validate response with typia
    const validation = validate<PlayerDTO>(response);
    if (!validation.success) {
      console.error('Invalid API response:', validation.errors);
      return undefined;
    }

    return response.data;
  }

  // Ranked
  public async getRankedStats(name: string) {
    const url = `${BASE_URL}/standard/profile/ign/${encodeURIComponent(name)}/stats/overview/ranked`;
    const response = await this.fetchJson<RankedDTO>(`ranked-stats/${name}`, url, this.cache.rankedStats);

    if (!response) {
      return undefined;
    }

    // Validate response with typia
    const validation = validate<RankedDTO>(response);
    if (!validation.success) {
      console.error('Invalid API response:', validation.errors);
      return undefined;
    }

    return response.data;
  }

  // Heroes
  public getLeaderboardHero(nameOrId: string) {
    return this.fetchWithCacheRetry(`heroes/leaderboard/${nameOrId}`, isLeaderboardPlayerHero, this.cache.leaderboardPlayerHero);
  }

  public async getHeroes() {
    if (this.cache.heroes.length) {
      return this.cache.heroes;
    }
    const heroes = await this.fetchWithRetry('heroes', isHeroes);
    if (heroes) {
      this.cache.heroes = heroes;
    }
    return [];
  }

  public getHero(nameOrId: string) {
    return this.fetchWithRetry(`heroes/hero/${nameOrId}`, isHero);
  }

  // api
  async init() {
    await this.createPage();
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    validator: (data: unknown) => IValidation<T>, // Validador de types
    retries: number = this.maxRetries
  ): Promise<undefined | T> {
    let data: unknown;
    try {
      this.logger.debug(endpoint);

      const response = await this.fetchApi(endpoint);
      if (!response) {
        return undefined;
      }

      // Si la respuesta es 404 (Not Found), retorna undefined
      if (response.status === 404) {
        return undefined;
      }

      data = await response.json();
    } catch (error) {
      if (retries > 0) {
        await delay(this.retryDelay);
        return this.fetchWithRetry(endpoint, validator, retries - 1);
      }
      throw error;
    }

    const check = validator(data);

    if (!check.success) {
      console.log(check.errors);
      throw new Error(check.errors.map((err) => `Expected: ${err.expected} on ${err.path}`).join('\n'));
    }

    return check.data;
  }

  private async fetchWithCacheRetry<T>(
    endpoint: string,
    validator: (data: unknown) => IValidation<T>, // Validador de types
    cache: LimitedCollection<string, undefined | T>,
    retries: number = this.maxRetries
  ): Promise<undefined | T> {
    if (cache.has(endpoint)) {
      return cache.get(endpoint)!;
    }
    const result = await this.fetchWithRetry(endpoint, validator, retries);

    cache.set(endpoint, result);

    return result;
  }

  private async fetchApi(endpoint: string) {
    const url = `${this.apiUrl}/${endpoint}`;

    const headers = {
      'x-api-key': this.rotateApiKey(),
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, { headers });

    if (!response.ok || response.status !== 200) {
      const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
      this.logger.error(errorMessage);
      return undefined;
    }

    return response;
  }

  private async createPage() {
    if (this.page) {
      return this.page;
    }
    const browser = await puppeteer.launch({
      executablePath: process.platform === 'linux'
        ? '/usr/bin/chromium'
        : undefined,
      headless: 'shell',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    this.page = await browser.newPage();

    await this.page.setRequestInterception(true);
    this.page.on('request', (request) => {
      if (['stylesheet', 'image', 'font'].includes(request.resourceType())) {
        void request.abort();
      } else {
        void request.continue();
      }
    });

    return this.page;
  }
}
