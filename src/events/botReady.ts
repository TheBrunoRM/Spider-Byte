import { createEvent } from 'seyfert';

export default createEvent({
    data: {
        name: 'botReady'
    },
    async run(user, client) {
        client.logger.info(`Logged in as ${user.username}#${user.discriminator} (${user.id})`);
        await client.topgg.postStats({
            serverCount: (await client.guilds.list()).length,
            shardCount: client.gateway.totalShards
        });
    }
});
