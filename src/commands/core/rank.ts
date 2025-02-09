import { type CommandContext, createStringOption, SubCommand, Declare, Options } from 'seyfert';

import { createRankTimeline } from '../../utils/functions/rank-timeline';

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
        console.log(player?.name);
        if (!player) {
            return ctx.editOrReply({
                content: 'Player not found. Please provide a valid player name or id'
            });
        }

        const timeline = createRankTimeline(player.rank_history);

        return ctx.editOrReply({
            content: [
                `**${player.name}#${player.player.team.club_team_mini_name}** (${player.uid})`,
                'Ranked Timeline:',
                timeline.map((entry) => `\`${entry.lastRank}\` -> \`${entry.newRank}\`. ${entry.totalScore.toFixed(1)} score (<t:${entry.timestamp}:R>)`).join('\n')
            ].join('\n')
        });

    }
}
