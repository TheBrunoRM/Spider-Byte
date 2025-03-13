import { AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'match',
    description: 'View match details and history',
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
export default class MatchCommand extends Command { }
