import { type ParseMiddlewares, type ParseLocales, type ParseClient, type UsingClient, Formatter, Client } from 'seyfert';
import { PresenceUpdateStatus, ActivityType, MessageFlags } from 'seyfert/lib/types';
import { basename, join, sep } from 'node:path';
import { GlobalFonts } from '@napi-rs/canvas';
import { createClient } from '@redis/client';

import type { Ratelimit } from './middlewares/cooldown';

import { middlewares } from './middlewares';
import { Api } from './lib/managers/api';
import { API_KEY } from './utils/env';

// Register fonts
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxe.otf'), 'RefrigeratorDeluxe');
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxeBold.otf'), 'RefrigeratorDeluxeBold');
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'leaderboard.ttf'), 'leaderboard');

const client = new Client({
    commands: {
        defaults: {
            onRunError(ctx, error) {
                const errorId = Math.floor(Math.random() * 1_000_000);
                client.logger.error(
                    errorId,
                    ctx.author.id,
                    ctx.author.username,
                    ctx.fullCommandName,
                    error
                );

                const content = [
                    `Report this error on the [support server](<https://discord.gg/AcruVkyYHm>) with the ID \`${errorId}\`.`,
                    Formatter.codeBlock((error instanceof Error
                        ? error.stack ?? error.message
                        : typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
                            ? error.message
                            : 'Unknown error').slice(0, 1_500), 'ts')
                ];

                return ctx.editOrReply({
                    content: content.join('\n')
                });
            },
            onMiddlewaresError(ctx, error) {
                return ctx.editOrReply({
                    content: error,
                    flags: MessageFlags.Ephemeral
                });
            },
            onOptionsError(ctx, metadata) {
                client.logger.error(
                    ctx.author.id,
                    ctx.author.username,
                    ctx.fullCommandName,
                    metadata
                );
                return ctx.editOrReply({
                    content: Object.entries(metadata).filter(([, value]) => value.failed).map(([key, value]) => `${key}: ${value.value as string}`).join('\n'),
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
    presence() {
        return {
            activities: [{
                name: 'Gonna get sticky',
                type: ActivityType.Custom,
                state: 'Gonna get sticky!'
            }],
            afk: false,
            since: Date.now(),
            status: PresenceUpdateStatus.Online
        };
    },
    globalMiddlewares: ['cooldown']
}) as UsingClient & Client;

client.setServices({
    langs: {
        aliases: {
            'es-419': ['es-ES'],
            'en-US': ['en-GB']
        }
    },
    middlewares
});

client.langs.filter = (path) => basename(path) === '_.ts';

client.langs.onFile = (locale, { path, file }) => file.default
    ? {
        file: file.default,
        locale: path.split(sep).at(-2) ?? locale
    }
    : false;


client.redis = await createClient()
    .on('error', (err) => {
        client.logger.error('Redis Client Error', err);
    }).connect();

client.api = new Api(API_KEY, client.redis);

await client.api.getHeroes();

await client.start();

await client.uploadCommands({
    cachePath: join(process.cwd(), 'cache', 'seyfert_commands.json')
});

declare module 'seyfert' {
    interface RegisteredMiddlewares
        extends ParseMiddlewares<typeof middlewares> { }

    interface ExtendedRC { }

    interface UsingClient extends ParseClient<Client<true>> {
        api: Api;
        redis: ReturnType<typeof createClient>;
    }

    interface DefaultLocale extends ParseLocales<typeof import('./locales/en-US/_')['default']> { }

    interface ExtraProps {
        ratelimit?: Ratelimit;
    }
}
export interface HerouwuDTO {
    readonly name: string;
    readonly fullName: string;
    readonly role: string;
    readonly difficulty: number;
    readonly stats: HerouwuDTOStats;
    readonly lore: Lore;
    readonly images: Images;
    readonly abilities: Ability[];
}

export interface Ability {
    readonly id: string;
    readonly name: string;
    readonly icon: string;
    readonly description: string;
    readonly stats: AbilityStats;
}

export interface AbilityStats {
    readonly Key: string;
    readonly Casting?: string;
    readonly Damage?: string;
    readonly 'Attack Range'?: string;
    readonly 'Attack Interval'?: string;
    readonly 'Special Effect'?: string;
    readonly 'Movement Boost'?: string;
    readonly Duration?: string;
    readonly 'Spell Field Range'?: string;
    readonly Cooldown?: string;
    readonly 'Maximum Distance'?: string;
    readonly 'Energy Cost'?: string;
    readonly Range?: string;
    readonly 'Bonus Health Growth'?: string;
    readonly 'Bonus Max Health'?: string;
}

export interface Images {
    readonly card: string;
    readonly story: string;
    readonly base: string[];
    readonly playerheads: string[];
    readonly nameplates: string[];
    readonly lordIcons: any[];
    readonly killIcons: any[];
    readonly costumes: Costume[];
}

export interface Costume {
    readonly name: string;
    readonly description: string;
    readonly price: Price;
    readonly source: Source;
    readonly image: string;
}

export interface Price {
    readonly amount: string;
}

export interface Source {
    readonly name: string;
    readonly date: string;
    readonly uuid: string;
    readonly season: string;
    readonly quality: string;
}

export interface Lore {
    readonly fullLore: string;
}

export interface HerouwuDTOStats {
    readonly base: Base;
    readonly competive: Competive;
}

export interface Base {
    readonly Health: string;
    readonly 'Movement Speed': string;
}

export interface Competive {
    readonly matches: number;
    readonly wins: number;
    readonly bans: number;
    readonly winRate: string;
}
