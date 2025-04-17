import type { CommandContext } from 'seyfert';

import { createStringOption, createNumberOption, AttachmentBuilder, SubCommand, LocalesT, Declare, Options } from 'seyfert';

import { processRankHistory } from '../../utils/functions/rank-utils';
import { generateRankChart } from '../../utils/images/ranked';

const options = {
    'name-or-id': createStringOption({
        description: 'Enter the player name or ID to identify the player.',
        locales: {
            description: 'commands.commonOptions.nameOrId'
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
    })
};

@Declare({
    name: 'rank',
    description: 'View a timeline graph of a player\'s rank history.'
})
@LocalesT('commands.core.rank.name', 'commands.core.rank.description')
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

        const player = await ctx.client.api.getPlayer(nameOrId, {
            season: ctx.options.season
        });
        if (!player) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.playerNotFound.get()
            });
        }

        if (!player.rank_history.length) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.rank.noRankHistory(player.player.name, player.player.team.club_team_mini_name).get()
            });
        }
        const bufferGraph = await generateRankChart(player, processRankHistory(player.rank_history));

        return ctx.editOrReply({
            files: [
                new AttachmentBuilder()
                    .setName('rank.png')
                    .setFile('buffer', bufferGraph)
            ]
        });
    }
}
