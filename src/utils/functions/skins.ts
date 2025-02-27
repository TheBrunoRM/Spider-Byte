import { capitalize } from './capitalize';

export function parseNameForRivalSkins(name: string) {
    switch (name) {
        case 'jeff the land shark':
            return 'Jeff the Land Shark';
    }
    return name.split('-').map((str) => capitalize(str)).join('-').split(' ')
        .map((str) => capitalize(str)).join(' ');
}
