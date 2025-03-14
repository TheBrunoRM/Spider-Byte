import { type CommandContext, createStringOption, SubCommand, Formatter, LocalesT, Declare, Options, Embed } from 'seyfert';

import mapsJson from '../../../assets/json/maps.json';


const options = {
    name: createStringOption({
        description: 'The name of the map',
        locales: {
            description: 'commands.game.map.options.name'
        },
        choices: mapsJson.maps.slice(0, 25).map((map) => ({
            name: map.full_name,
            value: map.id.toString()
        })),
        required: true
    })
};

@Declare({
    name: 'map',
    description: 'Get the information of a map'
})
@LocalesT('commands.game.map.name', 'commands.game.map.description')
@Options(options)
export default class MapCommand extends SubCommand {
    async run(ctx: CommandContext<typeof options>) {
        await ctx.deferReply();

        const mapId = parseInt(ctx.options.name);

        const map = mapsJson.maps.find((m) => m.id === mapId) ?? null;

        if (!map) {
            return ctx.editOrReply({
                content: ctx.t.commands.game.map.notFound.get()
            });
        }

        const mapEmbed = new Embed()
            .setTitle(map.full_name)
            .setDescription(map.description)
            .setColor('Blurple')
            .setImage(ctx.client.api.buildImage(map.images[2].replace('/rivals', '')))
            .addFields([
                {
                    name: Formatter.underline('Game Mode'),
                    value: map.game_mode,
                    inline: true
                },
                {
                    name: Formatter.underline('Competitiveness'),
                    value: map.is_competitve
                        ? 'Competitive'
                        : 'Casual',
                    inline: true
                },
                {
                    name: Formatter.underline('Location'),
                    value: map.location,
                    inline: true
                }
            ]);
        if (map.video) {
            mapEmbed.setURL(map.video);
        }
        if (map.sub_map.id) {
            mapEmbed.addFields({
                name: Formatter.underline('Sub Map'),
                value: `* ${map.sub_map.id} - ${map.sub_map.name ?? 'N/A'}`,
                inline: true
            });
        }

        return ctx.editOrReply({ embeds: [mapEmbed] });
    }
}
