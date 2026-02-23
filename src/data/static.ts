import type { Attraction, Phrase, EmergencyNumber, Achievement, PersonPacking } from '../types';

export const attractions: Attraction[] = [
  {
    id: 'explore',
    title: 'Djerba Explore Park',
    icon: '🐊',
    distance: '4 km',
    open: '9-18 Uhr',
    price: '15 TND',
    kidRating: 4,
    description: 'Krokodilfarm mit Fütterungsshow, Museum & tunesisches Dorf - DER Hit für Kinder!',
    tip: 'Fütterung um 15 Uhr - Dein Kind wird noch Monate davon erzählen!',
    content: `
      <h2>DER Hit für Kinder!</h2>
      <p><strong>📍 Entfernung:</strong> 4 km vom Royal Karthago</p>
      <p><strong>⏱️ Öffnungszeiten:</strong> Täglich 9-18 Uhr</p>
      <p><strong>💰 Eintritt:</strong> ~15 TND pro Erwachsener (~4,50€)</p>
      <p><strong>👶 Kid-Rating:</strong> 👶👶👶👶 PERFEKT!</p>

      <h3>Was gibt es dort?</h3>
      <ul>
          <li>🐊 <strong>Krokodilfarm</strong> mit Nil-Krokodilen</li>
          <li>🎭 <strong>Spektakuläre Fütterungsshow</strong> um 15 Uhr!</li>
          <li>🏛️ <strong>Lalla Hadria Museum</strong> (arabische Kunst)</li>
          <li>🏘️ <strong>Traditionelles tunesisches Dorf</strong></li>
          <li>☕ Flaniermeile mit Cafés</li>
      </ul>

      <div class="tip" style="margin-top: 16px;">
          <strong>💡 Pro-Tipp:</strong> Kommt zur Fütterungszeit um 15 Uhr!
          Wird voll, aber euer 4-Jähriger wird noch Monate davon erzählen!
      </div>
    `,
    taxiAddress: {
      fr: 'Djerba Explore Park',
      tn: 'مزرعة التماسيح جربة إكسبلور'
    },
    lat: 33.822,
    lng: 11.049 // Approx
  },
  {
    id: 'erriadh',
    title: 'Djerbahood / Erriadh',
    icon: '🎨',
    distance: '25 km',
    open: 'Immer offen',
    price: 'Kostenlos!',
    kidRating: 3,
    description: '250+ bunte Street-Art Wandgemälde im ganzen Dorf - Schatzsuche für Kinder!',
    tip: 'Viele interaktive Kunstwerke als perfekte Fotokulisse!',
    content: `
      <h2>Street Art Paradies!</h2>
      <p><strong>📍 Entfernung:</strong> 25 km vom Royal Karthago</p>
      <p><strong>⏱️ Öffnungszeiten:</strong> Immer zugänglich</p>
      <p><strong>💰 Eintritt:</strong> KOSTENLOS!</p>
      <p><strong>👶 Kid-Rating:</strong> 👶👶👶 Gut!</p>

      <h3>Was ist das?</h3>
      <p>Ein ganzes Berberdorf wurde 2014 von internationalen Künstlern mit
      über 250 bunten Wandgemälden verschönert!</p>

      <ul>
          <li>🎨 <strong>250+ Wandgemälde</strong> im ganzen Dorf verteilt</li>
          <li>📸 <strong>Interaktive Kunstwerke</strong> als Fotokulisse</li>
          <li>🏃 <strong>"Schatzsuche"</strong> für Kinder - nächstes Bild finden!</li>
          <li>⏱️ <strong>Dauer:</strong> 30 Min. bis 2 Stunden</li>
      </ul>

      <div class="tip" style="margin-top: 16px;">
          <strong>💡 Pro-Tipp:</strong> Perfekt für Familien-Fotoshooting!
          Viele Kunstwerke laden zum Mitmachen ein.
      </div>
    `,
    taxiAddress: {
      fr: 'Erriadh / Djerbahood',
      tn: 'الرياض'
    },
    lat: 33.868,
    lng: 10.855 // Approx
  },
  {
    id: 'beach',
    title: 'Strand Sidi Mahrez',
    icon: '🏖️',
    distance: 'Nah am Hotel',
    open: '24/7',
    price: 'Kostenlos',
    kidRating: 4,
    description: '10km langer, flacher Sandstrand mit ruhigem Wasser - perfekt für 4-Jährige!',
    tip: 'Kamelritte am Strand: 15-30 TND (~5-10€)',
    content: `
      <h2>Der perfekte Familienstrand!</h2>
      <p><strong>📍 Entfernung:</strong> Nah am Hotel (fußläufig oder kurze Fahrt)</p>
      <p><strong>⏱️ Öffnungszeiten:</strong> 24/7</p>
      <p><strong>💰 Kosten:</strong> Kostenlos!</p>
      <p><strong>👶 Kid-Rating:</strong> 👶👶👶👶 PERFEKT!</p>

      <h3>Warum so gut für Kinder?</h3>
      <ul>
          <li>🏖️ <strong>10 km langer Sandstrand</strong> - viel Platz!</li>
          <li>💧 <strong>Flach abfallendes Wasser</strong> - sicher für 4-Jährige</li>
          <li>🌊 <strong>Ruhiges Meer</strong> - perfekt zum Planschen</li>
          <li>🏰 <strong>Feiner Sand</strong> - ideal für Sandburgen</li>
          <li>🐪 <strong>Kamelritte möglich</strong> - 15-30 TND (~5-10€)</li>
      </ul>

      <div class="tip" style="margin-top: 16px;">
          <strong>☀️ Sonnenschutz:</strong> SPF 50+ PFLICHT! Im Juli 32-35°C.
          Am besten vormittags oder nachmittags gehen.
      </div>
    `,
    lat: 33.84,
    lng: 11.02 // Approx
  },
  {
    id: 'market',
    title: 'Houmt Souk Markt',
    icon: '🛍️',
    distance: '20 km',
    open: '8-20 Uhr',
    price: 'Handeln!',
    kidRating: 3,
    description: 'Bunter Markt mit Handwerksvorführungen & Fisch-Auktion morgens',
    tip: 'Max. 30% des ersten Preises zahlen - Handeln gehört dazu!',
    content: `
      <h2>Orientalisches Shopping-Erlebnis!</h2>
      <p><strong>📍 Entfernung:</strong> 20 km vom Royal Karthago</p>
      <p><strong>⏱️ Öffnungszeiten:</strong> Täglich 8-20 Uhr</p>
      <p><strong>💰 Preise:</strong> HANDELN ist Pflicht!</p>
      <p><strong>👶 Kid-Rating:</strong> 👶👶👶 Interessant!</p>

      <h3>Was gibt es?</h3>
      <ul>
          <li>🎨 <strong>Handgemachte Souvenirs</strong> (Teppiche, Keramik, Schmuck)</li>
          <li>👨‍🎨 <strong>Handwerksvorführungen</strong> - spannend für Kinder!</li>
          <li>🐟 <strong>Fisch-Auktion</strong> morgens (authentisch!)</li>
          <li>🌶️ <strong>Gewürze & Lebensmittel</strong></li>
      </ul>

      <div class="tip" style="margin-top: 16px;">
          <strong>💰 Handel-Tipp:</strong> Zahlt MAX. 30% des ersten Preises!<br>
          <strong>Strategie:</strong> Freundlich bleiben, Preis nennen, wegdrehen wenn zu teuer 😊
      </div>
    `,
    taxiAddress: {
      fr: 'Houmt Souk',
      tn: 'حومة السوق'
    },
    lat: 33.876,
    lng: 10.858 // Approx
  },
  {
    id: 'pirate',
    title: 'Piraten-Bootsfahrt',
    icon: '🏴‍☠️',
    distance: 'Vom Hafen',
    open: '6 Stunden',
    price: '30-40 TND',
    kidRating: 4,
    description: 'Piraten mit Akrobatik, Musik, Insel-Stop & Mittagessen inklusive!',
    tip: 'Sehr familienfreundlich - Kinder lieben die Show!',
    content: `
      <h2>Abenteuer auf hoher See!</h2>
      <p><strong>📍 Start:</strong> Vom Hafen</p>
      <p><strong>⏱️ Dauer:</strong> Ca. 6 Stunden (9:30 - 15:30 Uhr)</p>
      <p><strong>💰 Preis:</strong> 30-40 TND pro Person (~10-12€)</p>
      <p><strong>👶 Kid-Rating:</strong> 👶👶👶👶 ABSOLUTES HIGHLIGHT!</p>

      <h3>Was erwartet euch?</h3>
      <ul>
          <li>🏴‍☠️ <strong>Piraten-Show</strong> mit Akrobatik & Musik</li>
          <li>🎭 <strong>Zaubertricks</strong> an Bord</li>
          <li>🏝️ <strong>Stop an einer Insel</strong> - 1h Strand & Schwimmen</li>
          <li>🍽️ <strong>Mittagessen inklusive</strong> (Fisch, Pasta, Obst)</li>
          <li>🥤 <strong>Getränke</strong> (Wasser, Cola) inklusive</li>
      </ul>

      <div class="tip" style="margin-top: 16px;">
          <strong>💡 Pro-Tipp:</strong> Super familienfreundlich!
          Die Piraten sind lustig und interagieren mit den Kindern.
          Sonnencreme & Schwimmzeug nicht vergessen!
      </div>

      <p style="margin-top: 16px;">
          <strong>📍 Buchung:</strong> Am besten über Hotel oder Reiseleitung buchen.
      </p>
    `,
    lat: 33.87,
    lng: 10.87 // Approx
  }
];

