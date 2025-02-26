import { type CommandContext, createStringOption, SubCommand, LocalesT, Declare, Options, Embed } from 'seyfert';

const options = {
  'name-or-id': createStringOption({
    description: 'Enter the player name or ID to identify the player.',
    locales: {
      description: 'commands.commonOptions.nameOrId'
    }
  })
};

@Declare({
  name: 'profile',
  description: 'Get detailed stats like roles, rank, and top heroes for a player.'
})
@LocalesT('commands.core.profile.name', 'commands.core.profile.description')
@Options(options)
export default class ProfileCommand extends SubCommand {
  async run(ctx: CommandContext<typeof options>) {
    await ctx.deferReply();

    const nameOrId = ctx.options['name-or-id'];
    if (!nameOrId) {
      return ctx.editOrReply({
        content: ctx.t.commands.commonErrors.noNameOrId.get()
      });
    }

    const player = await ctx.client.api.getPlayer(nameOrId);
    if (!player) {
      return ctx.editOrReply({
        content: ctx.t.commands.commonErrors.playerNotFound.get()
      });
    }

    const stats = player.segments[0].stats;
    const winRate = stats.matchesWinPct?.value.toFixed(1) || '0.0';

    const heroSegments = player.segments.filter((segment) => segment.type === 'hero');
    const topHeroes = heroSegments
      .sort((a, b) => (b.stats.matchesPlayed?.value || 0) - (a.stats.matchesPlayed?.value || 0))
      .slice(0, 4)
      .map((hero) => {
        const matches = Math.round(hero.stats.matchesPlayed?.value || 0);
        const winPct = hero.stats.matchesWinPct?.value.toFixed(1) || '0.0';
        return `\`${hero.metadata.name}\`, ${matches} matches (${winPct}% WR)`;
      });

    const roleStats = player.segments.filter((segment) => segment.type === 'hero-role');
    const roleStatsString = roleStats
      .map((role) => {
        const matches = Math.round(role.stats.matchesPlayed?.value || 0);
        const winPct = role.stats.matchesWinPct?.value.toFixed(1) || '0.0';
        return `\`${role.metadata.name}\`, ${matches} matches (${winPct}% WR)`;
      });

    const embed = new Embed()
      .setTitle(`${player.platformInfo.platformUserHandle}${player.metadata.clubMiniName
        ? ` #${player.metadata.clubMiniName}`
        : ''}`)
      .setThumbnail(player.platformInfo.avatarUrl)
      .setColor('Blurple')
      .addFields(
        {
          name: 'General Stats',
          value: [
            `\`Level:\` ${player.metadata.level}`,
            `\`Rank:\` ${stats.ranked?.metadata.tierName || 'Unranked'} (${stats.ranked?.displayValue || '0'} RS)`,
            `\`Win Rate:\` ${winRate}%`,
            `\`Time Played:\` ${stats.timePlayed?.displayValue || 'N/A'}`
          ].join('\n'),
          inline: false
        },
        {
          name: 'Combat Stats',
          value: [
            `\`Matches:\` ${stats.matchesPlayed?.value || 0}`,
            `\`Wins:\` ${stats.matchesWon?.value || 0}`,
            `\`KDA:\` ${stats.kills?.value || 0}/${stats.deaths?.value || 0}/${stats.assists?.value || 0} (${stats.kdaRatio?.displayValue || 'N/A'})`,
            `\`Damage/Min:\` ${stats.totalHeroDamagePerMinute?.value || 0}`
          ].join('\n'),
          inline: true
        },
        {
          name: 'Additional Stats',
          value: [
            `\`Solo Kills:\` ${stats.soloKills?.value || 0}`,
            `\`MVPs:\` ${stats.totalMvp?.value || 0}`,
            `\`SVPs:\` ${stats.totalSvp?.value || 0}`
          ].join('\n'),
          inline: true
        },
        {
          name: 'Most Played Heroes',
          value: topHeroes.join('\n') || 'No heroes played',
          inline: false
        },
        {
          name: 'Role Stats',
          value: roleStatsString.join('\n') || 'No role stats',
          inline: true
        }
      )
      .setTimestamp();

    return ctx.editOrReply({ embeds: [embed] });
  }
}
