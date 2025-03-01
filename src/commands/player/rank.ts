import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';
import { join } from 'node:path';

import { generateRankGraph } from '../../utils/images/ranked';

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

        if ('errors' in player) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.privateProfile.get(),
                files: [
                    {
                        data: await Bun.file(
                            join(process.cwd(), 'assets', 'private-profile.png')
                        ).bytes(),
                        filename: 'private-profile.png'
                    }
                ]
            });
        }

        if (!player.rank_history.length) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.rank.noRankHistory(player.player.name, player.player.team.club_team_mini_name).get()
            });
        }

        const playerRank = await ctx.client.api.getRankedStats(player.player.name);
        if (!playerRank) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.rank.noRankHistory(player.player.name, player.player.team.club_team_mini_name).get()
            });
        }

        const bufferGraph = await generateRankGraph(playerRank.data, player);

        if (!bufferGraph) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.rank.noRankHistory(player.player.name, player.player.team.club_team_mini_name).get()
            });
        }

        return ctx.editOrReply({
            files: [{
                filename: 'rank.png',
                data: bufferGraph
            }]
        });
    }
}
