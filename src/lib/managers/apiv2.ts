import * as puppeteer from 'puppeteer';
import * as typia from 'typia';

import type { PlayerDTO } from '../../types/v2/PlayerDTO';
const BASE_URL = Bun.env.BASE_URL;

if (!BASE_URL) {
    throw new Error('BASE_URL is not defined');
}

export class ApiWrapper {
    page?: puppeteer.Page;

    async getPlayer(name: string): Promise<PlayerDTO['data'] | undefined> {
        const url = `${BASE_URL}/standard/profile/ign/${encodeURIComponent(name)}`;
        const response = await this.fetchJson<PlayerDTO>(url);

        if (!response) {
            return undefined;
        }

        // Validate response with typia
        const validation = typia.validate<PlayerDTO>(response);
        if (!validation.success) {
            console.error('Invalid API response:', validation.errors);
            return undefined;
        }

        return response.data;
    }

    private async fetchJson<T>(url: string): Promise<undefined | T> {
        try {
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
            return jsonData as T;
        } catch (error) {
            throw new Error(`Failed to fetch JSON: ${String(error)}`);
        }
    }

    private async createPage() {
        if (this.page) {
            return this.page;
        }
        const browser = await puppeteer.launch({
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
