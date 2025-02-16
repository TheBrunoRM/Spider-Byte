import { type CommandContext, createStringOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';

const options = {
  'name-or-id': createStringOption({
    description: 'Enter the player name or ID to identify the player.',
    locales: {
      description: 'commands.commonOptions.nameOrId'
    }
  })
};

@Declare({
  name: 'profile',
  description: 'Get detailed stats like roles, rank, and top heroes for a player.'
})
@LocalesT('commands.core.profile.name', 'commands.core.profile.description')
@Options(options)
export default class ProfileCommand extends SubCommand {
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

    return ctx.editOrReply({
      content: [
        `**${player.name}${player.player.team.club_team_id === ''
          ? '** '
          : `#${player.player.team.club_team_mini_name}** `
        }(${player.uid})`,
        `Level: ${player.player.level}`,
        `Rank: ${player.player.rank.rank}`
      ].join('\n')
    });

  }
}
