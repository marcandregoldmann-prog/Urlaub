<template>
  <div class="container">
    <div class="header">
      <h1>Budget 💰</h1>
      <p class="subtitle">Alles im Blick behalten</p>
    </div>

    <!-- Summary -->
    <div class="budget-summary">
      <div class="summary-top">
        <div>Noch verfügbar:</div>
        <button class="btn-icon" @click="showEditBudget = true" aria-label="Budget bearbeiten">✏️</button>
      </div>

      <div class="budget-amount">{{ remaining.toFixed(2) }}€</div>

      <div class="budget-bar">
        <div class="budget-bar-fill" :style="{ width: percentRemaining + '%' }" :class="statusColor"></div>
      </div>

      <div class="budget-status">{{ statusText }}</div>

      <!-- Quick Converter -->
      <div class="converter-pill">
        {{ remaining.toFixed(2) }}€ ≈ {{ (remaining * 3.37).toFixed(0) }} TND
      </div>
    </div>

    <!-- Add Expense -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">➕</div>
        <div class="card-title">Ausgabe</div>
      </div>

      <form @submit.prevent="addExpense">
        <div class="input-group">
          <label class="label">Kategorie</label>
          <div class="cat-grid">
            <div
              v-for="cat in categories"
              :key="cat.id"
              class="cat-item"
              :class="{ active: form.category === cat.id }"
              @click="form.category = cat.id"
            >
              <div class="cat-icon">{{ cat.icon }}</div>
              <div class="cat-name">{{ cat.name }}</div>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label class="label">Betrag (€)</label>
          <input v-model.number="form.amount" type="number" step="0.5" placeholder="0.00" required />
        </div>

        <div class="input-group">
          <label class="label">Beschreibung</label>
          <input v-model="form.desc" type="text" placeholder="Optional..." />
        </div>

        <button type="submit" class="btn">Eintragen</button>
      </form>
    </div>

    <!-- List -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📊</div>
        <div class="card-title">Verlauf</div>
      </div>

      <div v-if="dataStore.budget.expenses.length === 0" class="empty-state">
        Noch keine Ausgaben 🎉
      </div>

      <transition-group name="list" tag="div">
        <div
          v-for="expense in sortedExpenses"
          :key="expense.id"
          class="expense-item"
        >
          <div class="expense-left">
            <div class="expense-icon">{{ getIcon(expense.category) }}</div>
            <div>
              <div class="expense-desc">{{ expense.desc || expense.category }}</div>
              <div class="expense-date">{{ expense.date }}</div>
            </div>
          </div>
          <div class="expense-right">
            <div class="expense-amt">-{{ expense.amount.toFixed(2) }}€</div>
            <button class="btn-del" @click="dataStore.deleteExpense(expense.id)">🗑️</button>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Edit Budget Modal -->
    <div v-if="showEditBudget" class="modal-overlay" @click.self="showEditBudget = false">
      <div class="modal-content">
        <h3>Budget anpassen</h3>
        <input v-model.number="newBudget" type="number" />
        <div class="modal-actions">
          <button class="btn" @click="saveBudget">Speichern</button>
          <button class="btn btn-sec" @click="showEditBudget = false">Abbrechen</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStore } from '../stores/dataStore';

const dataStore = useDataStore();
const showEditBudget = ref(false);
const newBudget = ref(dataStore.budget.total);

const form = ref({
  category: 'Essen',
  amount: null as number | null,
  desc: ''
});

const categories = [
  { id: 'Essen', name: 'Essen', icon: '🍽️' },
  { id: 'Ausflug', name: 'Ausflug', icon: '🎟️' },
  { id: 'Taxi', name: 'Taxi', icon: '🚕' },
  { id: 'Souvenir', name: 'Souvenir', icon: '🛍️' },
  { id: 'Kinder', name: 'Kinder', icon: '👶' },
  { id: 'Sonstiges', name: 'Sonstiges', icon: '🎁' }
];

const remaining = computed(() => {
  const spent = dataStore.budget.expenses.reduce((sum, e) => sum + e.amount, 0);
  return dataStore.budget.total - spent;
});

const percentRemaining = computed(() => {
  return Math.max(0, (remaining.value / dataStore.budget.total) * 100);
});

const statusColor = computed(() => {
  if (percentRemaining.value < 20) return 'bg-danger';
  if (percentRemaining.value < 40) return 'bg-warning';
  return 'bg-success';
});

const statusText = computed(() => {
  if (percentRemaining.value > 70) return '😎 Läuft! Viel Spaß!';
  if (percentRemaining.value > 40) return '👍 Gut im Plan';
  if (percentRemaining.value > 20) return '⚠️ Langsam aufpassen';
  return '😬 Budget fast leer!';
});

const sortedExpenses = computed(() => {
  return [...dataStore.budget.expenses].sort((a, b) => b.id - a.id);
});

const getIcon = (catId: string) => categories.find(c => c.id === catId)?.icon || '💸';

const addExpense = async () => {
  if (!form.value.amount || form.value.amount <= 0) return;

  await dataStore.addExpense({
    id: Date.now(),
    category: form.value.category,
    amount: form.value.amount,
    desc: form.value.desc,
    date: new Date().toLocaleDateString('de-DE')
  });

  form.value.amount = null;
  form.value.desc = '';
};

const saveBudget = async () => {
  if (newBudget.value > 0) {
    await dataStore.updateBudgetTotal(newBudget.value);
    showEditBudget.value = false;
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

.budget-summary {
  background: linear-gradient(135deg, var(--palm), #059669);
  color: white;
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.summary-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9em;
  opacity: 0.9;
}

.btn-icon {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: white;
}

.budget-amount {
  font-size: 3em;
  font-weight: 800;
  font-family: 'Caveat', cursive;
  margin: 8px 0;
  line-height: 1;
}

.budget-bar {
  background: rgba(255,255,255,0.3);
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin: 16px 0 8px;
}

.budget-bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease, background-color 0.3s ease;
  background: white; /* Default */
}

.bg-warning { background: #FCD34D; }
.bg-danger { background: #FCA5A5; }

.converter-pill {
  display: inline-block;
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  margin-top: 12px;
}

/* Category Grid */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.cat-item {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-item.active {
  border-color: var(--ocean);
  background: rgba(14, 165, 233, 0.1);
}

.cat-icon { font-size: 1.5em; margin-bottom: 4px; }
.cat-name { font-size: 0.8em; font-weight: 600; }

/* List */
.empty-state {
  text-align: center;
  padding: 24px;
  color: var(--text-light);
}

.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.expense-item:last-child { border-bottom: none; }

.expense-left { display: flex; gap: 12px; align-items: center; }
.expense-icon { font-size: 1.5em; background: var(--bg); padding: 8px; border-radius: 12px; }
.expense-desc { font-weight: 600; }
.expense-date { font-size: 0.8em; color: var(--text-light); }

.expense-right { display: flex; align-items: center; gap: 8px; }
.expense-amt { font-weight: 700; color: var(--danger); }

.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s;
}
.btn-del:hover { opacity: 1; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-content {
  background: var(--card);
  padding: 24px;
  border-radius: 20px;
  width: 80%;
  max-width: 300px;
}
.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.btn-sec {
  background: var(--bg);
  color: var(--text);
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
