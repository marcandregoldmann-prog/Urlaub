<template>
  <div class="container">
    <div class="header">
      <h1>Planer 📅</h1>
      <p class="subtitle">Dein Urlaubstag für Tag</p>
    </div>

    <!-- Recommendations -->
    <div v-if="recommendation" class="card recommendation-card">
      <div class="rec-header">
        <span class="rec-icon">💡</span>
        <span>Empfehlung für heute:</span>
      </div>
      <div class="rec-content">
        <h3>{{ recommendation.title }}</h3>
        <p>{{ recommendation.reason }}</p>
        <button class="btn-rec" @click="acceptRecommendation">Planen!</button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div v-for="(day, dateStr) in groupedPlans" :key="dateStr" class="day-group">
        <div class="day-header">
          <div class="day-title">{{ formatDate(dateStr) }}</div>
          <div class="day-weather">☀️ 32°C</div>
        </div>

        <div class="plans-list">
          <div v-for="plan in day" :key="plan.id" class="plan-card">
            <div class="plan-time">{{ plan.time || 'Tagsüber' }}</div>
            <div class="plan-detail">
              <div class="plan-activity">{{ plan.activity }}</div>
            </div>
            <button class="btn-del" @click="dataStore.deletePlan(plan.id)">🗑️</button>
          </div>
        </div>
      </div>

      <div v-if="Object.keys(groupedPlans).length === 0" class="empty-timeline">
        Noch keine Pläne. Füge etwas hinzu! 👇
      </div>
    </div>

    <!-- Add Form -->
    <div class="card add-card">
      <div class="card-header">
        <div class="card-icon">➕</div>
        <div class="card-title">Neuer Plan</div>
      </div>

      <form @submit.prevent="addPlan">
        <div class="input-group">
          <label class="label">Datum</label>
          <input v-model="form.date" type="date" required />
        </div>
        <div class="input-group">
          <label class="label">Aktivität</label>
          <input v-model="form.activity" type="text" placeholder="z.B. Piratenschiff" required />
        </div>
        <div class="input-group">
          <label class="label">Uhrzeit (Optional)</label>
          <input v-model="form.time" type="time" />
        </div>
        <button type="submit" class="btn">Hinzufügen</button>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { parseISO } from 'date-fns';
import type { Plan } from '../types';

const dataStore = useDataStore();

const form = ref({
  date: new Date().toISOString().split('T')[0],
  activity: '',
  time: ''
});

const groupedPlans = computed(() => {
  const groups: Record<string, Plan[]> = {};
  // Sort by date then time
  const sorted = [...dataStore.plans].sort((a, b) => {
    const da = parseISO(a.date);
    const db = parseISO(b.date);
    if (da.getTime() !== db.getTime()) return da.getTime() - db.getTime();
    return (a.time || '').localeCompare(b.time || '');
  });

  sorted.forEach(p => {
    if (!groups[p.date]) groups[p.date] = [];
    groups[p.date]!.push(p);
  });
  return groups;
});

const formatDate = (dateStr: any) => {
  if (!dateStr) return '';
  try {
    const d = parseISO(String(dateStr));
    return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch (e) {
    return String(dateStr);
  }
};

const addPlan = async () => {
  if (!form.value.activity) return;
  const time = form.value.time || undefined;
  await dataStore.addPlan({
    id: Date.now(),
    date: form.value.date,
    activity: form.value.activity,
    time: time
  } as Plan);
  form.value.activity = '';
  form.value.time = '';
};

// Recommendation Engine (Mock)
const recommendation = computed(() => {
  // Simple logic: if budget is high, recommend expensive tour. If low, beach.
  const budgetHigh = dataStore.budget.total > 1000; // Mock threshold
  // Check if Piratenschiff is already visited
  const visitedPirate = dataStore.visitedAttractions.includes('pirate');

  if (!visitedPirate && budgetHigh) {
    return {
      title: '🏴‍☠️ Piraten-Bootsfahrt',
      reason: 'Budget sieht gut aus! Perfektes Wetter für eine Bootstour.',
      activity: 'Piraten-Bootsfahrt'
    };
  }

  // Default
  return {
    title: '🏖️ Strandtag',
    reason: '32°C heute! Perfekt für Sidi Mahrez.',
    activity: 'Strandtag Sidi Mahrez'
  };
});

const acceptRecommendation = () => {
  if (!recommendation.value) return;
  form.value.activity = recommendation.value.activity;
  // Scroll to form?
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

.timeline {
  position: relative;
  padding-left: 20px;
  margin-bottom: 40px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.day-group { margin-bottom: 32px; position: relative; }

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.day-title {
  font-weight: 800;
  color: var(--ocean);
  background: var(--bg);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

.day-weather {
  font-size: 0.85em;
  color: var(--text-light);
  background: var(--sand-light);
  padding: 2px 8px;
  border-radius: 8px;
  color: #92400E;
}

.plan-card {
  background: var(--card);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
}

.plan-time {
  font-size: 0.85em;
  color: var(--text-light);
  font-weight: 600;
  min-width: 60px;
}

.plan-detail { flex: 1; }
.plan-activity { font-weight: 700; color: var(--text); }

.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.3;
}
.btn-del:hover { opacity: 1; }

.empty-timeline {
  text-align: center;
  color: var(--text-light);
  padding: 40px;
}

.recommendation-card {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border: 2px solid var(--sand);
  margin-bottom: 32px;
  animation: slideDown 0.5s ease;
}

.rec-header {
  font-weight: 700;
  color: #92400E;
  margin-bottom: 8px;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rec-content h3 {
  color: #78350F;
  margin-bottom: 4px;
}

.rec-content p {
  font-size: 0.9em;
  color: #92400E;
  margin-bottom: 12px;
}

.btn-rec {
  background: white;
  color: #92400E;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  width: auto;
  box-shadow: var(--shadow);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
