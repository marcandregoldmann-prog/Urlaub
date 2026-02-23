<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <NavBar />
    <InstallPrompt />
    <OnboardingModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDataStore } from './stores/dataStore';
import NavBar from './components/NavBar.vue';
import InstallPrompt from './components/InstallPrompt.vue';
import OnboardingModal from './components/OnboardingModal.vue';

const dataStore = useDataStore();

onMounted(async () => {
  await dataStore.init();
});
</script>

<style>
.app-container {
  min-height: 100vh;
  padding-bottom: 80px; /* Space for NavBar */
  background: var(--bg);
  transition: background-color 0.3s ease;
}

/* Page Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
