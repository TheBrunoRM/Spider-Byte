import { type CommandContext, createStringOption, SubCommand, Declare, Options } from 'seyfert';

import { generateRankGraph } from '../../utils/images/ranked';

const options = {
    'name-or-id': createStringOption({
        description: 'player name or id'
    })
};

@Declare({
    name: 'rank',
    description: 'get player rank timeline'
})
@Options(options)
export default class RankCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const nameOrId = ctx.options['name-or-id'];
        if (!nameOrId) {
            return ctx.editOrReply({
                content: 'Please provide a player name or id'
            });
        }

        const player = await ctx.client.api.getPlayer(nameOrId);
        if (!player) {
            return ctx.editOrReply({
                content: 'Player not found. Please provide a valid player name or id'
            });
        }

        if (!player.rank_history.length) {
            return ctx.editOrReply({
                content: `**${player.name}${player.player.team.club_team_id === ''
                    ? '** '
                    : `#${player.player.team.club_team_mini_name}** `
                    }(${player.uid}) has no rank history`
            });
        }

        const bufferGraph = await generateRankGraph(player.rank_history, player);

        return ctx.editOrReply({
            content: `**${player.name}${player.player.team.club_team_id === ''
                ? '** '
                : `#${player.player.team.club_team_mini_name}** `
                }(${player.uid}) is a \`${player.player.rank.rank}\``,
            files: [{
                filename: 'rank.png',
                data: bufferGraph
            }]
        });

    }
}
