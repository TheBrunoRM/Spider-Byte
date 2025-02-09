import { AutoLoad, Declare, Command } from 'seyfert';


@Declare({
    name: 'player',
    description: 'player commands'
})
@AutoLoad()
export default class PlayerCommand extends Command { }
