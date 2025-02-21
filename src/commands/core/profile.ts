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

    const winRate = player.overall_stats.total_matches > 0
      ? (player.overall_stats.total_wins / player.overall_stats.total_matches * 100).toFixed(2)
      : '0.00';

    const topHeroes = [...player.heroes_ranked, ...player.heroes_unranked]
      .filter((hero) => hero.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 4)
      .map((hero) => `\`${hero.hero_name}\` (${hero.matches} matches, ${(hero.wins / hero.matches * 100).toFixed(1)}% WR)`);

    const topTeamMates = player.team_mates
      .filter((mate) => mate.matches > 0)
      .sort((a, b) => b.matches - a.matches)
      .slice(0, 4)
      .map((mate) => `\`${mate.player_info.nick_name}\` (${mate.matches} matches, ${(mate.wins / mate.matches * 100).toFixed(1)}% WR)`);

    const calculateKDA = (kills: number, deaths: number, assists: number) => {
      if (deaths === 0) {
        return '0.00';
      }
      return ((kills + assists) / deaths).toFixed(2);
    };

    const calculateWinRate = (wins: number, matches: number) => {
      if (matches === 0) {
        return '0.00';
      }
      return (wins / matches * 100).toFixed(2);
    };

    const embed = new Embed()
      .setTitle(`${player.name}${player.player.team.club_team_id
        ? `#${player.player.team.club_team_mini_name}`
        : ''}`)
      .setThumbnail(ctx.client.api.buildImage(player.player.icon.player_icon))
      .setImage(ctx.client.api.buildImage(player.player.icon.banner ?? '').replace('/rivals', ''))
      .setColor('Blurple')
      .addFields(
        {
          name: 'General Stats',
          value: [
            `\`Level:\` ${player.player.level}`,
            `\`Rank:\` ${player.player.rank.rank}`,
            `\`Win Rate:\` ${winRate}% (${player.overall_stats.total_wins}/${player.overall_stats.total_matches})`,
            `\`Total Time Played:\` ${formatTime(player.overall_stats.unranked.total_time_played_raw + (player.overall_stats.ranked.total_time_played_raw || 0))}`
          ].join('\n'),
          inline: false
        },
        {
          name: 'Unranked Stats',
          value: [
            `\`Matches:\` ${player.overall_stats.unranked.total_matches}`,
            `\`Wins:\` ${player.overall_stats.unranked.total_wins}`,
            `\`KDA:\` ${player.overall_stats.unranked.total_kills}/${player.overall_stats.unranked.total_deaths}/${player.overall_stats.unranked.total_assists} (${calculateKDA(
              player.overall_stats.unranked.total_kills,
              player.overall_stats.unranked.total_deaths,
              player.overall_stats.unranked.total_assists
            )})`,
            `\`Win Rate:\` ${calculateWinRate(player.overall_stats.unranked.total_wins, player.overall_stats.unranked.total_matches)}%`
          ].join('\n'),
          inline: true
        },
        {
          name: 'Ranked Stats',
          value: [
            `\`Matches:\` ${player.overall_stats.ranked.total_matches}`,
            `\`Wins:\` ${player.overall_stats.ranked.total_wins}`,
            `\`KDA:\` ${player.overall_stats.ranked.total_kills}/${player.overall_stats.ranked.total_deaths}/${player.overall_stats.ranked.total_assists} (${calculateKDA(
              player.overall_stats.ranked.total_kills,
              player.overall_stats.ranked.total_deaths,
              player.overall_stats.ranked.total_assists
            )})`,
            `\`Win Rate:\` ${calculateWinRate(player.overall_stats.ranked.total_wins, player.overall_stats.ranked.total_matches)}%`
          ].join('\n'),
          inline: true
        },
        {
          name: 'Most Played Heroes',
          value: topHeroes.join('\n') || 'No heroes played',
          inline: false
        },
        {
          name: 'Top Team Mates',
          value: topTeamMates.join('\n') || 'No team mates found',
          inline: false
        }
      )
      .setTimestamp()
      .setFooter({ text: `Player ID: ${player.uid}` });

    return ctx.editOrReply({ embeds: [embed] });
  }
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3_600);
  const minutes = Math.floor(seconds % 3_600 / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(' ');
}
