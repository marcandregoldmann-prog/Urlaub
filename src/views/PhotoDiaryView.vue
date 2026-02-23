<template>
  <div class="container">
    <div class="header">
      <h1>Tagebuch 📸</h1>
      <p class="subtitle">Deine schönsten Momente</p>
    </div>

    <!-- Upload/Camera -->
    <div class="card upload-card" @click="triggerUpload">
      <div class="upload-icon">📷</div>
      <div class="upload-text">Foto hinzufügen</div>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="hidden-input"
        @change="handleFile"
      />
    </div>

    <!-- Photo Grid -->
    <div v-if="dataStore.photos.length === 0" class="empty-state">
      Noch keine Fotos. Mach den Anfang! 🌟
    </div>

    <div class="photo-grid">
      <div
        v-for="photo in dataStore.photos"
        :key="photo.id"
        class="photo-item"
        @click="openPhoto(photo)"
      >
        <img :src="photo.dataUrl" class="photo-img" loading="lazy" />
        <div class="photo-date">{{ photo.date }}</div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="selectedPhoto" class="modal-overlay" @click.self="selectedPhoto = null">
      <div class="modal-content photo-modal">
        <span class="modal-close" @click="selectedPhoto = null">&times;</span>
        <img :src="selectedPhoto.dataUrl" class="modal-img" />

        <div class="photo-details">
          <div class="detail-date">📅 {{ selectedPhoto.date }}</div>
          <textarea
            v-model="selectedPhoto.note"
            placeholder="Notiz hinzufügen..."
            class="note-input"
            @change="saveNote"
          ></textarea>
        </div>

        <button class="btn-del" @click="deletePhoto">🗑️ Löschen</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from '../stores/dataStore';
import type { Photo } from '../types';

const dataStore = useDataStore();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedPhoto = ref<Photo | null>(null);

const triggerUpload = () => {
  fileInput.value?.click();
};

const handleFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string;
    // Ideally resize here
    resizeImage(dataUrl, (resizedUrl) => {
      dataStore.addPhoto({
        id: Date.now(),
        dataUrl: resizedUrl,
        date: new Date().toLocaleDateString('de-DE'),
        note: ''
      });
    });
  };
  reader.readAsDataURL(file);
  target.value = ''; // Reset
};

const resizeImage = (url: string, callback: (url: string) => void) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxWidth = 800; // Limit size
    const maxHeight = 800;
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(img, 0, 0, width, height);
    callback(canvas.toDataURL('image/jpeg', 0.7)); // Compress
  };
  img.src = url;
};

const openPhoto = (photo: Photo) => {
  selectedPhoto.value = photo; // Note: Modifying this modifies store directly because store object is reactive
};

const saveNote = () => {
  // Store is reactive, but we need to persist to IDB
  dataStore.savePhotos();
};

const deletePhoto = () => {
  if (selectedPhoto.value && confirm('Foto wirklich löschen?')) {
    dataStore.deletePhoto(selectedPhoto.value.id);
    selectedPhoto.value = null;
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

.upload-card {
  border: 2px dashed var(--ocean);
  background: rgba(14, 165, 233, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-card:active { background: rgba(14, 165, 233, 0.2); }

.upload-icon { font-size: 2.5em; margin-bottom: 8px; }
.upload-text { font-weight: 700; color: var(--ocean); }

.hidden-input { display: none; }

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-light);
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 24px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  cursor: pointer;
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.photo-item:hover .photo-img { transform: scale(1.05); }

.photo-date {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 0.75em;
  padding: 4px 8px;
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
}

.photo-modal {
  background: black;
  padding: 0;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.modal-img {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  background: black;
}

.photo-details {
  background: var(--card);
  padding: 16px;
  flex: 1;
}

.detail-date {
  color: var(--text-light);
  font-size: 0.9em;
  margin-bottom: 8px;
}

.note-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  font-family: inherit;
  resize: none;
  height: 80px;
  background: var(--bg);
  color: var(--text);
}

.btn-del {
  background: var(--danger);
  color: white;
  border: none;
  padding: 12px;
  font-weight: 700;
  cursor: pointer;
}

.modal-close {
  color: white;
  top: 10px;
  right: 16px;
  font-size: 2em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}
</style>
