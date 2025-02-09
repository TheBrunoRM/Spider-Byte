import { createIs } from 'typia';

import type { FindedPlayerDTO } from '../../types/dtos/FindedPlayerDTO';
import type { MatchHistoryDTO } from '../../types/dtos/MatchHistoryDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';
import type { HeroDTO } from '../../types/dtos/HeroDTO';

// Funciones de validación de tipos
export const isHeroes = createIs<HeroesDTO[]>();
export const isHero = createIs<HeroDTO>();
export const isPlayer = createIs<PlayerDTO>();
export const isFindedPlayer = createIs<FindedPlayerDTO>();
export const isMatchHistory = createIs<MatchHistoryDTO>();

export class Api {
  private readonly retryDelay: number = 1_000; // Retardo entre reintentos en milisegundos

  private readonly maxRetries: number = 3; // Número máximo de reintentos

  private readonly baseUrl: string = 'https://marvelrivalsapi.com';

  private readonly cdnUrl: string = this.baseUrl;

  private readonly apiUrl: string = `${this.baseUrl}/api/v1`;

  constructor(private readonly apiKey: string) { }

  // Métodos públicos para los endpoints

  public async searchPlayer(username: string): Promise<FindedPlayerDTO | null> {
    return this.fetchWithRetry(`find-player/${username}`, isFindedPlayer);
  }

  public async getPlayer(uid: string): Promise<PlayerDTO | null> {
    return this.fetchWithRetry(`player/${uid}`, isPlayer);
  }

  public async getMatchHistory(usernameOrId: string): Promise<MatchHistoryDTO | null> {
    return this.fetchWithRetry(`player/${usernameOrId}/match-history`, isMatchHistory);
  }

  public async getHeroes(): Promise<HeroesDTO[] | null> {
    return this.fetchWithRetry('heroes', isHeroes);
  }

  public async getHero(nameOrId: string): Promise<HeroDTO | null> {
    return this.fetchWithRetry(`heroes/${nameOrId}`, isHero);
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    validator: (data: unknown) => data is T, // Validador de types
    retries: number = this.maxRetries
  ): Promise<null | T> {
    try {
      const response = await this.fetchApi(endpoint);

      // Si la respuesta es 404 (Not Found), retorna null
      if (response.status === 404) {
        return null;
      }

      const data = await response.json();

      if (!validator(data)) {
        console.error('Unexpected data format:', data);
        return null;
      }

      return data;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying (${this.maxRetries - retries + 1}/${this.maxRetries})...`);
        await this.delay(this.retryDelay);
        return this.fetchWithRetry(endpoint, validator, retries - 1);
      }
      console.error('Max retries reached. Operation failed.');
      throw error;

    }
  }

  private async fetchApi(endpoint: string): Promise<Response> {
    const url = `${this.apiUrl}/${endpoint}`;
    console.log(url);
    const headers = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, { headers });

    if (!response.ok && response.status !== 404) {
      const errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return response;
  }

  private delay(ms: number): Promise<void> {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
