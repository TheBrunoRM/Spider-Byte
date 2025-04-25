import { AutoLoad, Declare, Command } from 'seyfert';

@Declare({
    name: 'account',
    description: 'Manage your linked account',
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
export default class AccountCommand extends Command { }
