import type { CommandContext } from 'seyfert';

import { LocalesT, Command, Declare } from 'seyfert';

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

@LocalesT('commands.ping.name', 'commands.ping.description')
export default class Ping extends Command {
    async run(ctx: CommandContext) {
        const avgLatency = ctx.client.gateway.latency;
        const shard = ctx.client.gateway.get(ctx.shardId);
        const shardPing = shard ? Math.floor(await shard.ping()) : Infinity;

        await ctx.editOrReply({
            content: ctx.t.commands.ping.content(avgLatency, shardPing).get()
        });
    }
}
