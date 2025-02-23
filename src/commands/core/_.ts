import { AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'player',
    description: 'View player profiles, compare stats, and track rank progression',
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
export default class PlayerCommand extends Command { }
