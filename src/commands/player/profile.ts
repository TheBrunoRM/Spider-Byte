import { type CommandContext, createStringOption, AttachmentBuilder, SubCommand, LocalesT, Declare, Options } from 'seyfert';

import { generateProfile } from '../../utils/images/profile';

const options = {
  'name-or-id': createStringOption({
    description: 'Enter the player name or ID to identify the player.',
    locales: {
      description: 'commands.commonOptions.nameOrId'
    }
  }),
  'game-mode': createStringOption({
    description: 'Choose the game mode to display stats for.',
    required: false,
    choices: [
      {
        name: 'Ranked',
        value: 'ranked'
      },
      {
        name: 'Casual',
        value: 'casual'
      },
      {
        name: 'Both',
        value: 'both'
      }
    ] as const,
    locales: {
      description: 'commands.commonOptions.gameMode'
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

    const nameOrId = ctx.options['name-or-id'] || (await ctx.client.prisma.user.findFirst({
      where: {
        userID: ctx.author.id
      }
    }))?.rivalsUUID;
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

    const buffer = await generateProfile(player, await ctx.client.api.getHeroes(), ctx.options['game-mode']);
    await ctx.editOrReply({
      files: [
        new AttachmentBuilder().setName('profile.png').setFile('buffer', buffer)
      ]
    });
  }
}
