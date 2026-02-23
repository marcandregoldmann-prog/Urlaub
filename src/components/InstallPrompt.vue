<template>
  <transition name="slide-up">
    <div v-if="showPrompt" class="install-prompt">
      <div class="prompt-content">
        <h3>🏝️ App installieren?</h3>
        <p>Installiere Djerba Buddy auf deinem Homescreen für schnellen Zugriff - auch offline!</p>
        <div class="actions">
          <button class="btn btn-primary" @click="installApp">📲 Jetzt installieren</button>
          <button class="btn btn-secondary" @click="dismiss">Später</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const deferredPrompt = ref<any>(null);
const showPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;

    // Show prompt after a delay if not dismissed previously
    setTimeout(() => {
      const dismissed = localStorage.getItem('installDismissed');
      // Only show if not dismissed recently (e.g. within 7 days) - simpler: just check flag
      if (!dismissed) {
        showPrompt.value = true;
      }
    }, 3000);
  });
});

const installApp = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const choiceResult = await deferredPrompt.value.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    deferredPrompt.value = null;
    showPrompt.value = false;
  }
};

const dismiss = () => {
  showPrompt.value = false;
  localStorage.setItem('installDismissed', 'true');
};
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 80px; /* Above NavBar */
  left: 16px;
  right: 16px;
  background: var(--card);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  border: 1px solid var(--border);
  padding: 20px;
}

.prompt-content h3 {
  margin-bottom: 8px;
  color: var(--text);
}

.prompt-content p {
  color: var(--text-light);
  margin-bottom: 16px;
  font-size: 0.9em;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: var(--ocean);
  color: white;
}

.btn-secondary {
  background: var(--bg);
  color: var(--text-light);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
