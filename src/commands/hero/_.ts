import { AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'hero',
    description: 'Access hero profiles, abilities, stats, and competitive rankings',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall'],
    props: {
        ratelimit: {
            time: 10_000,
            type: 'user'
        }
    }
})
@AutoLoad()
export default class HeroCommand extends Command { }
