import { Middlewares, AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'hero',
    description: 'hero commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall'],
    props: {
        ratelimit: {
            time: 10_000,
            type: 'user'
        }
    }
})
@Middlewares(['cooldown'])
@AutoLoad()
export default class HeroCommand extends Command { }
