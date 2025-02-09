import { type ParseLocales, type ParseClient, type UsingClient, Client } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types';
import { basename, join, sep } from 'node:path';
import { GlobalFonts } from '@napi-rs/canvas';

import { Api } from './lib/managers/api';

// Register fonts
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxe.ttf'), 'RrefrigeratorDeluxe');
GlobalFonts.registerFromPath(join(process.cwd(), 'assets', 'fonts', 'RefrigeratorDeluxeBold.ttf'), 'RefrigeratorDeluxeBold');

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
                const content = `\`\`\`${error instanceof Error
                    ? error.stack ?? error.message
                    : String(error) || 'Unknown error'
                    }\`\`\``;

                return ctx.editOrReply({
                    content
                });
            },
            onMiddlewaresError(ctx, error) {
                return ctx.editOrReply({
                    content: error,
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}) as UsingClient & Client;

client.setServices({
    langs: {
        aliases: {
            'es-419': ['es-ES'],
            'en-US': ['en-GB']
        }
    }
});

client.langs.filter = (path) => basename(path) === '_.ts';

client.langs.onFile = (locale, { path, file }) => file.default
    ? {
        file: file.default,
        locale: path.split(sep).at(-2) ?? locale
    }
    : false;

client.api = new Api((await client.getRC()).apiKeys);

await client.api.getHeroes();

await client.start();

await client.uploadCommands({
    cachePath: join(process.cwd(), 'cache', 'seyfert_commands.json')
});

declare module 'seyfert' {
    interface ExtendedRC {
        apiKeys: string[];
    }

    interface UsingClient extends ParseClient<Client<true>> {
        api: Api;
    }

    interface DefaultLocale extends ParseLocales<typeof import('./locales/en-US/_')['default']> { }
}
