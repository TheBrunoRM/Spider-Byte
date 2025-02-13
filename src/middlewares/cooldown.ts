import type { Snowflake } from 'seyfert/lib/types';

import { LimitedCollection } from 'seyfert/lib/collection';
import { createMiddleware, Formatter } from 'seyfert';

const cooldowns = new LimitedCollection<Snowflake, Ratelimit>({});

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export default createMiddleware<void>(({ context, next, stop }) => {
    if (!context.isChat()) {
        return;
    }
    const commandCooldown = context.resolver.parent?.ratelimit;
    if (!commandCooldown) {
        next(); return;
    }

    const commmandName = context.resolver.fullCommandName;

    const id =
        commandCooldown.type === 'channel'
            ? context.interaction.channel.id || context.author.id // dm channel (?)
            : context.author.id;
    const key = `${id}:${commmandName}`;

    const currentCooldown = cooldowns.raw(key);
    if (!currentCooldown) {
        cooldowns.set(key, commandCooldown, commandCooldown.time);
        next(); return;
    }

    const timeLeft = (currentCooldown.expireOn - Date.now()) / 1_000;
    switch (commandCooldown.type) {
        case 'user':
            stop(context.t.commands.middlewares.cooldown.error.user(
                Formatter.bold(`${timeLeft.toFixed(1)}s`)
            ).get());
            break;
        case 'channel':
            stop(context.t.commands.middlewares.cooldown.error.channel(
                Formatter.bold(`${timeLeft.toFixed(1)}s`)
            ).get());
            break;
    }

    next();
});

export function ApplyCooldown(data: Ratelimit) {
    return <T extends new (...args: any[]) => {}>(target: T) => class extends target {
        ratelimit = data;
    };
}
export interface Ratelimit {
    type: 'channel' | 'user';
    time: number;
}
