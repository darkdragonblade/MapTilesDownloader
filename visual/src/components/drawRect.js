export default class DrawRect {
    map = void 0;
    a = null;
    b = null;
    c = null;
    #enabled = false;
    #startLng;
    #startLat;
    id = 'select-area';
    set enabled(val) {
        this.#enabled = val;
    }
    get enabled() {
        return this.#enabled;
    }
    enable = (map) => {
        this.enabled = true;
        this.map = map;
        this.paint();
    };
    paint = () => {
        this.map.on(
            "mousedown",
            (this.a = (event) => {
                if (event.originalEvent.altKey) {
                    this.map.dragPan.disable();
                    this.map.scrollZoom.disable();
                    this.mousedown(event);
                    this.map.on("mousemove", (this.b = (event) => {
                        this.mousemove(event);
                    }));
                    this.map.on(
                        "mouseup",
                        (this.c = () => {
                            this.map.dragPan.enable();
                            this.map.scrollZoom.enable();
                            this.map.off("mousemove", this.b);
                            this.map.off("mouseup", this.c);


                        })
                    );

                }
            })
        );
    };
    mousedown = (event) => {

        if (this.map.getSource(this.id)) {
            this.map.removeLayer(this.id);
            this.map.removeSource(this.id);
        }


        const { lng, lat } = event.lngLat;
        this.#startLng = lng;
        this.#startLat = lat;

        this.map.addSource(this.id, {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [],
                },
            },
        });

        this.map.addLayer({
            id: this.id,
            type: "fill",
            source: this.id,
            paint: {
                "fill-color": "#0080ff",
                "fill-opacity": 0.5,
            },
        });
    }
    mousemove = (event) => {

        const { lng, lat } = event.lngLat;
        const source = this.map.getSource(this.id);

        const minX = Math.min(this.#startLng, lng);
        const minY = Math.min(this.#startLat, lat);
        const maxX = Math.max(this.#startLng, lng);
        const maxY = Math.max(this.#startLat, lat);

        const coordinates = [
            [minX, minY],
            [maxX, minY],
            [maxX, maxY],
            [minX, maxY],
        ];

        source.setData({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [
                    coordinates
                ]
            }
        });


        const zoom = this.map.getZoom();

        console.log(minX, minY, Math.ceil(zoom));

        console.log(this.getTileCoordinate(minX, minY, zoom));
    }

    getTileCoordinate = (lng, lat, zoom) => {
        const totalTiles = Math.pow(2, zoom);

        // 将经度值转换为瓦片X坐标
        let x = Math.floor(((lng + 180) / 360) * totalTiles);

        // 将纬度值转换为瓦片Y坐标
        let y = Math.floor(
            ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
            totalTiles
        );

        return { x, y, z: zoom };
    }
    disable = () => {
        this.enabled = false;
        this.map.off("mousedown", this.a);
    };
}
