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
    name: 'update',
    description: 'Update a player\'s stats.'
})
@LocalesT('commands.core.update.name', 'commands.core.update.description')
@Options(options)
export default class UpdateCommand extends SubCommand {
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

        const sucess = await ctx.client.api.updatePlayer(player.uid);
        if (!sucess) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.update.alrreadyQueued(
                    player.name,
                    player.player.team.club_team_id,
                    player.uid
                ).get()
            });
        }

        return ctx.editOrReply({
            content: ctx.t.commands.core.update.success(
                player.name,
                player.player.team.club_team_id,
                player.uid
            ).get()
        });
    }
}
