<template>
  <div class="container">
    <div class="header">
      <h1>Sprache 💬</h1>
      <p class="subtitle">Einfach verständigen</p>
    </div>

    <!-- Category Filter -->
    <div class="filter-scroll">
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="filter-chip"
        :class="{ active: selectedCategory === cat.id }"
        @click="selectedCategory = cat.id"
      >
        {{ cat.icon }} {{ cat.name }}
      </button>
    </div>

    <!-- List -->
    <div class="phrases-list">
      <div
        v-for="(phrase, index) in filteredPhrases"
        :key="index"
        class="card phrase-card"
        @click="playAudio(phrase.fr)"
      >
        <div class="phrase-main">
          <div class="lang-de">🇩🇪 {{ phrase.de }}</div>
          <div class="lang-fr">🇫🇷 {{ phrase.fr }}</div>
          <div class="lang-phonetic">🗣️ {{ phrase.phonetic }}</div>
        </div>
        <button class="btn-audio">🔊</button>
      </div>
    </div>

    <!-- Tip -->
    <div class="tip">
      <span class="tip-icon">💡</span>
      Tippe auf eine Karte, um die Aussprache zu hören (Beta).
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { phrases } from '../data/static';

const selectedCategory = ref('all');

const categories = [
  { id: 'all', name: 'Alle', icon: '∞' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
  { id: 'shopping', name: 'Einkaufen', icon: '🛍️' },
  { id: 'taxi', name: 'Taxi', icon: '🚕' },
  { id: 'general', name: 'Allgemein', icon: '👋' }
];

const filteredPhrases = computed(() => {
  if (selectedCategory.value === 'all') return phrases;
  return phrases.filter(p => p.category === selectedCategory.value);
});

const playAudio = (text: string) => {
  // Simple Web Speech API implementation
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  window.speechSynthesis.speak(utterance);
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

.filter-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 12px;
  scrollbar-width: none;
}
.filter-scroll::-webkit-scrollbar { display: none; }

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

.phrase-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.phrase-card:active {
  transform: scale(0.98);
}

.lang-de { font-size: 0.9em; color: var(--text-light); margin-bottom: 4px; }
.lang-fr { font-size: 1.1em; font-weight: 700; color: var(--ocean-dark); }
.lang-phonetic { font-size: 0.85em; font-style: italic; color: var(--text-light); margin-top: 4px; }

.btn-audio {
  background: var(--bg);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2em;
  cursor: pointer;
  color: var(--ocean);
}

.tip {
  background: var(--bg);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  font-size: 0.9em;
  color: var(--text-light);
  margin-top: 24px;
}
</style>
