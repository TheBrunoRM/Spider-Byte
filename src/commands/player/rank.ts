import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';
import { join } from 'node:path';

import { processRankHistory } from '../../utils/functions/rank-utils';
import { generateRankChart } from '../../utils/images/ranked';

const options = {
    'name-or-id': createStringOption({
        description: 'Enter the player name or ID to identify the player.',
        locales: {
            description: 'commands.commonOptions.nameOrId'
        }
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

        const player = await ctx.client.api.getPlayer(nameOrId);
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
        await Bun.write(join(process.cwd(), 'xd.png'), await generateRankChart(processRankHistory(player.rank_history)));

        // if (!bufferGraph) {
        //     return ctx.editOrReply({
        //         content: ctx.t.commands.core.rank.noRankHistory(player.player.name, player.player.team.club_team_mini_name).get()
        //     });
        // }
    }
}
