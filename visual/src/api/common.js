import http from './http';

const APIS = {
    DOWNLOAD_TILES: "/download_tiles",
}

export default class API {
    static downloadTiles = (params) => {
        return http.post(APIS.DOWNLOAD_TILES, params);
    };
}


