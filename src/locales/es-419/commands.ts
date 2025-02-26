import type { commands as English } from '../en-US/commands.ts';

const commands = {
    commonErrors: {
        playerNotFound: ':warning: Jugador no encontrado. Proporciona un nombre o ID válido e intenta de nuevo.',
        noNameOrId: ':warning: No se proporcionó nombre o ID. Este dato es necesario para continuar.',
        underDevelopment: ':warning: Este comando está en desarrollo. Pronto estará disponible. Disculpa las molestias.',
        privateProfile: ':warning: Este perfil está configurado como privado en el juego. Para cambiarlo, sigue las instrucciones que se muestran e intenta de nuevo.'
    },
    commonOptions: {
        nameOrId: 'Ingresa el nombre o ID del jugador para identificarlo.'
    },
    middlewares: {
        cooldown: {
            error: {
                user: (remaining) => `⏰ Estás en cooldown. Espera ${remaining} para usar este comando de nuevo.`,
                channel: (remaining) => `⏰ El canal está en cooldown. Espera ${remaining} para usar este comando de nuevo.`
            }
        }
    },
    help: {
        name: 'help',
        description: 'Muestra información sobre los comandos disponibles.',
        options: {
            command: 'Comando específico del cual obtener ayuda.'
        },
        noCommandFound: ':warning: Comando no encontrado. Verifica el nombre del comando e intenta de nuevo.',
        embed: {
            title: '📚 Comandos Disponibles',
            description: 'Aquí están todos los comandos disponibles.\nUsa `/help command:nombredelcomando` para información detallada.',
            color: 0x2B2D31,
            timestamp: new Date().toISOString()
        },
        commandDetailsEmbed: (commandName) => ({
            title: `Comando \`/${commandName}\``,
            description: 'Información detallada sobre el comando.',
            color: 0x2B2D31,
            timestamp: new Date().toISOString()
        }),
        fields: {
            allCommands: '📑 Comandos',
            subcommands: '📑 SubComandos',
            options: '⚙️ Opciones',
            cooldown: '⏱️ Tiempo de Espera'
        }
    },
    ping: {
        name: 'ping',
        content: (latency) => `Ping: ${latency}ms. Latencia actual con el servidor.`
    },
    core: {
        compare: {
            name: 'compare',
            description: 'Compara estadísticas de dos jugadores, incluyendo asesinatos, victorias y veces como MVP.',
            samePlayer: ':warning: Se proporcionó el mismo jugador dos veces. Usa dos nombres o IDs diferentes.',
            options: {
                first: 'Nombre o ID del primer jugador a comparar.',
                second: 'Nombre o ID del segundo jugador a comparar.'
            }
        },
        profile: {
            name: 'profile',
            description: 'Obtén estadísticas detalladas como roles, rango y héroes principales de un jugador.'
        },
        rank: {
            name: 'rank',
            description: 'Muestra una gráfica de la historia de rangos de un jugador.',
            noRankHistory: (playerName, clubTeamId) => `:warning: **${playerName}${clubTeamId
                ? `#${clubTeamId}** `
                : '** '} no tiene historial de rangos.`
        },
        update: {
            name: 'update',
            description: 'Actualiza las estadísticas de un jugador.',
            alrreadyQueued: (playerName, clubTeamId, uid) => `:warning: **${playerName}${clubTeamId === ''
                ? '** '
                : `#${clubTeamId}** `}(${uid}) ya está actualizado (en los últimos 30 minutos).`,
            success: (playerName, clubTeamId, uid) => `:white_check_mark: **${playerName}${clubTeamId === ''
                ? '** '
                : `#${clubTeamId}** `}(${uid}) estadísticas actualizadas. Espera 30 minutos antes de usar este comando nuevamente.`
        }
    },
    game: {
        patchNotes: {
            name: 'patch-notes',
            description: 'Obtén las últimas notas de parche o para un ID específico.',
            notFound: (id) => `Notas de parche con ID ${id} no encontradas. Revisa el ID e intenta de nuevo.`,
            noPatchNotes: ':warning: No hay notas de parche disponibles en este momento.',
            options: {
                id: 'El ID de las notas de parche para obtener actualizaciones específicas.'
            }
        },
        map: {
            name: 'map',
            description: 'Obtén información detallada de un mapa específico.',
            notFound: 'Mapa no encontrado. Revisa el nombre e intenta de nuevo.',
            options: {
                name: 'El nombre del mapa para obtener información.'
            }
        }
    },
    hero: {
        about: {
            name: 'about',
            description: 'Obtén información detallada de un héroe, incluyendo habilidades y estadísticas.',
            notFound: (heroName) => `:warning: Héroe ${heroName} no encontrado. Revisa el nombre e intenta de nuevo.`,
            options: {
                name: 'El nombre del héroe para obtener información.'
            }
        },
        leaderboard: {
            name: 'leaderboard',
            description: 'Muestra la tabla de clasificación de un héroe específico.',
            notFound: ':warning: No se encontró tabla de clasificación para este héroe.',
            options: {
                hero: 'El héroe para obtener información de clasificación.'
            }
        }
    }
} satisfies typeof English;

export { commands };
