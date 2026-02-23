<template>
  <div class="container">
    <div class="header">
      <h1>Packen 🎒</h1>
      <p class="subtitle">Nichts vergessen!</p>
    </div>

    <!-- Essential Banner -->
    <div class="essential-banner" @click="rotateEssential">
      <div class="essential-icon">{{ currentEssential?.icon }}</div>
      <div class="essential-text">
        <div class="essential-label">Nicht vergessen!</div>
        <div class="essential-msg">{{ currentEssential?.text }}</div>
      </div>
    </div>

    <!-- Progress -->
    <div class="card progress-card">
      <div class="progress-info">
        <span>Gesamtfortschritt</span>
        <span class="progress-pct">{{ Math.round(totalProgress) }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: totalProgress + '%' }"></div>
      </div>
      <div class="progress-stats">{{ totalChecked }} / {{ totalItems }} Artikel eingepackt</div>
    </div>

    <!-- Person Tabs -->
    <div class="tabs-scroll">
      <button
        v-for="(name, key) in settings.names"
        :key="key"
        class="tab-chip"
        :class="{ active: activeTab === key }"
        @click="activeTab = key"
      >
        {{ name }}
      </button>
    </div>

    <!-- List -->
    <div class="card list-card">
      <div class="card-header">
        <div class="card-icon">📋</div>
        <div class="card-title">{{ settings.names[activeTab as keyof typeof settings.names] }}</div>
        <div class="header-actions">
          <button class="btn-sm" @click="shareList">📤 Teilen</button>
        </div>
      </div>

      <div v-if="currentList.length === 0" class="empty-state">
        Noch nichts auf der Liste.
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="item in currentList"
          :key="item.id"
          class="packing-item"
          :class="{ checked: item.checked }"
          @click="dataStore.togglePackingItem(activeTab, item.id)"
        >
          <div class="checkbox">
            <span v-if="item.checked">✓</span>
          </div>
          <div class="item-content">
            <div class="item-name">{{ item.name }}</div>
            <div v-if="item.qty > 1" class="item-qty">×{{ item.qty }}</div>
          </div>
          <button class="btn-del" @click.stop="dataStore.deletePackingItem(activeTab, item.id)">🗑️</button>
        </div>
      </transition-group>

      <!-- Add Item -->
      <form @submit.prevent="addItem" class="add-form">
        <input v-model="newItemName" type="text" placeholder="Neuer Gegenstand..." class="input-name" required />
        <input v-model.number="newItemQty" type="number" min="1" max="99" class="input-qty" />
        <button type="submit" class="btn-add">+</button>
      </form>

      <!-- Templates -->
      <div class="templates-section">
        <div class="templates-label">Templates hinzufügen:</div>
        <div class="templates-buttons">
          <button class="btn-template" @click="addTemplate('beach')">🏖️ Strand</button>
          <button class="btn-template" @click="addTemplate('flight')">✈️ Flug</button>
          <button class="btn-template" @click="addTemplate('meds')">💊 Apotheke</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useSettingsStore } from '../stores/settingsStore';
import { essentialItems } from '../data/static';

const dataStore = useDataStore();
const settings = useSettingsStore();

const activeTab = ref('marc'); // Default key
const newItemName = ref('');
const newItemQty = ref(1);
const essentialIndex = ref(0);

const currentEssential = computed(() => essentialItems[essentialIndex.value]);

const rotateEssential = () => {
  essentialIndex.value = (essentialIndex.value + 1) % essentialItems.length;
};

onMounted(() => {
  essentialIndex.value = Math.floor(Math.random() * essentialItems.length);
});

const currentList = computed(() => dataStore.packing[activeTab.value] || []);

const totalItems = computed(() => {
  let count = 0;
  Object.values(dataStore.packing).forEach(list => count += list.length);
  return count;
});

const totalChecked = computed(() => {
  let count = 0;
  Object.values(dataStore.packing).forEach(list => count += list.filter(i => i.checked).length);
  return count;
});

const totalProgress = computed(() => {
  if (totalItems.value === 0) return 0;
  return (totalChecked.value / totalItems.value) * 100;
});

const addItem = async () => {
  if (!newItemName.value.trim()) return;
  await dataStore.addPackingItem(activeTab.value, {
    id: Date.now(),
    name: newItemName.value,
    qty: newItemQty.value,
    checked: false
  });
  newItemName.value = '';
  newItemQty.value = 1;
};

