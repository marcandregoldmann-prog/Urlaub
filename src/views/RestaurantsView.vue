<template>
  <div class="container">
    <div class="header">
      <h1>Essen & Trinken 🍽️</h1>
      <p class="subtitle">Die besten Adressen auf Djerba</p>
    </div>

    <!-- Filter -->
    <div class="filter-row">
      <button
        v-for="filter in filters"
        :key="filter.id"
        class="filter-chip"
        :class="{ active: activeFilter === filter.id }"
        @click="activeFilter = filter.id"
      >
        {{ filter.name }}
      </button>
    </div>

    <!-- List -->
    <div class="restaurant-list">
      <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="card restaurant-card">
        <div class="rest-header">
          <div class="rest-title">{{ restaurant.name }}</div>
          <div class="rest-rating">
            <span class="stars">{{ '⭐'.repeat(Math.round(restaurant.rating)) }}</span>
            <span class="score">{{ restaurant.rating }}</span>
          </div>
        </div>

        <div class="rest-meta">
          <span class="meta-tag price">{{ '💰'.repeat(restaurant.priceLevel) }}</span>
          <span class="meta-tag">{{ restaurant.cuisine }}</span>
          <span v-if="restaurant.kidFriendly" class="meta-tag kid">👶 Kinderfreundlich</span>
        </div>

        <p class="rest-desc">{{ restaurant.description }}</p>

        <div class="rest-dish">
          <strong>Empfehlung:</strong> {{ restaurant.mustTry }}
        </div>

        <div class="rest-actions">
          <button class="btn-action" @click="showOnMap(restaurant)">🗺️ Karte</button>
          <button class="btn-action" @click="addReview(restaurant)">✍️ Bewerten</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeFilter = ref('all');

const filters = [
  { id: 'all', name: 'Alle' },
  { id: 'local', name: 'Tunesisch' },
  { id: 'fish', name: 'Fisch' },
  { id: 'italian', name: 'Pizza/Pasta' }
];

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  priceLevel: number; // 1-3
  cuisine: string;
  kidFriendly: boolean;
  description: string;
  mustTry: string;
  lat: number;
  lng: number;
  type: string; // for filter
}

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Restaurant Haroun',
    rating: 4.5,
    priceLevel: 3,
    cuisine: 'Fisch & Meeresfrüchte',
    kidFriendly: true,
    description: 'Historisches Schiff im Hafen. Tolles Ambiente, aber etwas teurer.',
    mustTry: 'Grillplatte Royale',
    lat: 33.869,
    lng: 10.857,
    type: 'fish'
  },
  {
    id: '2',
    name: 'Fatroucha',
    rating: 4.8,
    priceLevel: 2,
    cuisine: 'Tunesisch',
    kidFriendly: true,
    description: 'Authentische Küche in Midoun. Sehr beliebt bei Einheimischen.',
    mustTry: 'Couscous mit Lamm',
    lat: 33.808,
    lng: 10.992,
    type: 'local'
  },
  {
    id: '3',
    name: 'Chouchou',
    rating: 4.2,
    priceLevel: 1,
    cuisine: 'Fast Food / Tunesisch',
    kidFriendly: true,
    description: 'Günstig und gut. Perfekt für einen schnellen Brik.',
    mustTry: 'Brik mit Ei',
    lat: 33.876,
    lng: 10.858,
    type: 'local'
  },
  {
    id: '4',
    name: 'El Ferida',
    rating: 4.6,
    priceLevel: 2,
    cuisine: 'Mix / Italienisch',
    kidFriendly: true,
    description: 'Schöner Garten, ideal für Familienabende.',
    mustTry: 'Pizza Djerbienne',
    lat: 33.820,
    lng: 11.040,
    type: 'italian'
  }
];

const filteredRestaurants = computed(() => {
  if (activeFilter.value === 'all') return restaurants;
  return restaurants.filter(r => r.type === activeFilter.value);
});

const showOnMap = (r: Restaurant) => {
  // Pass coords to map view? For now, navigate
  router.push({ name: 'attractions', query: { lat: r.lat, lng: r.lng } });
};

const addReview = (_r: Restaurant) => {
  alert('Bewertungs-Feature kommt bald! 🏗️');
};
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--ocean) 0%, var(--ocean-dark) 100%);
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  box-shadow: var(--shadow-lg);
}

.header h1 {
  font-family: 'Caveat', cursive;
  font-size: 2.5em;
  font-weight: 700;
}

.filter-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 12px;
  scrollbar-width: none;
}

.filter-chip {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 20px;
  white-space: nowrap;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  color: var(--text-light);
}

.filter-chip.active {
  background: var(--ocean);
  color: white;
  border-color: var(--ocean);
  box-shadow: var(--shadow);
}

.restaurant-card {
  margin-bottom: 16px;
}

.rest-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.rest-title {
  font-weight: 700;
  font-size: 1.2em;
  color: var(--text);
}

.rest-rating {
  text-align: right;
}

.stars { font-size: 0.8em; margin-right: 4px; }
.score { font-weight: 700; color: var(--ocean); }

.rest-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.meta-tag {
  background: var(--bg);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8em;
  color: var(--text-light);
}

.meta-tag.kid {
  background: #DCFCE7; /* Light green */
  color: #166534;
}

.meta-tag.price {
  background: #FEF3C7;
  color: #92400E;
}

.rest-desc {
  font-size: 0.9em;
  color: var(--text-light);
  margin-bottom: 12px;
}

.rest-dish {
  background: var(--bg);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9em;
  margin-bottom: 16px;
  border-left: 3px solid var(--ocean);
}

.rest-actions {
  display: flex;
  gap: 8px;
}

.btn-action {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 8px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background: var(--ocean);
  color: white;
  border-color: var(--ocean);
}
</style>
