export const commands = {
    others: {
        noVoted: 'Consider voting for us on top.gg to get more features. [Click here](https://top.gg/bot/1337677960546881587/vote).'
    },
    commonErrors: {
        playerNotFound: ':warning: Player not found. Provide a valid name or ID and try again.',
        noNameOrId: ':warning: No player name or ID provided. This is required to proceed.',
        underDevelopment: ':warning: This command is under development. It will be available soon. Sorry for the inconvenience.',
        privateProfile: ':warning: This profile is set to private in game. To change this, follow the directions shown and try again.'
    },
    commonOptions: {
        nameOrId: 'Enter the player name to identify the player.',
        gameMode: 'Choose the game mode to display stats for.'
    },
    middlewares: {
        cooldown: {
            error: {
                user: (remaining: string) => `⏰ You're on cooldown. Wait ${remaining} to use this command again.`,
                channel: (remaining: string) => `⏰ Channel on cooldown. Wait ${remaining} to use this command again.`
            }
        }
    },
    profile: {
        options: {
            imageVersion: 'Choose the image version to display stats for.'
        }
    },
    help: {
        name: 'help',
        description: 'Display information about available commands.',
        options: {
            command: 'Specific command to get help for.'
        },
        noCommandFound: ':warning: Command not found. Check the command name and try again.',
        embed: {
            title: '📚 Available Commands',
            description: 'Here are all available commands.\nUse `/help command:commandname` for detailed information.',
            color: 0x2B2D31,
            timestamp: new Date().toISOString()
        },
        commandDetailsEmbed: (commandName: string) => ({
            title: `Command \`/${commandName}\``,
            description: 'Detailed information about the command.',
            color: 0x2B2D31,
            timestamp: new Date().toISOString()
        }),
        fields: {
            allCommands: '📑 Commands',
            subcommands: '📑 SubCommands',
            options: '⚙️ Options',
            cooldown: '⏱️ Cooldown'
        }
    },
    ping: {
        name: 'ping',
        content: (avglatency: number, shardLatency: number) => `Ping: ${avglatency}ms. Current server latency. Shard latency: ${shardLatency}ms.`
    },
    core: {
        compare: {
            name: 'compare',
            description: 'Compare stats of two players, including kills, wins, and MVP times.',
            samePlayer: ':warning: Same player provided twice. Use two different names or IDs.',
            options: {
                first: 'First player name or ID to compare.',
                second: 'Second player name or ID to compare.'
            }
        },
        profile: {
            name: 'profile',
            description: 'Get detailed stats like roles, rank, and top heroes for a player.'
        },
        rank: {
            name: 'rank',
            description: 'View a timeline graph of a player\'s rank history.',
            noRankHistory: (playerName: string, clubTeamId: string | null) => `:warning: **${playerName}${clubTeamId
                ? `#${clubTeamId}** `
                : '** '} has no rank history.`
        },
        update: {
            name: 'update',
            description: 'Update a player\'s stats.',
            updatedRecently: (playerName: string) => `:warning: **${playerName}** has been updated recently. Try again later.`,
            cantUpdate: (playerName: string, clubTeamId: string, uid: number) => `Can't update **${playerName}${clubTeamId === ''
                ? '** '
                : `#${clubTeamId}** `}(${uid}) stats. Try again later.`,
            success: (playerName: string, clubTeamId: string, uid: number) => `:white_check_mark: **${playerName}${clubTeamId === ''
                ? '** '
                : `#${clubTeamId}** `}(${uid}) stats has been updated. Data may take up to a while to reflect.`
        }
    },
    game: {
        patchNotes: {
            name: 'patch-notes',
            description: 'Get the latest patch notes or patch notes for a specific ID.',
            notFound: (id: string) => `:warning: Patch notes with ID ${id} not found. Check the ID and try again.`,
            noPatchNotes: ':warning: No patch notes available at the moment.',
            options: {
                id: 'The patch notes ID to retrieve specific updates.'
            }
        },
        map: {
            name: 'map',
            description: 'Get detailed information about a specific map.',
            notFound: ':warning: Map not found. Check the name and try again.',
            options: {
                name: 'The name of the map to retrieve information about.'
            }
        }
    },
    hero: {
        about: {
            name: 'about',
            description: 'Get detailed info about a hero, including abilities and stats.',
            notFound: (heroName: string) => `:warning: Hero ${heroName} not found. Check the name and try again.`,
            options: {
                name: 'The hero name to retrieve information about.'
            }
        },
        leaderboard: {
            name: 'leaderboard',
            description: 'View the leaderboard for a specific hero.',
            notFound: ':warning: No leaderboard found for this hero.',
            options: {
                hero: 'The hero to get leaderboard info for.',
                platform: 'The platform to get leaderboard info for.'
            }
        }
    },
    match: {
        history: {
            name: 'history',
            description: 'View match history for a specific player.',
            noHistory: (playerName: string) => `:warning: No match history found for **${playerName}**.`
        }
    },
    account: {
        link: {
            name: 'link',
            description: 'Link your game account to your Discord account.',
            alreadyLinked: ':warning: You already have a linked account. Use `/account unlink` to unlink it first.',
            success: (playerName: string, uid: number) => `:white_check_mark: Successfully linked **${playerName}** (${uid}) to your Discord account.`
        },
        unlink: {
            name: 'unlink',
            description: 'Unlink your game account from your Discord account.',
            notLinked: ':warning: You don\'t have a linked account. Use `/account link` to link it first.',
            success: (uid: string) => `:white_check_mark: Successfully unlinked account with UID **${uid}** from your Discord account.`
        }
    }
};
