<template>
  <div class="container">
    <div class="header">
      <h1>Taxi-Rechner 🚕</h1>
      <p class="subtitle">Fairer Preis & Verständigung</p>
    </div>

    <!-- Calculator -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🧮</div>
        <div class="card-title">Preisschätzung</div>
      </div>

      <div class="input-group">
        <label class="label">Von:</label>
        <select v-model="route.from" class="select-input">
          <option value="0">Royal Karthago Hotel</option>
          <!-- Future: Add other locations -->
        </select>
      </div>

      <div class="input-group">
        <label class="label">Nach:</label>
        <select v-model="route.to" class="select-input">
          <option :value="null">Ziel wählen...</option>
          <option v-for="dest in destinations" :key="dest.id" :value="dest">
            {{ dest.title }} ({{ dest.km }} km)
          </option>
        </select>
      </div>

      <div class="input-group">
        <label class="label">Tageszeit:</label>
        <div class="toggle-group">
          <button
            class="toggle-btn"
            :class="{ active: route.isNight === false }"
            @click="route.isNight = false"
          >
            ☀️ Tag (5-21)
          </button>
          <button
            class="toggle-btn"
            :class="{ active: route.isNight === true }"
            @click="route.isNight = true"
          >
            🌙 Nacht (21-5)
          </button>
        </div>
      </div>

      <div v-if="price.tnd > 0" class="price-display">
        <div class="price-label">Geschätzter Preis:</div>
        <div class="price-amount">{{ price.tnd.toFixed(1) }} TND</div>
        <div class="price-euro">≈ {{ price.eur.toFixed(2) }}€</div>
        <p class="price-note">
          Taxameter einschalten lassen!<br>
          Grundgebühr: 0.900 TND
        </p>
      </div>
    </div>

    <!-- Location Card for Driver -->
    <div v-if="route.to && route.to.address" class="card driver-card">
      <div class="card-header">
        <div class="card-icon">👨‍✈️</div>
        <div class="card-title">Für den Fahrer</div>
      </div>
      <div class="driver-text">
        <p class="lang-fr">{{ route.to.address.fr }}</p>
        <p class="lang-tn">{{ route.to.address.tn }}</p>
      </div>
      <p class="driver-hint">Zeige diesen Bildschirm dem Fahrer.</p>
    </div>

    <!-- Phrases -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">💬</div>
        <div class="card-title">Taxi-Phrasen</div>
      </div>

      <div v-for="(phrase, index) in taxiPhrases" :key="index" class="phrase-item">
        <div class="phrase-de">🇩🇪 {{ phrase.de }}</div>
        <div class="phrase-fr">🇫🇷 {{ phrase.fr }}</div>
        <div class="phrase-phonetic">🗣️ {{ phrase.phonetic }}</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { attractions, phrases } from '../data/static';

// Destinations mapped from attractions + extra
const destinations = [
  ...attractions.map(a => ({
    id: a.id,
    title: a.title,
    km: parseFloat(a.distance) || (a.distance.includes('Nah') ? 2 : 10),
    address: a.taxiAddress
  })),
  { id: 'midoun', title: 'Midoun Stadt', km: 6, address: { fr: 'Midoun Centre', tn: 'ميدون' } },
  { id: 'guellala', title: 'Guellala (Töpferdorf)', km: 20, address: { fr: 'Guellala', tn: 'قلال' } },
  { id: 'airport', title: 'Flughafen Djerba', km: 30, address: { fr: 'Aéroport Djerba-Zarzis', tn: 'مطار جربة جرجيس الدولي' } }
];

const route = ref({
  from: '0',
  to: null as any,
  isNight: false
});

const price = computed(() => {
  if (!route.value.to) return { tnd: 0, eur: 0 };

  const dist = route.value.to.km;
  let tnd = 0.9 + (dist * 1.0); // 0.9 base + 1.0/km
  if (route.value.isNight) tnd *= 1.5; // +50% night surcharge

  return {
    tnd,
    eur: tnd / 3.37
  };
});

const taxiPhrases = phrases.filter(p => p.category === 'taxi' || p.category === 'shopping');
// Include shopping phrases like "How much" for Taxi too
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

.price-display {
  background: linear-gradient(135deg, var(--ocean), var(--ocean-dark));
  color: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  margin: 20px 0 0;
  animation: fadeIn 0.3s ease;
}

.price-amount {
  font-size: 2.5em;
  font-weight: 800;
  font-family: 'Caveat', cursive;
  line-height: 1;
  margin: 8px 0;
}

.toggle-group {
  display: flex;
  background: var(--bg);
  padding: 4px;
  border-radius: 12px;
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

.driver-card {
  border-left: 4px solid var(--sand);
}

.driver-text {
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 8px;
}

.lang-fr {
  font-size: 1.2em;
  font-weight: 700;
  color: var(--text);
}

.lang-tn {
  font-size: 1.5em;
  font-family: serif;
  color: var(--ocean-dark);
  margin-top: 4px;
}

.driver-hint {
  font-size: 0.85em;
  color: var(--text-light);
  text-align: center;
}

.phrase-item {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}
.phrase-item:last-child { border-bottom: none; }

.phrase-de { font-weight: 600; margin-bottom: 4px; }
.phrase-fr { color: var(--ocean); font-weight: 700; font-size: 1.1em; }
.phrase-phonetic { font-style: italic; color: var(--text-light); font-size: 0.9em; margin-top: 2px; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
