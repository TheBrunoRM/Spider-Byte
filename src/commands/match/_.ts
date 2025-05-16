import { AutoLoad, LocalesT, Declare, Command } from 'seyfert';

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
@LocalesT('commands.match.name', 'commands.match.description')
export default class MatchCommand extends Command { }
