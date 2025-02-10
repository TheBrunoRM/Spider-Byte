/* eslint-disable radix */
/**
 * @param formatedTime string - Time in format '1h 30m 20s'
 * @returns number - Time in seconds
 */
export function convertirASegundos(time: string): number {
    const regex = /(\d+)h\s*(\d+)m\s*(\d+)s/;
    const match = regex.exec(time);

    if (!match) {
        throw new Error('Invalid time format');
    }

    const h = match[1]
        ? parseInt(match[1], 10)
        : 0;
    const m = match[2]
        ? parseInt(match[2], 10)
        : 0;
    const s = match[3]
        ? parseInt(match[3], 10)
        : 0;

    return h * 3_600 + m * 60 + s;
}
