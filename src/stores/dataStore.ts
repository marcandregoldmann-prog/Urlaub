import { defineStore } from 'pinia';
import { get, set } from 'idb-keyval';
import type { Budget, PersonPacking, Plan, Achievement, Expense, PackingItem, Photo } from '../types';
import { defaultAchievements, defaultPacking } from '../data/static';

export const useDataStore = defineStore('data', {
  state: () => ({
    budget: { total: 500, expenses: [] } as Budget,
    packing: JSON.parse(JSON.stringify(defaultPacking)) as PersonPacking, // Deep copy defaults
    plans: [] as Plan[],
    achievements: JSON.parse(JSON.stringify(defaultAchievements)) as Achievement[],
    visitedAttractions: [] as string[],
    photos: [] as Photo[],
    initialized: false
  }),

  actions: {
    async init() {
      if (this.initialized) return;

      const [budget, packing, plans, achievements, visited, photos] = await Promise.all([
        get<Budget>('budget'),
        get<PersonPacking>('packing'),
        get<Plan[]>('plans'),
        get<Achievement[]>('achievements'),
        get<string[]>('visitedAttractions'),
        get<Photo[]>('photos')
      ]);

      if (budget) this.budget = budget;
      if (packing) this.packing = packing;
      if (plans) this.plans = plans;
      if (achievements) this.achievements = achievements;
      if (visited) this.visitedAttractions = visited;
      if (photos) this.photos = photos;

      this.initialized = true;
    },

    async savePhotos() {
      await set('photos', JSON.parse(JSON.stringify(this.photos)));
    },

    async addPhoto(photo: Photo) {
      this.photos.unshift(photo);
      await this.savePhotos();
    },

    async deletePhoto(id: number) {
      this.photos = this.photos.filter(p => p.id !== id);
      await this.savePhotos();
    },

    async restoreData(data: any) {
      if (data.budget) this.budget = data.budget;
      if (data.packing) this.packing = data.packing;
      if (data.plans) this.plans = data.plans;
      if (data.achievements) this.achievements = data.achievements;
      if (data.visited) this.visitedAttractions = data.visited;
      if (data.photos) this.photos = data.photos;

      await Promise.all([
        this.saveBudget(),
        this.savePacking(),
        this.savePlans(),
        this.savePhotos(),
        set('achievements', JSON.parse(JSON.stringify(this.achievements))),
        set('visitedAttractions', JSON.parse(JSON.stringify(this.visitedAttractions)))
      ]);
    },

    async saveBudget() {
      await set('budget', JSON.parse(JSON.stringify(this.budget)));
    },

    async addExpense(expense: Expense) {
      this.budget.expenses.push(expense);
      await this.saveBudget();
    },

    async deleteExpense(id: number) {
      this.budget.expenses = this.budget.expenses.filter(e => e.id !== id);
      await this.saveBudget();
    },

    async updateBudgetTotal(total: number) {
      this.budget.total = total;
      await this.saveBudget();
    },

    async savePacking() {
      await set('packing', JSON.parse(JSON.stringify(this.packing)));
    },

    async togglePackingItem(person: string, id: number) {
      const list = this.packing[person];
      if (!list) return;
      const item = list.find(i => i.id === id);
      if (item) {
        item.checked = !item.checked;
        await this.savePacking();
      }
    },

    async addPackingItem(person: string, item: PackingItem) {
      if (!this.packing[person]) this.packing[person] = [];
      this.packing[person].push(item);
      await this.savePacking();
    },

    async deletePackingItem(person: string, id: number) {
      if (!this.packing[person]) return;
      this.packing[person] = this.packing[person].filter(i => i.id !== id);
      await this.savePacking();
    },

    async savePlans() {
      await set('plans', JSON.parse(JSON.stringify(this.plans)));
    },

    async addPlan(plan: Plan) {
      this.plans.push(plan);
      await this.savePlans();
    },

    async deletePlan(id: number) {
      this.plans = this.plans.filter(p => p.id !== id);
      await this.savePlans();
    },

    async toggleVisited(id: string) {
      if (this.visitedAttractions.includes(id)) {
        this.visitedAttractions = this.visitedAttractions.filter(v => v !== id);
      } else {
        this.visitedAttractions.push(id);
      }
      await set('visitedAttractions', JSON.parse(JSON.stringify(this.visitedAttractions)));
    },

    async unlockAchievement(id: string) {
      const achievement = this.achievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        await set('achievements', JSON.parse(JSON.stringify(this.achievements)));
        return true; // Return true to trigger UI feedback
      }
      return false;
    }
  }
});
