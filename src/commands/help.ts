import type { CommandContext, CommandOption, SubCommand } from 'seyfert';

import { createStringOption, Formatter, LocalesT, Command, Declare, Options, Embed } from 'seyfert';

const options = {
    command: createStringOption({
        description: 'Specific command to get help for',
        locales: {
            description: 'commands.help.options.command'
        },
        required: false,
        autocomplete: (interaction) => {
            const focused = interaction.getInput();
            const commands = interaction.client.commands.values;

            const matchedCommands = focused
                ? commands.filter((cmd) => cmd.name.toLowerCase().includes(focused.toLowerCase()))
                : commands;

            return interaction.respond(
                matchedCommands
                    .map((cmd) => ({
                        name: `${cmd.name} - ${cmd.description.slice(0, 50)}${cmd.description.length > 50
                            ? '...'
                            : ''}`,
                        value: cmd.name
                    }))
                    .slice(0, 25)
            );
        }
    })
};

@Declare({
    name: 'help',
    description: 'Display information about available commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall'],
    props: {
        ratelimit: {
            time: 10_000,
            type: 'user'
        }
    }
})
@LocalesT('commands.help.name', 'commands.help.description')
@Options(options)
export default class HelpCommand extends Command {
    async run(ctx: CommandContext<typeof options>) {
        const commandName = ctx.options.command;

        if (commandName) {
            return this.showCommandDetails(ctx, commandName);
        }

        return this.showCommandList(ctx);
    }

    private async showCommandList(ctx: CommandContext) {
        const commands = ctx.client.commands.values;

        const embed = new Embed(ctx.t.commands.help.embed.get());

        const commandList = commands
            .map((cmd) => `\`/${cmd.name}\` - ${cmd.description}`)
            .join('\n');

        embed.addFields({
            name: ctx.t.commands.help.fields.allCommands.get(),
            value: commandList
        });

        return ctx.editOrReply({ embeds: [embed] });
    }

    private async showCommandDetails(ctx: CommandContext, commandName: string) {
        const command = ctx.client.commands.values.find(
            (cmd) => cmd.name.toLowerCase() === commandName.toLowerCase()
        ) as undefined | Command;

        if (!command) {
            return ctx.editOrReply({
                content: ctx.t.commands.help.noCommandFound.get()
            });
        }

        const commandDetailsEmbed = new Embed(ctx.t.commands.help.commandDetailsEmbed(commandName).get());


        const subcommands = command.options?.filter((opt) => opt.type === 1 || opt.type === 2) as SubCommand[] | undefined;
        if (subcommands?.length) {
            const subcommandsField = subcommands
                .map((sub) => {
                    let text = `**${sub.name}**: ${sub.description_localizations?.[
                        ctx.interaction.locale
                    ] || sub.description}`;
                    if (sub.options?.length) {
                        text += `\n${sub.options
                            .map((opt) => `- \`${opt.name}\`: ${opt.description_localizations?.[
                                ctx.interaction.locale
                            ] || opt.description}`)
                            .join('\n')}`;
                    }
                    return text;
                })
                .join('\n');

            commandDetailsEmbed.addFields({
                name: ctx.t.commands.help.fields.subcommands.get(),
                value: subcommandsField
            });
        }
        const opts = command.options?.filter((opt) => opt.type !== 1 && opt.type !== 2) as CommandOption[] | undefined;
        if (opts?.length) {
            const optionsField = opts
                .map((opt) => `**${opt.name}${opt.required
                    ? '(Req)'
                    : ''}**: ${opt.description_localizations?.[ctx.interaction.locale] || opt.description}`)
                .join('\n');
            commandDetailsEmbed.addFields({
                name: ctx.t.commands.help.fields.options.get(),
                value: optionsField
            });
        }

        const cooldown = command.props.ratelimit;
        if (cooldown) {
            commandDetailsEmbed.addFields({
                name: ctx.t.commands.help.fields.cooldown.get(),
                value: `${Formatter.inlineCode(String(cooldown.time / 1_000))} seconds per ${Formatter.inlineCode(cooldown.type)}`
            });
        }

        return ctx.editOrReply({ embeds: [commandDetailsEmbed] });
    }

}