export const phrases: Phrase[] = [
  // Restaurant
  { category: 'restaurant', de: 'Die Rechnung, bitte', fr: "L'addition, s'il vous plaît", phonetic: 'la-di-ßjong sil wu plä' },
  { category: 'restaurant', de: 'Kindermenü?', fr: 'Menu pour enfant?', phonetic: 'mö-nü pur ong-fong' },
  { category: 'restaurant', de: 'Ohne Koriander, bitte', fr: "Sans coriandre, s'il vous plaît", phonetic: 'song ko-ri-ongdr sil wu plä' },
  // Shopping
  { category: 'shopping', de: 'Wie viel kostet das?', fr: 'Combien ça coûte?', phonetic: 'kom-bjäng sa kuht' },
  { category: 'shopping', de: 'Das ist zu teuer', fr: "C'est trop cher", phonetic: 'ßä tro schär' },
  { category: 'shopping', de: 'Letzter Preis?', fr: 'Dernier prix?', phonetic: 'där-njä pri' },
  // General
  { category: 'general', de: 'Guten Tag', fr: 'Bonjour / 🇹🇳 Salam', phonetic: 'bong-schur / sa-lam' },
  { category: 'general', de: 'Danke', fr: 'Merci / 🇹🇳 Shukran', phonetic: 'mär-ßi / schuk-ran' },
  { category: 'general', de: 'Ja / Nein', fr: 'Oui / Non', phonetic: 'wi / nong' },
  { category: 'general', de: 'Sprechen Sie Deutsch/Englisch?', fr: 'Parlez-vous allemand/anglais?', phonetic: 'par-le-wu al-mong/ong-glä' },
  // Taxi
  { category: 'taxi', de: 'Bitte Taxameter einschalten', fr: "Mettez le compteur, s'il vous plaît", phonetic: 'mätte lö kongtör sil wu plä' }
];

