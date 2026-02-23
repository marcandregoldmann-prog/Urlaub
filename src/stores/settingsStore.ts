import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSettingsStore = defineStore('settings', () => {
  // Persist to localStorage automatically with useStorage
  const names = useStorage('user-names', {
    marc: 'Marc',
    marie: 'Marie',
    marvin: 'Marvin'
  });

  const onboardingComplete = useStorage('onboarding-complete', false);

  const tripDates = useStorage('trip-dates', {
    start: '',
    end: ''
  });

  function updateName(key: 'marc' | 'marie' | 'marvin', newName: string) {
    names.value[key] = newName;
  }

  function setOnboardingComplete(complete: boolean) {
    onboardingComplete.value = complete;
  }

  function setTripDates(start: string, end: string) {
    tripDates.value = { start, end };
  }

  return {
    names,
    onboardingComplete,
    tripDates,
    updateName,
    setOnboardingComplete,
    setTripDates
  };
});
