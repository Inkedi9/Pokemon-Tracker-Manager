# Pokémon Tracker Manager

> Personal Pokémon Card Collection Manager

Application web personnelle permettant de gérer, suivre et analyser une collection de cartes Pokémon.

Le projet est construit autour d'une interface **Dark / Obsidian**, avec une approche sobre et orientée gestion de collection.

---

## ✨ M1 — Collection Management & Dashboard

Le **M1** constitue la première version fonctionnelle de l'application.

### 📊 Dashboard

Le dashboard permet de suivre rapidement l'état de la collection :

* Nombre total de cartes
* Nombre de cartes uniques
* Montant total investi
* Valeur estimée actuelle
* Profit estimé
* ROI
* Répartition par langue
* Répartition par rareté
* Carte la plus valorisée
* Ajouts récents
* Collection Insights

### 🗂️ Collection

La page Collection permet de gérer les cartes :

* Ajouter une carte
* Modifier une carte
* Supprimer une carte
* Rechercher une carte
* Filtrer par :

  * Langue
  * Rareté
  * État
  * Extension
* Trier par :

  * Plus récent
  * Nom
  * Valeur
  * Extension
  * Numéro
* Affichage responsive de la collection
* Compteur de résultats
* Filtres actifs
* Reset des filtres

### 💾 Persistance

Les données sont actuellement stockées localement avec :

* `localStorage`
* Données initiales dans `data/cards.json`
* `CollectionProvider` pour centraliser la gestion de la collection

Aucun compte ou backend n'est nécessaire pour cette version.

---

## 🎨 Interface

Design basé sur une esthétique :

* Dark / Obsidian
* Minimaliste
* Inspirée des interfaces de gestion et dashboards
* Responsive desktop / tablette / mobile
* Coins légèrement arrondis
* Bordures et effets subtils
* Icônes Lucide
* Composants shadcn/ui

---

## 🛠️ Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**
* **Recharts**
* **localStorage**

---

## 📁 Structure principale

```text
app/
├── page.tsx
└── collection/
    └── page.tsx

components/
├── collection/
│   ├── card-item.tsx
│   ├── collection-provider.tsx
│   └── ...
├── dashboard/
│   ├── collection-highlights.tsx
│   ├── language-distribution.tsx
│   └── rarity-distribution.tsx
├── layout/
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
└── ui/

data/
└── cards.json

lib/
└── collection-stats.ts

types/
└── card.ts
```

---

## 🃏 Modèle d'une carte

Chaque carte contient actuellement notamment :

```ts
type PokemonCard = {
  id: string;
  name: string;
  set: string;
  number: string;
  language: CardLanguage;
  rarity: string;
  quantity: number;
  condition: CardCondition;
  purchasePrice: number;
  estimatedValue: number;
  image?: string;
  location?: string;
  notes?: string;
};
```

---

## 🚀 Installation

```bash
git clone <repository-url>
cd pokemon-tracker-manager
npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

### Build production

```bash
npm run build
```

---

## 🗺️ Roadmap

### ✅ M0 — Foundation

* [x] Initial project
* [x] Layout
* [x] Navigation
* [x] Data model
* [x] Local storage
* [x] Collection provider

### ✅ M1 — Collection & Dashboard

* [x] Dashboard
* [x] Collection management
* [x] Add / Edit / Delete
* [x] Search
* [x] Filters
* [x] Sorting
* [x] Financial overview
* [x] Language statistics
* [x] Rarity statistics
* [x] Collection insights
* [x] Responsive UI
* [x] Footer

### 🔜 M2 — Collection Intelligence

* [ ] Analyse avancée de la collection
* [ ] Détection des doublons
* [ ] Statistiques par extension
* [ ] Analyse de valeur par extension
* [ ] Cartes les plus rentables
* [ ] Concentration de la valeur
* [ ] Statistiques avancées

### 🔮 Future

* [ ] Base de données
* [ ] API Pokémon
* [ ] Prix de marché
* [ ] Historique des prix
* [ ] Scanner / identification de cartes
* [ ] Import / export
* [ ] Gestion des classeurs et emplacements
* [ ] Authentification
* [ ] Synchronisation cloud

---

## 📌 Current Status

**Version : M1**

Le projet dispose maintenant d'une base fonctionnelle permettant de gérer une collection Pokémon et d'obtenir une première vision financière et statistique de celle-ci.

La prochaine étape est **M2 — Collection Intelligence**, avec davantage d'analyse et de statistiques avancées.