export const emergencyNumbers: EmergencyNumber[] = [
  { label: 'Notarzt', value: '190', tel: '190', icon: '🚑' },
  { label: 'Polizei', value: '197', tel: '197', icon: '🚓' },
  { label: 'Deutsche Botschaft Tunis', value: '+216 71 143 900', tel: '+21671143900', icon: '🇩🇪' },
  { label: 'Krankenhaus (6 km)', value: 'In Taxi zu "Hôpital" fahren', icon: '🏥' },
  { label: 'Royal Karthago Hotel', value: 'An Rezeption wenden', icon: '🏨' }
];

export const defaultAchievements: Achievement[] = [
  { id: 'krokodil', icon: '🐊', title: 'Krokodil-Flüsterer', desc: 'Djerba Explore besucht', unlocked: false },
  { id: 'kamel', icon: '🐪', title: 'Wüsten-Krieger', desc: 'Kamelritt gemacht', unlocked: false },
  { id: 'handel', icon: '💰', title: 'Handels-Meister', desc: '50% Rabatt beim Markt', unlocked: false },
  { id: 'sonne', icon: '☀️', title: 'Sonnenkönig', desc: '7 Tage ohne Sonnenbrand', unlocked: false },
  { id: 'pirat', icon: '🏴‍☠️', title: 'Piraten-Abenteuer', desc: 'Bootsfahrt gemacht', unlocked: false },
  { id: 'art', icon: '🎨', title: 'Kunst-Entdecker', desc: 'Erriadh besucht', unlocked: false }
];

