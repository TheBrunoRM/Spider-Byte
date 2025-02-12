import { CooldownType, Cooldown } from '@slipher/cooldown';
import { AutoLoad, Declare, Command } from 'seyfert';


@Declare({
    name: 'player',
    description: 'player commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@Cooldown({
    type: CooldownType.User,
    interval: 1_000 * 60,
    uses: {
        default: 2
    }
})
@AutoLoad()
export default class PlayerCommand extends Command { }
