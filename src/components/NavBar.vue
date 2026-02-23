<template>
  <nav class="navbar">
    <div class="navbar-content">
      <router-link to="/" class="nav-item" active-class="active">
        <component :is="Home" class="icon" />
        <span>Home</span>
      </router-link>

      <router-link to="/attractions" class="nav-item" active-class="active">
        <component :is="Map" class="icon" />
        <span>Karte</span>
      </router-link>

      <router-link to="/taxi" class="nav-item" active-class="active">
        <component :is="Car" class="icon" />
        <span>Taxi</span>
      </router-link>

      <router-link to="/budget" class="nav-item" active-class="active">
        <component :is="Wallet" class="icon" />
        <span>Budget</span>
      </router-link>

      <router-link to="/packing" class="nav-item" active-class="active">
        <component :is="CheckSquare" class="icon" />
        <span>Packen</span>
      </router-link>

      <router-link to="/planner" class="nav-item" active-class="active">
        <component :is="Calendar" class="icon" />
        <span>Planer</span>
      </router-link>

      <router-link to="/restaurants" class="nav-item" active-class="active">
        <component :is="Utensils" class="icon" />
        <span>Essen</span>
      </router-link>

      <router-link to="/diary" class="nav-item" active-class="active">
        <component :is="Camera" class="icon" />
        <span>Fotos</span>
      </router-link>

      <router-link to="/phrases" class="nav-item" active-class="active">
        <component :is="MessageCircle" class="icon" />
        <span>Sprache</span>
      </router-link>

      <router-link to="/emergency" class="nav-item" active-class="active">
        <component :is="Siren" class="icon" />
        <span>Notfall</span>
      </router-link>

      <router-link to="/settings" class="nav-item" active-class="active">
        <component :is="Settings" class="icon" />
        <span>Settings</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import {
  Home, Map, Car, Wallet, CheckSquare, Calendar,
  Utensils, Camera, MessageCircle, Siren, Settings
} from 'lucide-vue-next';
</script>

<style scoped>
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--card);
  border-top: 1px solid var(--border);
  padding: 8px 0;
  z-index: 100;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.navbar-content {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding: 0 16px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.navbar-content::-webkit-scrollbar {
  display: none;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 64px;
  text-decoration: none;
  color: var(--text-light);
  font-size: 0.75rem;
  transition: color 0.2s, transform 0.2s;
  padding: 8px 0;
  border-radius: 8px;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: var(--ocean);
  font-weight: 600;
}

.icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}
</style>
