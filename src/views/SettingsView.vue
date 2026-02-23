<template>
  <div class="container">
    <div class="header">
      <h1>Einstellungen ⚙️</h1>
      <p class="subtitle">Personalisiere deine App</p>
    </div>

    <!-- Appearance -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🎨</div>
        <div class="card-title">Darstellung</div>
      </div>

      <div class="setting-row">
        <span>Dark Mode</span>
        <button class="toggle-switch" :class="{ active: isDark }" @click="toggleDark()">
          <div class="switch-handle"></div>
        </button>
      </div>
    </div>

    <!-- Names -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">👨‍👩‍👦</div>
        <div class="card-title">Reisende</div>
      </div>

      <div class="input-group">
        <label class="label">Name 1</label>
        <input v-model="settings.names.marc" type="text" />
      </div>
      <div class="input-group">
        <label class="label">Name 2</label>
        <input v-model="settings.names.marie" type="text" />
      </div>
      <div class="input-group">
        <label class="label">Name 3</label>
        <input v-model="settings.names.marvin" type="text" />
      </div>
    </div>

    <!-- Data Management -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">💾</div>
        <div class="card-title">Daten & Backup</div>
      </div>

      <button class="btn btn-secondary" @click="exportData">📤 Daten exportieren (JSON)</button>

      <div class="import-section">
        <button class="btn btn-secondary" @click="triggerImport">📥 Daten importieren</button>
        <input ref="importInput" type="file" accept=".json" class="hidden" @change="importData" />
      </div>

      <button class="btn btn-danger" @click="resetApp">🗑️ App zurücksetzen</button>
    </div>

    <!-- Achievements -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🏆</div>
        <div class="card-title">Erfolge</div>
      </div>

      <div class="achievements-list">
        <div
          v-for="ach in dataStore.achievements"
          :key="ach.id"
          class="achievement-item"
          :class="{ unlocked: ach.unlocked }"
        >
          <div class="ach-icon">{{ ach.icon }}</div>
          <div class="ach-info">
            <div class="ach-title">{{ ach.title }}</div>
            <div class="ach-desc">{{ ach.desc }}</div>
          </div>
          <div v-if="ach.unlocked" class="ach-check">✅</div>
        </div>
      </div>
    </div>

    <div class="about">
      Djerba Buddy v2.0<br>
      Made with ❤️
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDark, useToggle } from '@vueuse/core';
import { useSettingsStore } from '../stores/settingsStore';
import { useDataStore } from '../stores/dataStore';

const isDark = useDark();
const toggleDark = useToggle(isDark);
const settings = useSettingsStore();
const dataStore = useDataStore();
const importInput = ref<HTMLInputElement | null>(null);

const exportData = () => {
  const data = {
    budget: dataStore.budget,
    packing: dataStore.packing,
    plans: dataStore.plans,
    achievements: dataStore.achievements,
    visited: dataStore.visitedAttractions,
    photos: dataStore.photos,
    settings: {
      names: settings.names,
      dates: settings.tripDates
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `djerba-buddy-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const triggerImport = () => {
  importInput.value?.click();
};

const importData = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string);

      if (confirm('Achtung: Alle aktuellen Daten werden überschrieben! Fortfahren?')) {
        await dataStore.restoreData(data);

        if (data.settings) {
          settings.names = data.settings.names;
          settings.tripDates = data.settings.dates;
        }

        alert('Daten erfolgreich importiert! App wird neu geladen.');
        location.reload();
      }
    } catch (err) {
      alert('Fehler beim Importieren: ' + err);
    }
  };
  reader.readAsText(file);
  target.value = '';
};

const resetApp = () => {
  if (confirm('Wirklich ALLES löschen? Das kann nicht rückgängig gemacht werden!')) {
    localStorage.clear();
    indexedDB.deleteDatabase('keyval-store'); // default idb-keyval db
    location.reload();
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

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  padding: 8px 0;
}

.toggle-switch {
  width: 50px;
  height: 28px;
  background: var(--border);
  border-radius: 14px;
  position: relative;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.toggle-switch.active {
  background: var(--ocean);
}

.switch-handle {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch.active .switch-handle {
  transform: translateX(22px);
}

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  margin-bottom: 12px;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  border: 1px solid var(--danger);
  margin-top: 12px;
}

.import-section {
  position: relative;
}
.hidden { display: none; }

.achievements-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  opacity: 0.6;
}

.achievement-item.unlocked {
  opacity: 1;
  border-color: var(--sand);
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
}

.ach-icon { font-size: 2em; }
.ach-info { flex: 1; }
.ach-title { font-weight: 700; font-size: 0.9em; }
.ach-desc { font-size: 0.8em; }

.about {
  text-align: center;
  color: var(--text-light);
  font-size: 0.8em;
  margin-top: 40px;
  opacity: 0.5;
}
</style>
