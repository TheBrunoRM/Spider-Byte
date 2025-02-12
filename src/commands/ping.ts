import type { CommandContext } from 'seyfert';

import { CooldownType, Cooldown } from '@slipher/cooldown';
import { Command, Declare } from 'seyfert';

@Declare({
    name: 'ping',
    description: 'pong',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@Cooldown({
    type: CooldownType.User,
    interval: 5_000,
    uses: {
        default: 1
    }
})
export default class Ping extends Command {
    async run(ctx: CommandContext) {
        const avgLatency = ctx.client.gateway.latency;

        await ctx.editOrReply({
            content: ctx.t.commands.ping.content(avgLatency).get()
        });
    }
}
