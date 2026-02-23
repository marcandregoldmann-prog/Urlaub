<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="header">
        <h2>Willkommen! 🏝️</h2>
        <p class="subtitle">Lass uns Djerba Buddy einrichten.</p>
      </div>

      <form @submit.prevent="submit">
        <div class="section-title">Wer reist mit?</div>
        <div class="input-group">
          <label class="label">Name 1 (Erwachsener)</label>
          <input v-model="form.names.marc" type="text" required />
        </div>
        <div class="input-group">
          <label class="label">Name 2 (Erwachsener)</label>
          <input v-model="form.names.marie" type="text" required />
        </div>
        <div class="input-group">
          <label class="label">Name 3 (Kind)</label>
          <input v-model="form.names.marvin" type="text" required />
        </div>

        <div class="section-title">Reise-Budget</div>
        <div class="input-group">
          <label class="label">Gesamtbudget (€)</label>
          <input v-model.number="form.budget" type="number" min="100" required />
        </div>

        <div class="section-title">Wann geht's los?</div>
        <div class="input-group">
          <div class="date-row">
            <div>
              <label class="label">Start</label>
              <input v-model="form.dates.start" type="date" required />
            </div>
            <div>
              <label class="label">Ende</label>
              <input v-model="form.dates.end" type="date" required />
            </div>
          </div>
        </div>

        <button type="submit" class="btn">Urlaub starten! 🚀</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { useDataStore } from '../stores/dataStore';

const settings = useSettingsStore();
const dataStore = useDataStore();

const isOpen = computed(() => !settings.onboardingComplete);

const form = ref({
  names: { ...settings.names },
  budget: dataStore.budget.total,
  dates: { ...settings.tripDates }
});

const submit = async () => {
  // Update Settings
  settings.updateName('marc', form.value.names.marc);
  settings.updateName('marie', form.value.names.marie);
  settings.updateName('marvin', form.value.names.marvin);
  settings.setTripDates(form.value.dates.start, form.value.dates.end);

  // Update Budget
  await dataStore.updateBudgetTotal(form.value.budget);

  // Complete
  settings.setOnboardingComplete(true);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--card);
  border-radius: 24px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

h2 {
  font-family: 'Caveat', cursive;
  font-size: 2.5rem;
  color: var(--ocean);
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-light);
}

.section-title {
  font-weight: 700;
  margin: 20px 0 12px;
  color: var(--text);
  border-bottom: 2px solid var(--border);
  padding-bottom: 4px;
}

.date-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.btn {
  margin-top: 24px;
  background: linear-gradient(135deg, var(--ocean), var(--ocean-dark));
  color: white;
  font-size: 1.1rem;
}
</style>
