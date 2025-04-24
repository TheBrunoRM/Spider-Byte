import type { CommandContext, OKFunction } from 'seyfert';

import { createIntegerOption, createStringOption, createNumberOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';

import { createMatchHistoryImage } from '../../utils/images/match-history';

const options = {
    username: createStringOption({
        description: 'The username to view match history for.',
        required: true,
        async value({ context, value }, ok: OKFunction<string>, fail) {
            await context.deferReply();

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
        const player = await ctx.client.api.getPlayer(ctx.options.username);
        if (!player) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.playerNotFound.get()
            });
        }
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

        const image = await createMatchHistoryImage(player, history, ctx.options.season, ctx.options.game_mode);

        return ctx.editOrReply({
            files: [{
                filename: 'history.png',
                data: image
            }]
        });
    }
}
