import { createEvent } from 'seyfert';

import { isProduction } from '../lib/constants';

export default createEvent({
    data: {
        name: 'botReady',
        once: true
    },
    async run(user, client) {
        client.logger.info(`Logged in as ${user.username}#${user.discriminator} (${user.id})`);
        if (isProduction) {
            await client.topgg.postStats({
                serverCount: (await client.guilds.list()).length,
                shardCount: client.gateway.totalShards
            });
        }
    }
});
