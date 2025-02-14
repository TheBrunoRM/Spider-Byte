import { type CommandContext, createStringOption, SubCommand, Declare, Options } from 'seyfert';

import { generateCompare } from '../../utils/images/compare';
// import { comparePlayers } from '../../utils/functions/comparePlayers';

const options = {
    'name-or-id': createStringOption({
        description: 'first player name or id to compare'
    }),
    'name-or-id2': createStringOption({
        description: 'second player name or id to compare'
    })
};

@Declare({
    name: 'compare',
    description: 'Compare the statistics of two players'
})
@Options(options)
export default class CompareCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const firsrTameOrId = ctx.options['name-or-id'];
        const secondNameOrId = ctx.options['name-or-id2'];
        if (!firsrTameOrId || !secondNameOrId || firsrTameOrId === secondNameOrId) {
            return ctx.editOrReply({
                content: 'Please provide two different player names or ids to compare'
            });
        }

        const playerOne = await ctx.client.api.getPlayer(firsrTameOrId);
        const playerTwo = await ctx.client.api.getPlayer(secondNameOrId);
        if (!playerOne || !playerTwo) {
            return ctx.editOrReply({
                content: 'Player not found. Please provide a valid player name or id'
            });
        }

        const image = await generateCompare([playerOne, playerTwo]);

        return ctx.editOrReply({
            files: [{
                data: image,
                filename: 'compare.png'
            }]
        });

    }
}
