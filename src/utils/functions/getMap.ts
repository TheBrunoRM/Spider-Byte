import mapsJSON from '../../../assets/json/maps.json';

export function getMapByName(mapName: string) {
    const map = mapsJSON.maps.find((mapData) => mapData.name === mapName);
    return map ?? null;
}

export function getMapById(id: number) {
    const map = mapsJSON.maps.find((mapData) => mapData.id === id);
    return map ?? null;
}
