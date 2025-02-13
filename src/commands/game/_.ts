import { Middlewares, AutoLoad, Declare, Command } from 'seyfert';

import { ApplyCooldown } from '../../middlewares/cooldown';

@Declare({
    name: 'game',
    description: 'game commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@ApplyCooldown({
    time: 7_000,
    type: 'user'
})
@Middlewares(['cooldown'])
@AutoLoad()
export default class GameCommand extends Command { }
