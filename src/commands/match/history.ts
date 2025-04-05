import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';

import { STICKY_API_DOMAIN } from '../../utils/env';

const options = {
    username: createStringOption({
        description: 'The username to view match history for.',
        required: true
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

        const history = await ctx.client.api.getMatchHistory(ctx.options.username);
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
