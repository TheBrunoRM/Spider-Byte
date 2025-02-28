import { type CommandContext, createStringOption, AttachmentBuilder, SubCommand, LocalesT, Declare, Options } from 'seyfert';
import { join } from 'node:path';

import { generateProfile } from '../../utils/images/profile';

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

    const [player, playerID] = await ctx.client.api.getPlayer(nameOrId);

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

    const buffer = await generateProfile(player.data, playerID);
    await ctx.editOrReply({
      files: [
        new AttachmentBuilder().setName('profile.png').setFile('buffer', buffer)
      ]
    });
  }
}
