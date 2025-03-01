import type { CommandContext } from 'seyfert';

import { createStringOption, SubCommand, LocalesT, Declare, Options } from 'seyfert';

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
    description: 'Update a player\'s stats.',
    props: {
        ratelimit: {
            time: 15e3,
            type: 'user'
        }
    }
})
@LocalesT('commands.core.update.name', 'commands.core.update.description')
@Options(options)
export default class UpdateCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply(true);

        const nameOrId = ctx.options['name-or-id'];
        if (!nameOrId) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.noNameOrId.get()
            });
        }

        const cacheKey = `command:update/${nameOrId}`;

        if (await ctx.client.redis.EXISTS(cacheKey)) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.update.updatedRecently(
                    nameOrId
                ).get()
            });
        }

        const player = await ctx.client.api.getPlayer(nameOrId);
        if (!player) {
            return ctx.editOrReply({
                content: ctx.t.commands.commonErrors.playerNotFound.get()
            });
        }

        const result = await ctx.client.api.updatePlayer(player.uid);
        if (!result?.success) {
            return ctx.editOrReply({
                content: ctx.t.commands.core.update.cantUpdate(
                    player.name,
                    player.player.team.club_team_id,
                    player.uid
                ).get()
            });
        }

        await ctx.client.redis.SET(cacheKey, '1', {
            EX: 60
        });

        return ctx.editOrReply({
            content: ctx.t.commands.core.update.success(
                player.name,
                player.player.team.club_team_id,
                player.uid
            ).get()
        });
    }
}
