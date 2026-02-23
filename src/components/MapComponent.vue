<template>
  <div class="map-container">
    <div id="map" ref="mapContainer" aria-label="Interaktive Karte von Djerba"></div>
    <div class="map-controls">
      <button class="btn-locate" @click="locateMe" aria-label="Mein Standort">📍</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted } from 'vue';
import L from 'leaflet';

// Fix Leaflet Icon
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const props = defineProps<{
  locations: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    type?: string;
  }>;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markers: L.Marker[] = [];

onMounted(() => {
  if (!mapContainer.value) return;

  // Djerba coordinates
  map = L.map(mapContainer.value).setView([33.8075, 10.8451], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
    className: 'map-tiles'
  }).addTo(map);

  updateMarkers();
});

watch(() => props.locations, () => {
  updateMarkers();
}, { deep: true });

const updateMarkers = () => {
  if (!map) return;

  // Clear existing markers
  markers.forEach(m => m.remove());
  markers = [];

  props.locations.forEach(loc => {
    if (!loc.lat || !loc.lng) return;

    const marker = L.marker([loc.lat, loc.lng])
      .bindPopup(`<b>${loc.title}</b>`)
      .addTo(map!);

    markers.push(marker);
  });
};

const locateMe = () => {
  if (!map) return;
  map.locate({ setView: true, maxZoom: 16 });
};

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  z-index: 0; /* Behind other overlays if any */
}

#map {
  height: 100%;
  width: 100%;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.btn-locate {
  background: white;
  border: none;
  padding: 12px;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  font-size: 1.5em;
  cursor: pointer;
}
</style>
