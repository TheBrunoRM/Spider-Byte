import { CooldownType, Cooldown } from '@slipher/cooldown';
import { AutoLoad, Declare, Command } from 'seyfert';


@Declare({
    name: 'hero',
    description: 'hero commands',
    contexts: ['BotDM', 'Guild', 'PrivateChannel'],
    integrationTypes: ['GuildInstall', 'UserInstall']
})
@Cooldown({
    type: CooldownType.User,
    interval: 1_000 * 60,
    uses: {
        default: 3
    }
})
@AutoLoad()
export default class HeroCommand extends Command { }
