import type { CommandContext } from 'seyfert';

import { Middlewares, Command, Declare } from 'seyfert';

import { ApplyCooldown } from '../middlewares/cooldown';

@Declare({
    name: 'ping',
    description: 'Check the bot\'s latency',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@ApplyCooldown({
    time: 5_000,
    type: 'user'
})
@Middlewares(['cooldown'])
export default class Ping extends Command {
    async run(ctx: CommandContext) {
        const avgLatency = ctx.client.gateway.latency;

        await ctx.editOrReply({
            content: ctx.t.commands.ping.content(avgLatency).get()
        });
    }
}
