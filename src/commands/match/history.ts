import type { CommandContext, OKFunction } from 'seyfert';

import { createIntegerOption, createStringOption, createNumberOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';

import { STICKY_API_DOMAIN } from '../../utils/env';

const options = {
    username: createStringOption({
        description: 'The username to view match history for.',
        required: true,
        async value({ context, value }, ok: OKFunction<string>, fail) {
            const data = await context.client.api.searchPlayer(value);
            if (!data) {
                fail(context.t.commands.commonErrors.playerNotFound.get()); return;
            }
            ok(data.uid);
        }
    }),
    season: createNumberOption({
        description: 'Season',
        choices: [{
            name: 'S0: Doom\'s rise',
            value: 0
        }, {
            name: 'S1: Eternal Night Falls',
            value: 1
        }, {
            name: 'S1.5: Eternal Night Falls',
            value: 1.5
        }, {
            name: 'S2: Hellfire Gala',
            value: 2
        }] as const
    }),
    page: createIntegerOption({
        description: 'Page number in pagination'
    }),
    skip: createIntegerOption({
        description: 'Number of matches to skip'
    }),
    game_mode: createIntegerOption({
        description: 'Game mode',
        choices: [{
            name: 'All',
            value: 0
        }, {
            name: 'Quick Play',
            value: 1
        }, {
            name: 'Competitive',
            value: 2
        }, {
            name: 'Custom',
            value: 3
        }, {
            name: 'Tournament',
            value: 9
        }, {
            name: 'Vs AI',
            value: 7
        }] as const
    })
};

@Declare({
    name: 'history',
    description: 'View match history for a specific player.'
})
@LocalesT('commands.match.history.name', 'commands.match.history.description')
@Options(options)
export default class History extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const history = await ctx.client.api.getMatchHistory(ctx.options.username, {
            game_mode: ctx.options.game_mode,
            page: ctx.options.page,
            season: ctx.options.season,
            skip: ctx.options.skip
        });
        if (!history?.match_history.length) {
            return ctx.editOrReply({
                content: ctx.t.commands.match.history.noHistory(ctx.options.username).get()
            });
        }

        const image = await (await fetch(`${STICKY_API_DOMAIN}/match-history`, {
            body: JSON.stringify(history.match_history),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })).arrayBuffer();

        return ctx.editOrReply({
            content: ctx.t.commands.match.history.name.get(),
            files: [{
                filename: 'history.png',
                data: image
            }]
        });
    }
}
