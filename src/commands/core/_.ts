import { AutoLoad, Declare, Command } from 'seyfert';


@Declare({
    name: 'player',
    description: 'player commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@AutoLoad()
export default class PlayerCommand extends Command { }
