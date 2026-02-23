<template>
  <div class="container">
    <div class="header">
      <h1>Notfall 🆘</h1>
      <p class="subtitle">Hilfe in jeder Situation</p>
    </div>

    <!-- Emergency Numbers -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🚨</div>
        <div class="card-title">Wichtige Nummern</div>
      </div>

      <div
        v-for="item in emergencyNumbers"
        :key="item.value"
        class="emergency-item"
      >
        <div class="item-icon">{{ item.icon }}</div>
        <div class="item-content">
          <div class="item-label">{{ item.label }}</div>
          <div class="item-value">{{ item.value }}</div>
        </div>
        <a v-if="item.tel" :href="'tel:' + item.tel" class="btn-call">📞</a>
      </div>
    </div>

    <!-- Offline Notice -->
    <div class="tip">
      <span class="tip-icon">⚠️</span>
      Diese App funktioniert komplett offline. Alle Nummern sind immer verfügbar!
    </div>

    <!-- Location -->
    <div class="card location-card">
      <div class="card-header">
        <div class="card-icon">📍</div>
        <div class="card-title">Dein Standort</div>
      </div>
      <p>
        <strong>Royal Karthago Djerba</strong><br>
        Zone Touristique, Midoun<br>
        4116 Djerba
      </p>
      <button class="btn btn-copy" @click="copyAddress">Adresse kopieren</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { emergencyNumbers } from '../data/static';

const copyAddress = () => {
  navigator.clipboard.writeText('Royal Karthago Djerba, Zone Touristique, Midoun, 4116 Djerba');
  alert('Adresse kopiert!');
};
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, var(--danger) 0%, #DC2626 100%);
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

.emergency-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}
.emergency-item:last-child { border-bottom: none; }

.item-icon { font-size: 2em; margin-right: 16px; }
.item-content { flex: 1; }
.item-label { font-weight: 600; color: var(--text-light); font-size: 0.9em; }
.item-value { font-weight: 700; font-size: 1.1em; color: var(--text); font-family: monospace; }

.btn-call {
  background: var(--success);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 1.5em;
  box-shadow: var(--shadow);
  transition: transform 0.2s;
}
.btn-call:active { transform: scale(0.95); }

.location-card {
  border-left: 4px solid var(--ocean);
  margin-top: 20px;
}

.btn-copy {
  margin-top: 12px;
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  font-size: 0.9em;
  padding: 8px 16px;
}
</style>
