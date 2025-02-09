import { AutoLoad, Declare, Command } from 'seyfert';


@Declare({
    name: 'hero',
    description: 'hero commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@AutoLoad()
export default class HeroCommand extends Command { }