const templates = {
  beach: [
    { name: 'Sonnencreme', qty: 1 },
    { name: 'Handtuch', qty: 1 },
    { name: 'Sonnenbrille', qty: 1 },
    { name: 'Buch / Kindle', qty: 1 },
    { name: 'Wasser', qty: 1 }
  ],
  flight: [
    { name: 'Reisepass', qty: 1 },
    { name: 'Tickets', qty: 1 },
    { name: 'Nackenkissen', qty: 1 },
    { name: 'Kopfhörer', qty: 1 },
    { name: 'Snacks', qty: 1 }
  ],
  meds: [
    { name: 'Pflaster', qty: 1 },
    { name: 'Schmerzmittel', qty: 1 },
    { name: 'Desinfektion', qty: 1 },
    { name: 'Fieberthermometer', qty: 1 }
  ]
};

const addTemplate = async (type: 'beach' | 'flight' | 'meds') => {
  const items = templates[type];
  for (const item of items) {
    await dataStore.addPackingItem(activeTab.value, {
      id: Date.now() + Math.random(),
      name: item.name,
      qty: item.qty,
      checked: false
    });
  }
};

const shareList = async () => {
  const text = currentList.value
    .map(i => `${i.checked ? '[x]' : '[ ]'} ${i.name} ${i.qty > 1 ? `(x${i.qty})` : ''}`)
    .join('\n');

  const shareData = {
    title: `Packliste für ${settings.names[activeTab.value as keyof typeof settings.names]}`,
    text: text
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(text);
      alert('Liste in die Zwischenablage kopiert!');
    }
  } catch (err) {
    console.error('Error sharing:', err);
  }
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

.essential-banner {
  background: linear-gradient(135deg, var(--sunset), #EA580C);
  color: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform 0.2s;
}

.essential-banner:active { transform: scale(0.98); }

.essential-icon { font-size: 2em; }
.essential-label { font-size: 0.75em; text-transform: uppercase; opacity: 0.9; letter-spacing: 1px; }
.essential-msg { font-size: 1.1em; font-weight: 700; font-family: 'Caveat', cursive; }

.progress-card {
  background: linear-gradient(135deg, var(--ocean), var(--ocean-dark));
  color: white;
  text-align: center;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 600;
}

.progress-bar {
  background: rgba(255,255,255,0.3);
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  background: white;
  height: 100%;
  transition: width 0.5s ease;
}

.progress-stats { font-size: 0.85em; opacity: 0.9; }

/* Tabs */
.tabs-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 12px;
  scrollbar-width: none;
}
.tabs-scroll::-webkit-scrollbar { display: none; }

.tab-chip {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  color: var(--text-light);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-chip.active {
  background: var(--ocean);
  color: white;
  border-color: var(--ocean);
  box-shadow: var(--shadow);
}

/* List */
.list-card { min-height: 300px; }
.header-actions { margin-left: auto; }

.btn-sm {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8em;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.packing-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
}
.packing-item:last-child { border-bottom: none; }

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-radius: 6px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--success);
  font-weight: 800;
  transition: all 0.2s;
}

.packing-item.checked .checkbox {
  border-color: var(--success);
  background: rgba(16, 185, 129, 0.1);
}

.packing-item.checked .item-name {
  text-decoration: line-through;
  opacity: 0.5;
}

.item-content { flex: 1; display: flex; align-items: center; gap: 8px; }
.item-qty {
  background: var(--bg);
  font-size: 0.75em;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  color: var(--text-light);
}

.btn-del {
  background: none;
  border: none;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
}
.packing-item:hover .btn-del { opacity: 1; }

.add-form {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 2px solid var(--border);
}

.input-name { flex: 1; }
.input-qty { width: 60px; text-align: center; }
.btn-add {
  background: var(--ocean);
  color: white;
  border: none;
  border-radius: 12px;
  width: 48px;
  font-size: 1.5em;
  cursor: pointer;
}

/* Templates */
.templates-section {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}
.templates-label { font-size: 0.85em; color: var(--text-light); margin-bottom: 8px; }
.templates-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.btn-template {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85em;
  cursor: pointer;
}
</style>
