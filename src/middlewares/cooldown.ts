import { createMiddleware, Formatter } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export default createMiddleware<void>(({ context, next, stop }) => {
    const cuties = new Set(['507367752391196682', '221399196480045056', '1076700780175831100']);
    if (cuties.has(context.author.id)) {
        next();
        return;
    }

    const inCooldown = context.client.cooldown.context(
        // @ts-expect-error
        context
    );

    if (typeof inCooldown === 'number') {
        stop(`:clock1: You are in cooldown. Please wait ${Formatter.timestamp(new Date(Date.now() + inCooldown), TimestampStyle.RelativeTime)} before using this command again.`);
        return;
    }

    next();
});
