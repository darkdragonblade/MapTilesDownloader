<template>
  <div id="app">
    <aside class="left">
      <main id="map"></main>
      <!-- <div class="map-tooltip">
        Use ALT + drag to select requested area on the map
      </div> -->
    </aside>
    <aside class="right">
      <section class="flex">
        <div class="step">1</div>
        <div class="label">Select a Region</div>
        <a-select
          v-model:value="mapType"
          style="width: 100%"
          placeholder="Select please..."
          @change="mapTypeChange"
        >
          <a-select-option
            v-for="(item, index) in tilesOrigin"
            :key="item"
            :value="index + 1"
            >{{ item.name }}</a-select-option
          >
        </a-select>
      </section>
      <section class="flex">
        <div class="step">2</div>
        <div class="label">Configure</div>
        <div class="flex flex-align-center flex-justify-between">
          <span style="font-size: 12px; color: #989898"
            >Show Tile Boundaries</span
          >
          <div>
            <a-switch
              v-model:checked="showTileBoundaries"
              @change="toggleTileBoundaries"
            />
          </div>
        </div>
        <div
          class="flex flex-align-center flex-justify-between"
          style="gap: 8px"
        >
          <span style="font-size: 12px; color: #989898">Zoom Level</span>
          <div class="flex flex-align-center flex-1" style="gap: 8px">
            <span>from</span>
            <a-input-number
              :min="tilesOrigin[mapType - 1].minZoom"
              :max="tilesOrigin[mapType - 1].maxZoom"
              v-model:value="minZoom"
            />
            <span>to</span>
            <a-input-number
              :min="tilesOrigin[mapType - 1].minZoom"
              :max="tilesOrigin[mapType - 1].maxZoom"
              v-model:value="maxZoom"
            />
          </div>
        </div>
        <div class="flex flex-align-center flex-justify-between">
          <span style="font-size: 12px; color: #989898">customize Tiles</span>
          <a-switch v-model:checked="customize" />
        </div>
        <div
          v-show="customize"
          class="flex flex-align-center flex-justify-between"
          style="gap: 8px"
        >
          <span style="font-size: 12px; color: #989898">Row Range</span>
          <div class="flex flex-align-center flex-1" style="gap: 8px">
            <span>from</span>
            <a-input-number :min="0" v-model:value="minRow" />
            <span>to</span>
            <a-input-number :min="0" v-model:value="maxRow" />
          </div>
        </div>
        <div
          v-show="customize"
          class="flex flex-align-center flex-justify-between"
          style="gap: 8px"
        >
          <span style="font-size: 12px; color: #989898">Column Range</span>
          <div class="flex flex-align-center flex-1" style="gap: 8px">
            <span>from</span>
            <a-input-number :min="0" v-model:value="minColumn" />
            <span>to</span>
            <a-input-number :min="0" v-model:value="maxColumn" />
          </div>
        </div>
      </section>

      <section class="flex">
        <div class="step">3</div>
        <div class="label">More Options(+)</div>
        <a-button type="primary" :loading="loading" @click="download"
          >DOWNLOAD({{ customize ? "Customize" : "All" }})</a-button
        >
      </section>
    </aside>
  </div>
</template>

<script>
import API from "./api/common";
import Rect from "./components/drawRect";
let map = void 0;
const rect = new Rect();
export default {
  data() {
    return {
      tilesOrigin: [
        {
          url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          name: "openstreetmap",
          minZoom: 0,
          maxZoom: 20,
        },
        {
          url: "https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
          name: "basemaps",
          minZoom: 0,
          maxZoom: 20,
        },
        {
          url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
          name: "stadiamaps",
          minZoom: 0,
          maxZoom: 20,
        },
        {
          url: "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png",
          name: "arcgis",
          minZoom: 0,
          maxZoom: 20,
        },
        {
          url: "http://mt1.google.com/vt/lyrs=m&scale=2&hl=zh-en&gl=cn&x={x}&y={y}&z={z}",
          name: "google",
          minZoom: 0,
          maxZoom: 20,
        },
        {
          url: "http://wprd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
          name: "autonavi(高德)",
          minZoom: 2,
          maxZoom: 19,
        },
      ],
      mapType: 1,
      minZoom: 0,
      maxZoom: 15,
      minRow: 0,
      maxRow: 0,
      minColumn: 0,
      maxColumn: 0,
      customize: false,
      loading: false,
      showTileBoundaries: false,
    };
  },
  methods: {
    initMap() {
      const { minZoom, maxZoom, url } = this.tilesOrigin[this.mapType - 1];
      this.minZoom = minZoom;
      this.maxZoom = maxZoom;
      map = new mapboxgl.Map({
        container: "map",
        center: [0, 0],
        zoom: minZoom,
        minZoom,
        maxZoom: maxZoom - 1,
        pitch: 0,
        antialias: true,
        style: {
          version: 8,
          name: "Mapbox Streets",
          sprite: window.location.origin + "/sprite",
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [url],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "mapbox-id",
              type: "raster",
              source: "osm-tiles",
              "source-layer": "osmtiles",
            },
          ],
        },
      });
      map.addControl(new mapboxgl.NavigationControl());
      this.toggleTileBoundaries();
      rect.enable(map);
    },
    mapTypeChange() {
      map.remove();
      this.initMap();
    },
    toggleTileBoundaries() {
      map.showTileBoundaries = this.showTileBoundaries;
    },
    async download() {
      try {
        this.loading = true;
        await API.downloadTiles({
          url: this.tilesOrigin[this.mapType - 1].url,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          minRow: this.minRow,
          maxRow: this.maxRow,
          minColumn: this.minColumn,
          maxColumn: this.maxColumn,
          custom: this.customize,
        });
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
};
</script>
<style scoped>
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.left {
  position: relative;
  flex: 1;
}

#map {
  width: 100%;
  height: 100%;
}

.right {
  width: 340px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

:deep(.ant-radio-wrapper) {
  display: flex;
}

section {
  position: relative;
  padding: 20px;
  flex-direction: column;
  gap: 14px;
}

.label {
  font-size: 14px;
  font-weight: 600;
}

.step {
  position: absolute;
  left: -12px;
  top: 0;
  border-radius: 50px;
  width: 24px;
  height: 24px;
  background: #1677ff;
  color: #fff;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 0 6px #9a9a9a;
}

.map-tooltip {
  background: hsla(0, 0%, 100%, 0.8);
  left: 50%;
  margin-left: -210px;
  padding: 10px;
  position: absolute;
  text-align: center;
  top: 10px;
  width: 420px;
  z-index: 10;
  color: #6b7c92;
  font-size: 16px;
  user-select: none;
}
</style>
