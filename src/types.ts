export interface Attraction {
  id: string;
  title: string;
  icon: string;
  distance: string;
  open: string;
  price: string;
  kidRating: number;
  description: string;
  tip: string;
  taxiAddress?: { fr: string; tn: string };
  lat?: number;
  lng?: number;
  content?: string; // HTML content for details
}

export interface Phrase {
  de: string;
  fr: string;
  tn?: string; // Optional Tunisian
  phonetic: string;
  category: 'restaurant' | 'shopping' | 'general' | 'taxi' | 'emergency';
}

export interface EmergencyNumber {
  label: string;
  value: string;
  tel?: string; // If callable
  icon?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  unlocked: boolean;
}

export interface PackingItem {
  id: number;
  name: string;
  qty: number;
  checked: boolean;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  desc: string;
  date: string;
}

export interface Plan {
  id: number;
  date: string;
  activity: string;
  time?: string;
}

export interface Budget {
  total: number;
  expenses: Expense[];
}

export interface PersonPacking {
  [key: string]: PackingItem[];
}

export interface Photo {
  id: number;
  dataUrl: string;
  date: string;
  note: string;
}
