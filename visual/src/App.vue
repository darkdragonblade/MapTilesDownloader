<template>
  <div id="app">
    <main id="map"></main>
    <aside>
      <section class="flex">
        <div class="step">1</div>
        <div class="label">Select a Region</div>
        <a-select
          v-model:value="mapType"
          style="width: 100%"
          placeholder="Select please..."
          @change="maoTypeChange"
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
        <span style="font-size: 12px; color: #989898">Zoom setting</span>
        <a-row>
          <a-col :span="12">
            <a-slider v-model:value="minZoom" :min="min" :max="max" />
          </a-col>
          <a-col :span="4">
            <a-input-number
              v-model:value="minZoom"
              :min="min"
              :max="max"
              style="margin-left: 16px"
            />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-slider v-model:value="maxZoom" :min="min" :max="max" />
          </a-col>
          <a-col :span="4">
            <a-input-number
              v-model:value="maxZoom"
              :min="min"
              :max="max"
              style="margin-left: 16px"
            />
          </a-col>
        </a-row>
      </section>

      <section class="flex">
        <div class="step">3</div>
        <div class="label">More Options(+)</div>
        <a-button type="primary" :loading="loading" @click="download"
          >DOWNLOAD</a-button
        >
      </section>
    </aside>
  </div>
</template>

<script>
import API from "./api/common";

let map = void 0;

export default {
  data() {
    return {
      tilesOrigin: [
        {
          url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png",
          // url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          // url: "https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=QPAErv2lUwkeKOVzcY3w",
          name: "openstreetmap",
        },
        {
          url: "https://a.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png",
          name: "basemaps",
        },
        {
          url: "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png",
          name: "stadiamaps",
        },
        {
          url: "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}.png",
          name: "arcgis",
        },
        // {
        //   url: "http://mt1.google.com/vt/lyrs=m&scale=2&hl=zh-en&gl=cn&x={x}&y={y}&z={z}",
        //   name: "google",
        // },
      ],
      mapType: 1,
      zoom: [0, 15],
      minZoom: 0,
      maxZoom: 10,
      min: 0,
      max: 20,
      loading: false,
      showTileBoundaries: false,
    };
  },
  methods: {
    initMap() {
      map = new mapboxgl.Map({
        container: "map",
        center: [0, 0],
        zoom: 0,
        maxZoom: 14,
        pitch: 0,
        antialias: true,
        style: {
          version: 8,
          name: "Mapbox Streets",
          sprite: window.location.origin + "/sprite",
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [this.tilesOrigin[this.mapType - 1].url],
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
        // style: "http://localhost:1234/api/styles/style"
      });
      map.addControl(new mapboxgl.NavigationControl());
      this.toggleTileBoundaries();
    },
    maoTypeChange() {
      map.remove();
      this.initMap();
    },
    toggleTileBoundaries() {
      map.showTileBoundaries = this.showTileBoundaries;
    },
    async download() {
      try {
        this.loading = true;
        const res = await API.downloadTiles({
          type: this.mapType,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
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

main {
  flex: 1;
}

aside {
  width: 300px;
  padding: 10px 0;
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
</style>
