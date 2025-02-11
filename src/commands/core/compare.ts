import { type CommandContext, createStringOption, SubCommand, Declare, Options } from 'seyfert';

// import { comparePlayers } from '../../utils/functions/comparePlayers';
import { getEmoji } from '../../utils/functions/getEmoji';

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
    description: 'Compare two players stats'
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

        const playerOneData = await ctx.client.api.getPlayer(firsrTameOrId);
        const playerTwoData = await ctx.client.api.getPlayer(secondNameOrId);
        if (!playerOneData || !playerTwoData) {
            return ctx.editOrReply({
                content: 'Player not found. Please provide a valid player name or id'
            });
        }

        // const comparison = comparePlayers(playerOneData, playerTwoData);
        console.log(await getEmoji(ctx, 'SilverRank'));

        return ctx.editOrReply({
            content: 'Command under development. Please check back later. Sorry for the inconvenience'
        });

    }
}
