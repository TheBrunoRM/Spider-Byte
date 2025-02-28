import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, Declare, Options } from 'seyfert';

const options = {
    'name-or-id': createStringOption({
        description: 'Enter the player name or ID to identify the player.',
        locales: {
            description: 'commands.commonOptions.nameOrId'
        }
    })
};

@Declare({
    name: 'uid',
    description: 'View a timeline graph of a player\'s rank history.'
})
@Options(options)
export default class RankCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const nameOrId = ctx.options['name-or-id'];
        if (!nameOrId) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.noNameOrId.get()
            });
        }

        const result = await ctx.client.api.searchPlayer(nameOrId);
        if (!result) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.playerNotFound.get()
            });
        }

        await ctx.editOrReply({
            content: `${result.name} ${result.uid}`
        });
    }
}
