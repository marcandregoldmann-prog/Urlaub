<template>
  <div class="container">
    <div class="header">
      <h1>Ausflüge 🗺️</h1>
      <p class="subtitle">Entdecke Djerba mit der Familie</p>
    </div>

    <!-- Toggle View -->
    <div class="view-toggle">
      <button
        class="toggle-btn"
        :class="{ active: viewMode === 'list' }"
        @click="viewMode = 'list'"
      >
        📄 Liste
      </button>
      <button
        class="toggle-btn"
        :class="{ active: viewMode === 'map' }"
        @click="viewMode = 'map'"
      >
        🗺️ Karte
      </button>
    </div>

    <!-- Map View -->
    <div v-if="viewMode === 'map'" class="map-wrapper">
      <MapComponent :locations="mapLocations" />
    </div>

    <!-- List View -->
    <div v-else class="attractions-list">
      <div
        v-for="attraction in attractions"
        :key="attraction.id"
        class="card attraction-card"
        :class="{ 'visited-card': isVisited(attraction.id) }"
        @click="selectAttraction(attraction)"
      >
        <div v-if="isVisited(attraction.id)" class="visited-badge">✅ Besucht</div>

        <div class="card-header">
          <div class="card-icon">{{ attraction.icon }}</div>
          <div class="card-title">{{ attraction.title }}</div>
        </div>

        <div class="attraction-meta">
          <div class="meta-item">📍 {{ attraction.distance }}</div>
          <div class="meta-item">⏱️ {{ attraction.open }}</div>
          <div class="meta-item">💰 {{ attraction.price }}</div>
          <div class="meta-item">
            <span class="kid-rating">{{ '👶'.repeat(attraction.kidRating) }}</span>
          </div>
        </div>

        <p class="description">{{ attraction.description }}</p>

        <div class="tip">
          <span class="tip-icon">💡</span>
          {{ attraction.tip }}
        </div>

        <button
          class="btn-visited"
          @click.stop="toggleVisited(attraction.id)"
        >
          {{ isVisited(attraction.id) ? '✅ Als besucht markiert' : '⬜ Als besucht markieren' }}
        </button>
      </div>
    </div>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="selectedAttraction" class="modal-overlay" @click.self="selectedAttraction = null">
        <div class="modal-content">
          <span class="modal-close" @click="selectedAttraction = null">&times;</span>
          <div class="modal-body" v-html="selectedAttraction.content"></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { attractions } from '../data/static';
import { useDataStore } from '../stores/dataStore';
import type { Attraction } from '../types';
import MapComponent from '../components/MapComponent.vue';

const dataStore = useDataStore();
const selectedAttraction = ref<Attraction | null>(null);
const viewMode = ref<'list' | 'map'>('list');

const mapLocations = computed(() => attractions.map(a => ({
  id: a.id,
  lat: a.lat || 0,
  lng: a.lng || 0,
  title: a.title
})).filter(l => l.lat !== 0));

const isVisited = (id: string) => dataStore.visitedAttractions.includes(id);

const toggleVisited = async (id: string) => {
  await dataStore.toggleVisited(id);
  if (isVisited(id)) {
    // Check for achievements
    if (id === 'explore') dataStore.unlockAchievement('krokodil');
    if (id === 'erriadh') dataStore.unlockAchievement('art');
    if (id === 'pirate') dataStore.unlockAchievement('pirat');
  }
};

const selectAttraction = (attraction: Attraction) => {
  selectedAttraction.value = attraction;
};
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--ocean) 0%, var(--ocean-dark) 100%);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-lg);
  color: white;
}

.header h1 {
  font-family: 'Caveat', cursive;
  font-size: 2.5em;
  font-weight: 700;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 0.9em;
  margin-top: 4px;
}

.view-toggle {
  display: flex;
  background: var(--bg);
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid var(--border);
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-light);
}

.toggle-btn.active {
  background: var(--card);
  color: var(--ocean);
  box-shadow: var(--shadow);
}

.map-wrapper {
  margin-bottom: 20px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.attraction-card {
  cursor: pointer;
  border-left: 4px solid var(--ocean);
  position: relative;
}

.attraction-card.visited-card {
  border-left-color: var(--success);
  background: rgba(16, 185, 129, 0.05);
}

.visited-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: var(--success);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 700;
}

.attraction-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 12px 0;
  font-size: 0.9em;
  color: var(--text-light);
}

.meta-item {
  background: var(--bg);
  padding: 4px 8px;
  border-radius: 6px;
}

.description {
  margin-bottom: 12px;
  line-height: 1.5;
}

.tip {
  background: linear-gradient(135deg, var(--sand-light), #FCD34D);
  border-left: 4px solid var(--sand);
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 0.9em;
  color: #78350F; /* Dark brown for readability on yellow */
}

.btn-visited {
  background: transparent;
  border: 2px solid var(--border);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-light);
  transition: all 0.3s ease;
  margin-top: 16px;
  width: 100%;
}

.btn-visited:hover {
  border-color: var(--success);
  color: var(--success);
}

.visited-card .btn-visited {
  border-color: var(--success);
  color: var(--success);
  background: rgba(16, 185, 129, 0.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: var(--card);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--shadow-lg);
  color: var(--text);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 2em;
  cursor: pointer;
  color: var(--text-light);
  line-height: 0.5;
}

/* Style inside modal content (v-html) */
.modal-body :deep(h2) {
  color: var(--ocean);
  font-size: 1.5em;
  margin-bottom: 12px;
}

.modal-body :deep(h3) {
  margin-top: 20px;
  margin-bottom: 8px;
  font-size: 1.2em;
}

.modal-body :deep(ul) {
  padding-left: 20px;
  margin-bottom: 16px;
}

.modal-body :deep(li) {
  margin-bottom: 4px;
}
</style>
