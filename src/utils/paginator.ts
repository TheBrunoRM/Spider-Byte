import type { ComponentInteractionMessageUpdate, Awaitable } from 'seyfert/lib/common';
import type { APIButtonComponent } from 'seyfert/lib/types';
import type { ButtonInteraction } from 'seyfert';

import { type ListenerOptions, type CommandContext, ActionRow, Button } from 'seyfert';
import { DynamicBucket } from 'seyfert/lib/websocket/structures';
import { ButtonStyle } from 'seyfert/lib/types';

export async function callbackPaginator<T>(ctx: CommandContext, data: T[], options: { callback: (data: T[]) => Awaitable<ComponentInteractionMessageUpdate> } & ListenerOptions = {
    idle: 60e3,
    callback() {
        return { content: 'xd' };
    }
}, pageSize = 10) {
    const chunks = DynamicBucket.chunk(data, pageSize);

    let pageIndex = 0;
    const message = await ctx.editOrReply({
        components: [createButtonRow()],
        content: 'xd'
    }, true);

    const collector = message.createComponentCollector(options);

    collector.run<ButtonInteraction>('first', async (interaction) => {
        pageIndex = 0;
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow()];
        await interaction.update(content);
    });
    collector.run<ButtonInteraction>('back', async (interaction) => {
        pageIndex--;
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow()];
        await interaction.update(content);
    });
    collector.run<ButtonInteraction>('stop', async (interaction) => {
        collector.stop('user_interaction');
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow()];
        await interaction.update(content);
    });
    collector.run<ButtonInteraction>('next', async (interaction) => {
        pageIndex++;
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow()];
        await interaction.update(content);
    });
    collector.run<ButtonInteraction>('last', async (interaction) => {
        pageIndex = data.length - 1;
        const content = await options.callback(chunks[pageIndex]);
        content.components = [createButtonRow()];
        await interaction.update(content);
    });
}

function createButton({ custom_id, label }: {
    label: string;
    custom_id: string;
}) {
    return new Button({
        custom_id,
        label,
        style: ButtonStyle.Danger
    }).toJSON() as APIButtonComponent;
}

function createButtonRow() {
    const buttons: APIButtonComponent[] = [
        createButton({
            custom_id: 'first',
            label: 'First'
        }),
        createButton({
            custom_id: 'back',
            label: 'Back'
        }),
        createButton({
            custom_id: 'stop',
            label: 'Stop'
        }),
        createButton({
            custom_id: 'next',
            label: 'Next'
        }),
        createButton({
            custom_id: 'last',
            label: 'Last'
        })
    ];

    return new ActionRow({
        components: buttons
    });
}
