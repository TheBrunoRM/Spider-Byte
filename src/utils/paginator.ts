import type { ComponentInteractionMessageUpdate, Awaitable } from 'seyfert/lib/common';
import type { APIButtonComponentWithCustomId } from 'seyfert/lib/types';
import type { ButtonInteraction } from 'seyfert';

import { type ListenerOptions, type CommandContext, ActionRow } from 'seyfert';
import { DynamicBucket } from 'seyfert/lib/websocket/structures';
import { ComponentType, ButtonStyle } from 'seyfert/lib/types';

export async function callbackPaginator<T>(ctx: CommandContext, data: T[], options: { callback: (data: T[]) => Awaitable<ComponentInteractionMessageUpdate> } & ListenerOptions = {
    idle: 60e3,
    callback() {
        return { content: 'xd' };
    }
}, pageSize = 10) {
    const chunks = DynamicBucket.chunk(data, pageSize);

    let pageIndex = 0;
    const message = await ctx.editOrReply({
        components: [createButtonRow(chunks, pageIndex)],
        content: 'xd'
    }, true);

    const collector = message.createComponentCollector(options);

    collector.run<ButtonInteraction>('first', async (interaction) => {
        pageIndex = 0;
        await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow(chunks, pageIndex)];
        await interaction.editResponse(content);
    });
    collector.run<ButtonInteraction>('back', async (interaction) => {
        pageIndex--;
        await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow(chunks, pageIndex)];
        await interaction.editResponse(content);
    });
    collector.run<ButtonInteraction>('stop', async (interaction) => {
        collector.stop('user_interaction');
        await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow(chunks, pageIndex, true)];
        await interaction.editResponse(content);
    });
    collector.run<ButtonInteraction>('next', async (interaction) => {
        pageIndex++;
        await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow(chunks, pageIndex)];
        await interaction.editResponse(content);
    });
    collector.run<ButtonInteraction>('last', async (interaction) => {
        pageIndex = chunks.length - 1;
        await interaction.deferUpdate();
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow(chunks, pageIndex)];
        await interaction.editResponse(content);
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
