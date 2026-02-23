<template>
  <div class="container">
    <div class="header-main">
      <h1>Djerba Buddy 🏝️</h1>
      <p class="subtitle">Willkommen zurück, {{ settings.names.marc }}!</p>
    </div>

    <!-- Countdown / Status -->
    <div class="card status-card">
      <div v-if="tripStatus === 'before'" class="countdown">
        <div class="count-val">{{ daysUntil }}</div>
        <div class="count-label">Tage bis zum Urlaub! ✈️</div>
      </div>
      <div v-else-if="tripStatus === 'during'" class="countdown">
        <div class="count-val">Tag {{ currentDay }}</div>
        <div class="count-label">Genieße jeden Moment! ☀️</div>
      </div>
      <div v-else class="countdown">
        <div class="count-val">Willkommen</div>
        <div class="count-label">zuhause! Hoffe es war schön. 🏠</div>
      </div>
    </div>

    <!-- Weather (Mock) -->
    <div class="weather-row">
      <div class="weather-card">
        <div class="weather-icon">☀️</div>
        <div class="weather-temp">32°C</div>
        <div class="weather-desc">Sonnig</div>
      </div>
      <div class="weather-card">
        <div class="weather-icon">💧</div>
        <div class="weather-temp">28°C</div>
        <div class="weather-desc">Wasser</div>
      </div>
      <div class="weather-tip">
        UV-Index 11! 🧴 Cremen nicht vergessen!
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid-actions">
      <router-link to="/attractions" class="action-btn">
        <span class="action-icon">🗺️</span>
        <span>Ausflüge</span>
      </router-link>
      <router-link to="/taxi" class="action-btn">
        <span class="action-icon">🚕</span>
        <span>Taxi</span>
      </router-link>
      <router-link to="/phrases" class="action-btn">
        <span class="action-icon">💬</span>
        <span>Sprache</span>
      </router-link>
      <router-link to="/diary" class="action-btn">
        <span class="action-icon">📸</span>
        <span>Tagebuch</span>
      </router-link>
    </div>

    <!-- Budget Snapshot -->
    <div class="card mini-budget" @click="$router.push('/budget')">
      <div class="mini-budget-header">
        <span>💰 Budget</span>
        <span :class="budgetColor">{{ remaining.toFixed(0) }}€ übrig</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: budgetPercent + '%', backgroundColor: budgetColorHex }"></div>
      </div>
    </div>

    <!-- Upcoming Plans -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📅</div>
        <div class="card-title">Nächste Pläne</div>
      </div>

      <div v-if="upcomingPlans.length === 0" class="empty-state">
        Nichts geplant. Entspann dich! 🍹
        <br>
        <router-link to="/planner" class="btn-link">Plan erstellen</router-link>
      </div>

      <div v-else class="plans-list">
        <div v-for="plan in upcomingPlans" :key="plan.id" class="plan-item">
          <div class="plan-date">{{ formatDate(plan.date) }}</div>
          <div class="plan-content">
            <div class="plan-title">{{ plan.activity }}</div>
            <div class="plan-time" v-if="plan.time">⏰ {{ plan.time }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';
import { useDataStore } from '../stores/dataStore';
import { differenceInDays, isBefore, isAfter, parseISO, startOfDay } from 'date-fns';

const settings = useSettingsStore();
const dataStore = useDataStore();

const today = startOfDay(new Date());

const tripStatus = computed(() => {
  const start = settings.tripDates.start ? parseISO(settings.tripDates.start) : null;
  const end = settings.tripDates.end ? parseISO(settings.tripDates.end) : null;

  if (!start) return 'before';

  if (isBefore(today, start)) return 'before';
  if (end && isAfter(today, end)) return 'after';
  return 'during';
});

const daysUntil = computed(() => {
  if (!settings.tripDates.start) return 0;
  return differenceInDays(parseISO(settings.tripDates.start), today);
});

const currentDay = computed(() => {
  if (!settings.tripDates.start) return 1;
  return differenceInDays(today, parseISO(settings.tripDates.start)) + 1;
});

const remaining = computed(() => {
  const spent = dataStore.budget.expenses.reduce((sum, e) => sum + e.amount, 0);
  return dataStore.budget.total - spent;
});

const budgetPercent = computed(() => {
  return Math.max(0, (remaining.value / dataStore.budget.total) * 100);
});

const budgetColor = computed(() => {
  const pct = budgetPercent.value;
  if (pct < 20) return 'text-danger';
  if (pct < 40) return 'text-warning';
  return 'text-success';
});

const budgetColorHex = computed(() => {
  const pct = budgetPercent.value;
  if (pct < 20) return '#EF4444';
  if (pct < 40) return '#F59E0B';
  return '#10B981';
});

const upcomingPlans = computed(() => {
  return dataStore.plans
    .filter(p => !isBefore(parseISO(p.date), today))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
    .slice(0, 3);
});

const formatDate = (dateStr: string) => {
  const d = parseISO(dateStr);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' });
};
</script>

<style scoped>
.header-main {
  background: linear-gradient(135deg, var(--ocean) 0%, var(--ocean-dark) 100%);
  border-radius: 0 0 24px 24px; /* Only bottom rounded */
  padding: 24px 24px 40px;
  margin: -16px -16px 24px; /* Pull to edges */
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.header-main::before {
  content: '🏝️';
  position: absolute;
  font-size: 150px;
  opacity: 0.1;
  right: -20px;
  top: -20px;
  transform: rotate(15deg);
}

.header-main h1 {
  font-family: 'Caveat', cursive;
  font-size: 3em;
  font-weight: 700;
  margin-bottom: 4px;
}

.subtitle {
  opacity: 0.9;
  font-size: 1.1em;
}

.status-card {
  margin-top: -30px; /* Overlap header */
  background: var(--card);
  text-align: center;
  position: relative;
  z-index: 2;
  border: 1px solid var(--border);
}

.countdown {
  padding: 10px;
}

.count-val {
  font-size: 2.5em;
  font-weight: 800;
  color: var(--ocean);
  line-height: 1;
}

.count-label {
  color: var(--text-light);
  font-weight: 600;
  margin-top: 4px;
}

/* Weather */
.weather-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.weather-card {
  flex: 1;
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  padding: 16px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid var(--sand);
  min-width: 100px;
}

.weather-icon { font-size: 2em; margin-bottom: 4px; }
.weather-temp { font-weight: 800; font-size: 1.5em; color: #78350F; }
.weather-desc { font-size: 0.8em; color: #92400E; font-weight: 600; }

.weather-tip {
  flex: 2;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: var(--text-light);
  line-height: 1.4;
}

/* Quick Actions */
.grid-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.action-btn {
  background: var(--card);
  border-radius: 16px;
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--text);
  box-shadow: var(--shadow);
  transition: transform 0.2s;
  font-size: 0.8em;
  font-weight: 600;
}

.action-btn:active { transform: scale(0.95); }

.action-icon {
  font-size: 1.8em;
  margin-bottom: 4px;
}

/* Mini Budget */
.mini-budget {
  cursor: pointer;
}
.mini-budget-header {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 12px;
}
.text-success { color: var(--success); }
.text-warning { color: #F59E0B; }
.text-danger { color: var(--danger); }

.progress-bar {
  background: var(--bg);
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Plans */
.empty-state {
  text-align: center;
  color: var(--text-light);
  padding: 20px;
}

.btn-link {
  color: var(--ocean);
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  margin-top: 8px;
}

.plan-item {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.plan-item:last-child { border-bottom: none; }

.plan-date {
  background: var(--bg);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  text-align: center;
  min-width: 60px;
  justify-content: center;
}

.plan-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.plan-title { font-weight: 600; }
.plan-time { font-size: 0.85em; color: var(--text-light); }
</style>
