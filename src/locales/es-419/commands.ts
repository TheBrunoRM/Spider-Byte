import type { commands as English } from '../en-US/commands.ts';

const commands = {
    commonErrors: {
        playerNotFound: ':warning: Jugador no encontrado. Proporciona un nombre o ID válido e intenta de nuevo.',
        noNameOrId: ':warning: No se proporcionó nombre o ID. Este dato es necesario para continuar.'
    },
    commonOptions: {
        nameOrId: 'Ingresa el nombre o ID del jugador para identificarlo.'
    },
    middlewares: {
        cooldown: {
            error: {
                user: (remaining: string) => `⏰ Estás en cooldown. Espera ${remaining} para usar este comando de nuevo.`,
                channel: (remaining: string) => `⏰ El canal está en cooldown. Espera ${remaining} para usar este comando de nuevo.`
            }
        }
    },
    ping: {
        content: (latency: number) => `Ping: ${latency}ms. Latencia actual con el servidor.`
    },
    core: {
        compare: {
            description: 'Compara estadísticas de dos jugadores, incluyendo rangos, roles y héroes principales.',
            samePlayer: ':warning: Se proporcionó el mismo jugador dos veces. Usa dos nombres o IDs diferentes.',
            options: {
                first: 'Nombre o ID del primer jugador a comparar.',
                second: 'Nombre o ID del segundo jugador a comparar.'
            }
        },
        profile: {
            description: 'Obtén estadísticas detalladas como roles, rango y héroes principales de un jugador.'
        },
        rank: {
            description: 'Muestra una gráfica de la historia de rangos de un jugador.',
            noRankHistory: (playerName: string, clubTeamId: string, uid: string) => `:warning: **${playerName}${clubTeamId === ''
                ? '** '
                : `#${clubTeamId}** `}(${uid}) no tiene historial de rangos.`
        }
    },
    game: {
        patchNotes: {
            description: 'Obtén las últimas notas de parche o para un ID específico.',
            notFound: (id: string) => `Notas de parche con ID ${id} no encontradas. Revisa el ID e intenta de nuevo.`,
            noPatchNotes: ':warning: No hay notas de parche disponibles en este momento.',
            options: ':warning: El ID de las notas de parche para obtener actualizaciones específicas.'
        }
    },
    hero: {
        about: {
            description: 'Obtén información detallada de un héroe, incluyendo habilidades y estadísticas.',
            notFound: (heroName: string) => `:warning: Héroe ${heroName} no encontrado. Revisa el nombre e intenta de nuevo.`,
            options: {
                hero: 'El nombre del héroe para obtener información.'
            }
        },
        leaderboard: {
            description: 'Muestra la tabla de clasificación de un héroe específico.',
            notFound: ':warning: No se encontró tabla de clasificación para este héroe.',
            options: {
                hero: 'El héroe para obtener información de clasificación.'
            }
        }
    }
} satisfies typeof English;

export { commands };
