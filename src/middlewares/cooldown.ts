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
        const remaining = Formatter.timestamp(new Date(Date.now() + inCooldown), TimestampStyle.RelativeTime);
        stop(
            context.t.commands.middlewares.cooldown.error.content(remaining).get()
        );
        return;
    }

    next();
});
