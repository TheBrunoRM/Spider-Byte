import type { ComponentInteractionMessageUpdate, Awaitable } from 'seyfert/lib/common';
import type { APIButtonComponentWithCustomId } from 'seyfert/lib/types';
import type { ButtonInteraction } from 'seyfert';

import { type ListenerOptions, type CommandContext, ActionRow } from 'seyfert';
import { DynamicBucket } from 'seyfert/lib/websocket/structures';
import { ComponentType, ButtonStyle } from 'seyfert/lib/types';

export async function callbackPaginator<T>(ctx: CommandContext, data: T[], options: { callback: (data: T[], pageIndex: number) => Awaitable<ComponentInteractionMessageUpdate> } & ListenerOptions = {
    idle: 60e3,
    callback() {
        return {};
    },
    filter(interaction) {
        return interaction.user.id === ctx.author.id;
    }
}, pageSize = 10) {
    const chunks = DynamicBucket.chunk(data, pageSize);

    let pageIndex = 0;
    const message = await ctx.editOrReply({
        components: [createButtonRow(chunks, pageIndex)]
    }, true);

    const collector = message.createComponentCollector(options);

    collector.run<ButtonInteraction>('first', async (interaction) => {
        pageIndex = 0;
        const content = await options.callback(chunks[pageIndex], pageIndex);
        content.components = [createButtonRow(chunks, pageIndex)];
        await ctx.editResponse(content);
        await interaction.deferUpdate().catch(() => null);
    });
    collector.run<ButtonInteraction>('back', async (interaction) => {
        pageIndex--;
        const content = await options.callback(chunks[pageIndex], pageIndex);
        content.components = [createButtonRow(chunks, pageIndex)];
        await ctx.editResponse(content);
        await interaction.deferUpdate().catch(() => null);
    });
    collector.run<ButtonInteraction>('stop', async () => {
        collector.stop('user_interaction');
        // await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex], pageIndex);
        content.components = [createButtonRow(chunks, pageIndex, true)];
        await ctx.editResponse(content);
    });
    collector.run<ButtonInteraction>('next', async (interaction) => {
        pageIndex++;
        const content = await options.callback(chunks[pageIndex], pageIndex);
        content.components = [createButtonRow(chunks, pageIndex)];
        await ctx.editResponse(content);
        await interaction.deferUpdate().catch(() => null);
    });
    collector.run<ButtonInteraction>('last', async (interaction) => {
        pageIndex = chunks.length - 1;
        const content = await options.callback(chunks[pageIndex], pageIndex);
        content.components = [createButtonRow(chunks, pageIndex)];
        await ctx.editResponse(content);
        await interaction.deferUpdate().catch(() => null);
    });
}

function createButton(data: Omit<APIButtonComponentWithCustomId, 'style' | 'type'>) {
    return {
        ...data,
        style: ButtonStyle.Danger,
        type: ComponentType.Button
    } satisfies APIButtonComponentWithCustomId;
}

function createButtonRow<T>(chunks: T[][], pageIndex = 0, disabled?: true) {
    const buttons: APIButtonComponentWithCustomId[] = [
        createButton({
            custom_id: 'first',
            label: 'First',
            disabled: pageIndex === 0 || disabled
        }),
        createButton({
            custom_id: 'back',
            label: 'Back',
            disabled: pageIndex === 0 || disabled
        }),
        createButton({
            custom_id: 'stop',
            label: 'Stop',
            disabled
        }),
        createButton({
            custom_id: 'next',
            label: 'Next',
            disabled: pageIndex + 1 === chunks.length || disabled
        }),
        createButton({
            custom_id: 'last',
            label: 'Last',
            disabled: pageIndex + 1 === chunks.length || disabled
        })
    ];

    return new ActionRow({
        components: buttons
    });
}
