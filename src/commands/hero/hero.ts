import type { ButtonInteraction } from 'seyfert';

import {
    createStringOption,
    StringSelectOption,
    StringSelectMenu,
    SubCommand,
    ActionRow,
    Declare,
    Options,
    Embed
} from 'seyfert';
import { type CommandContext, type OKFunction, Button } from 'seyfert';
import didYouMean, { ReturnTypeEnums } from 'didyoumean2';
import { ButtonStyle } from 'seyfert/lib/types';

import type { HeroesDTO, Ability } from '../../types/dtos/HeroesDTO';

import { capitalize } from '../../utils/functions/capitalize';

const options = {
    name: createStringOption({
        description: 'The hero you want to get information about',
        async autocomplete(interaction) {
            const heroes = await interaction.client.api.getHeroes();
            const result = didYouMean(
                interaction.getInput(),
                heroes.map((hero) => hero.name),
                {
                    returnType: ReturnTypeEnums.ALL_SORTED_MATCHES,
                    threshold: 0.1
                }
            ).slice(0, 25);

            return interaction.respond(
                result.map((heroName) => ({
                    name: heroName,
                    value: heroName
                }))
            );
        },
        async value({ value, context: ctx }, ok: OKFunction<HeroesDTO>, fail) {
            const hero = (await ctx.client.api.getHeroes()).find(
                (h) => h.name === value
            );
            if (!hero) {
                fail(`Invalid hero ${value}`);
                return;
            }

            ok(hero);
        },
        required: true
    })
};

@Declare({
    name: 'about',
    description: 'Get information about a hero'
})
@Options(options)
export default class Ping extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        const hero = ctx.options.name;

        const baseEmbed = new Embed().setColor('Random');

        baseEmbed.setThumbnail(
            `https://mrapi.org/assets/characters/${xdxdx(
                hero.name.replaceAll(' ', '-')
            )}-square.png`
        );
        baseEmbed.setAuthor({
            name: `${hero.real_name} (${capitalize(hero.name)})`,
            iconUrl: `https://mrapi.org/assets/characters/${xdxdx(
                hero.name.replaceAll(' ', '-')
            )}-logo-small.png`
        });

        const heroEmbed = new Embed(baseEmbed.toJSON());
        heroEmbed.setDescription(hero.bio);

        const loreEmbed = new Embed(baseEmbed.toJSON());
        loreEmbed.setDescription(hero.lore);

        const message = await ctx.editOrReply(
            {
                embeds: [heroEmbed],
                components: [this.generateRows('hero')]
            },
            true
        );

        const collector = message.createComponentCollector({
            idle: 60 * 60 * 1e3,
            filter(interaction) {
                return interaction.user.id === ctx.author.id;
            }
        });

        collector.run<ButtonInteraction>('hero', (interaction) => interaction.update({
            embeds: [heroEmbed],
            components: [this.generateRows('hero')]
        }));

        collector.run<ButtonInteraction>('lore', (interaction) => interaction.update({
            embeds: [loreEmbed],
            components: [this.generateRows('lore')]
        }));

        collector.run<ButtonInteraction>('abilities', (interaction) => interaction.update({
            embeds: [loreEmbed],
            components: [this.generateActionRowSelectMenu(hero.abilities)]
        }));
    }

    generateRows(clicked: 'hero' | 'lore') {
        const row = new ActionRow<StringSelectMenu | Button>();

        const heroButton = new Button()
            .setLabel('Hero')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('hero')
            .setDisabled(clicked === 'hero');

        const loreButton = new Button()
            .setLabel('Lore')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('lore')
            .setDisabled(clicked === 'lore');

        const abilitiesButton = new Button()
            .setLabel('Abilities')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('abilities');

        return row.addComponents(heroButton, loreButton, abilitiesButton);
    }

    generateActionRowSelectMenu(
        abilities: Ability[]
    ): ActionRow<StringSelectMenu | Button> {
        const row = new ActionRow<StringSelectMenu | Button>();

        const selectMenu = new StringSelectMenu()
            .setCustomId('abilitiesMenu')
            .setPlaceholder('Select an ability')
            .setOptions(
                abilities.map((ability) => {
                    const option = new StringSelectOption()
                        .setLabel(ability.name!)
                        .setValue(String(ability.id));

                    return option;
                })
            );

        const backButton = new Button()
            .setLabel('Back')
            .setStyle(ButtonStyle.Primary)
            .setCustomId('back');

        return row.addComponents(selectMenu, backButton);
    }
}

function xdxdx(name: string) {
    switch (name) {
        case 'hulk':
            return 'bruce-banner';
    }
    return name;
}
