import type { CommandContext } from 'seyfert';

import { Command, Declare } from 'seyfert';

@Declare({
    name: 'ping',
    description: 'Check the bot\'s latency',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall'],
    props: {
        ratelimit: {
            time: 5_000,
            type: 'user'
        }
    }
})
export default class Ping extends Command {
    async run(ctx: CommandContext) {
        const avgLatency = ctx.client.gateway.latency;
        let shardPing = Infinity;
        const shard = ctx.client.gateway.get(ctx.shardId);
        if (shard) {
            shardPing = Math.floor(await shard.ping());
        }

        await ctx.editOrReply({
            content: ctx.t.commands.ping.content(avgLatency, shardPing).get()
        });
    }
}
