import type { MakeRequired } from 'seyfert/lib/common';
import type { APIEmoji } from 'seyfert/lib/types';
import type { CommandContext } from 'seyfert';

import didYouMean, { ReturnTypeEnums } from 'didyoumean2';

export async function getEmoji(
    ctx: CommandContext,
    input: string
): Promise<APIEmoji | null> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const emojis = (await ctx.client.applications.listEmojis(
        ctx.client.botId
    )).emojis ?? [];

    if (!emojis.length) {
        return null;
    }

    const emojiNames = emojis
        .filter((emoji): emoji is MakeRequired<APIEmoji, 'name'> => !emoji.name)
        .map((emoji) => emoji.name);

    const result = didYouMean(input, emojiNames, {
        returnType: ReturnTypeEnums.ALL_SORTED_MATCHES,
        threshold: 0.1
    }).slice(0, 5);

    if (!result.length) {
        return null;
    }

    const matchedEmoji = emojis.find((emoji) => emoji.name === result[0]);

    return matchedEmoji ?? null;
}
