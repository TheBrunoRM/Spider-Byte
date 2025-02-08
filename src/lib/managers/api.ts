import { isHeroes } from '../../types/heroes';

export class Api {
    private baseUrl = 'https://marvelrivalsapi.com';

    private cdnUrl = this.baseUrl;

    private apiUrl = `${this.baseUrl}/api/v1`;

    constructor(private apiKey: string) { }

    async getHeroes() {
        const response = await this.fetchApi('heroes');
        const result = await response.json();
        if (!isHeroes(result)) {
            console.log(result);
            throw new Error('Unexpected data');
        }
        return result;
    }

    private async fetchApi(url: string) {
        const response = await fetch(`${this.apiUrl}/${url}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return response;
    }
}