export const defaultPacking: PersonPacking = {
  marc: [
    { id: 1,   name: 'Reisepass / Ausweis',    qty: 1, checked: false },
    { id: 2,   name: 'T-Shirts',               qty: 5, checked: false },
    { id: 3,   name: 'Badehosen',              qty: 2, checked: false },
    { id: 4,   name: 'Shorts',                 qty: 3, checked: false },
    { id: 5,   name: 'Unterwäsche',            qty: 7, checked: false },
    { id: 6,   name: 'Flip-Flops',             qty: 1, checked: false },
    { id: 7,   name: 'Sonnencreme SPF 50+',    qty: 1, checked: false },
    { id: 8,   name: 'Sonnenhut / Cap',        qty: 1, checked: false },
    { id: 9,   name: 'Zahnbürste & Zahnpasta',qty: 1, checked: false },
    { id: 10,  name: 'Ladekabel & Powerbank',  qty: 1, checked: false }
  ],
  marie: [
    { id: 101, name: 'Reisepass / Ausweis',    qty: 1, checked: false },
    { id: 102, name: 'Bikinis',                qty: 2, checked: false },
    { id: 103, name: 'Sommerkleider',          qty: 3, checked: false },
    { id: 104, name: 'Unterwäsche',            qty: 7, checked: false },
    { id: 105, name: 'Sonnencreme SPF 50+',    qty: 1, checked: false },
    { id: 106, name: 'Sonnenhut',              qty: 1, checked: false },
    { id: 107, name: 'After-Sun Lotion',       qty: 1, checked: false },
    { id: 108, name: 'Zahnbürste & Zahnpasta',qty: 1, checked: false },
    { id: 109, name: 'Flip-Flops & Sandalen',  qty: 1, checked: false },
    { id: 110, name: 'Schminke & Pflege',      qty: 1, checked: false }
  ],
  marvin: [
    { id: 201, name: 'Reisepass',                        qty: 1, checked: false },
    { id: 202, name: 'Badehose',                         qty: 2, checked: false },
    { id: 203, name: 'T-Shirts',                         qty: 5, checked: false },
    { id: 204, name: 'Schwimmflügel',                    qty: 1, checked: false },
    { id: 205, name: 'Sonnenhut mit Nackenschutz',       qty: 1, checked: false },
    { id: 206, name: 'Sonnencreme SPF 50+ (Kinder)',     qty: 1, checked: false },
    { id: 207, name: 'Sandspielzeug',                    qty: 1, checked: false },
    { id: 208, name: 'Lieblingskuscheltier',             qty: 1, checked: false },
    { id: 209, name: 'Snacks für den Flug',              qty: 1, checked: false },
    { id: 210, name: 'Windeln / Unterwäsche',            qty: 1, checked: false }
  ]
};

export const essentialItems = [
  { icon: '🛂', text: 'Reisepass eingepackt?' },
  { icon: '🧴', text: 'Sonnencreme SPF 50+?' },
  { icon: '🪥', text: 'Zahnbürste vergessen?' },
  { icon: '🔌', text: 'Ladekabel dabei?' },
  { icon: '💊', text: 'Reiseapotheke vollständig?' },
  { icon: '👒', text: 'Sonnenhut nicht vergessen!' },
  { icon: '💳', text: 'Kreditkarte & Bargeld?' },
  { icon: '📱', text: 'Handy aufgeladen?' },
  { icon: '🩴', text: 'Flip-Flops eingepackt?' },
  { icon: '🔋', text: 'Powerbank geladen?' },
  { icon: '🕶️', text: 'Sonnenbrille dabei?' },
  { icon: '🩹', text: 'Pflaster & Verbandzeug?' },
  { icon: '🌿', text: 'Insektenschutz eingepackt?' },
  { icon: '👙', text: 'Badekleidung vollständig?' },
  { icon: '📷', text: 'Kamera & Ladegerät?' },
  { icon: '🧸', text: 'Kuscheltier für Marvin?' },
  { icon: '🏊', text: 'Schwimmflügel eingepackt?' },
  { icon: '🌡️', text: 'Fieberthermometer dabei?' },
  { icon: '🧪', text: 'After-Sun Lotion?' },
  { icon: '🗺️', text: 'Offline-App geöffnet?' }
];
