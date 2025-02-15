import { AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'game',
    description: 'game commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall'],
    props: {
        ratelimit: {
            time: 7_000,
            type: 'user'
        }
    }
})
@AutoLoad()
export default class GameCommand extends Command { }
