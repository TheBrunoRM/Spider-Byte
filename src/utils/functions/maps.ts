import MAPS_JSON from '../../../assets/json/maps.json';

export function getMapById(mapId: number) {
    const map = MAPS_JSON.maps.find((m) => m.id === mapId);
    if (!map) {
        return null;
    }
    return map;
}
