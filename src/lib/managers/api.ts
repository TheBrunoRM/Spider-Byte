import { type IValidation, createValidate } from 'typia';
import { delay } from 'seyfert/lib/common';

import type { FindedPlayerDTO } from '../../types/dtos/FindedPlayerDTO';
import type { MatchHistoryDTO } from '../../types/dtos/MatchHistoryDTO';
import type { HeroesDTO } from '../../types/dtos/HeroesDTO';
import type { PlayerDTO } from '../../types/dtos/PlayerDTO';
import type { HeroDTO } from '../../types/dtos/HeroDTO';

// Funciones de validación de tipos
export const isHeroes = createValidate<HeroesDTO[]>();
export const isHero = createValidate<HeroDTO>();
export const isPlayer = createValidate<PlayerDTO>();
export const isFindedPlayer = createValidate<FindedPlayerDTO>();
export const isMatchHistory = createValidate<MatchHistoryDTO>();

export class Api {
  private readonly retryDelay: number = 1_000; // Retardo entre reintentos en milisegundos

  private readonly maxRetries: number = 3; // Número máximo de reintentos

  private readonly baseUrl: string = 'https://marvelrivalsapi.com';

  private readonly cdnUrl: string = this.baseUrl;

  private readonly apiUrl: string = `${this.baseUrl}/api/v1`;

  constructor(private readonly apiKey: string) { }

  // Métodos públicos para los endpoints

  public searchPlayer(username: string) {
    return this.fetchWithRetry(`find-player/${username}`, isFindedPlayer);
  }

  public getPlayer(uid: string) {
    return this.fetchWithRetry(`player/${uid}`, isPlayer);
  }

  public getMatchHistory(usernameOrId: string) {
    return this.fetchWithRetry(`player/${usernameOrId}/match-history`, isMatchHistory);
  }

  public getHeroes() {
    return this.fetchWithRetry('heroes', isHeroes);
  }

  public getHero(nameOrId: string) {
    return this.fetchWithRetry(`heroes/${nameOrId}`, isHero);
  }

  private async fetchWithRetry<T>(
    endpoint: string,
    validator: (data: unknown) => IValidation<T>, // Validador de types
    retries: number = this.maxRetries
  ): Promise<null | T> {
    try {
      const response = await this.fetchApi(endpoint);

      // Si la respuesta es 404 (Not Found), retorna null
      if (response.status === 404) {
        return null;
      }

      const data = await response.json();

      const check = validator(data);

      if (!check.success) {
        console.error('Unexpected data format:', data, check.errors);
        return null;
      }

      return check.data;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying (${this.maxRetries - retries + 1}/${this.maxRetries})...`);
        await delay(this.retryDelay);
        return this.fetchWithRetry(endpoint, validator, retries - 1);
      }
      console.error('Max retries reached. Operation failed.');
      throw error;
    }
  }

  private async fetchApi(endpoint: string) {
    const url = `${this.apiUrl}/${endpoint}`;

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
}
