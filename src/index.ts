import { type ParseLocales, type ParseClient, Client } from 'seyfert';
import { basename, join, sep } from 'node:path';

const client = new Client();

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

await client.start();

console.log(client.langs);

await client.uploadCommands({
    cachePath: join(process.cwd(), 'cache', 'seyfert_commands.json')
});

declare module 'seyfert' {
    interface ExtendedRC {
        apiKey: string;
    }

    interface UsingClient extends ParseClient<typeof client> { }

    interface DefaultLocale extends ParseLocales<typeof import('./locales/en-US/_')['default']> { }
}
