import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, Declare, Options } from 'seyfert';

const options = {
    name: createStringOption({
        description: 'Enter the player name to identify the player.',
        locales: {
            description: 'commands.commonOptions.nameOrId'
        },
        required: true
    })
};

@Declare({
    name: 'uid',
    description: 'Get the player UID by the player name.'
})
@Options(options)
export default class RankCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const nameOrId = ctx.options.name;
        const result = await ctx.client.api.searchPlayer(nameOrId);

        if (!result) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.playerNotFound.get()
            });
        }

        await ctx.editOrReply({
            content: `**${result.name}** (${result.uid})`
        });
    }
}
