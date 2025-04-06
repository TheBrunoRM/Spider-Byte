import { type ParseMiddlewares, type ParseLocales, type ParseClient, type UsingClient, Formatter, Client } from 'seyfert';
import { PresenceUpdateStatus, ActivityType, MessageFlags } from 'seyfert/lib/types';
import { basename, join, sep } from 'node:path';
import { Api as TopGGAPI } from '@top-gg/sdk';
import { GlobalFonts } from '@napi-rs/canvas';
import { createClient } from '@redis/client';

import type { Ratelimit } from './middlewares/cooldown';

import { WEBHOOK_TOKEN, TOPGG_TOKEN, WEBHOOK_ID, API_KEY } from './utils/env';
import { middlewares } from './middlewares';
import { Api } from './lib/managers/api';
// Register fonts
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxe.otf'), 'RefrigeratorDeluxe');
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxeBold.otf'), 'RefrigeratorDeluxeBold');
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'leaderboard.ttf'), 'leaderboard');

const client = new Client({
    commands: {
        defaults: {
            onRunError(ctx, error) {
                client.logger.error(
                    ctx.author.id,
                    ctx.author.username,
                    ctx.fullCommandName,
                    error
                );

                const content = [
                    'Report this error on the [support server](<https://discord.gg/AcruVkyYHm>).',
                    Formatter.codeBlock((error instanceof Error
                        ? error.message
                        : typeof error === 'object' && error && 'message' in error && typeof error.message === 'string'
                            ? error.message
                            : 'Unknown error').slice(0, 1_500), 'ts')
                ].join('\n');

                void ctx.client.webhooks.writeMessage(WEBHOOK_ID, WEBHOOK_TOKEN, {
                    body: {
                        content: content[1],
                        embeds: [{
                            description: [
                                ctx.author.id,
                                ctx.author.username,
                                ctx.fullCommandName
                            ].join(' | ')
                        }]
                    }
                }).catch((err: unknown) => {
                    ctx.client.logger.error('webhook', err);
                });

                return ctx.editOrReply({
                    content
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
            },
            async onAfterRun(ctx) {
                if (Math.random() < 0.15) {
                    const hasVoted = await ctx.client.topgg.hasVoted(ctx.author.id);
                    if (!hasVoted) {
                        await ctx.followup({
                            content: ctx.t.commands.others.noVoted.get(),
                            flags: MessageFlags.Ephemeral
                        });
                    }
                }
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

client.topgg = new TopGGAPI(TOPGG_TOKEN);

declare module 'seyfert' {
    interface RegisteredMiddlewares
        extends ParseMiddlewares<typeof middlewares> { }

    interface ExtendedRC { }

    interface UsingClient extends ParseClient<Client<true>> {
        api: Api;
        redis: ReturnType<typeof createClient>;
        topgg: TopGGAPI;
    }

    interface DefaultLocale extends ParseLocales<typeof import('./locales/en-US/_')['default']> { }

    interface ExtraProps {
        ratelimit?: Ratelimit;
    }
}
