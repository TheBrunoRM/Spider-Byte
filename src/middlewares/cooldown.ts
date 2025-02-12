import { createMiddleware, Formatter } from 'seyfert';
import { TimestampStyle } from 'seyfert/lib/common';

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export default createMiddleware<void>(({ context, next, stop }) => {
    const inCooldown = context.client.cooldown.context(context);


    if (typeof inCooldown === 'number') {
        stop(`:clock1: You are in cooldown. Please wait ${Formatter.timestamp(new Date(Date.now() + inCooldown), TimestampStyle.RelativeTime)} before using this command again.`);
        return;
    }

    next();
});
