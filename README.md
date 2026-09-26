> En developpement
> Actif...

# Pokémon Tracker Manager

> Personal Pokémon Card Collection Manager

Application web personnelle permettant de gérer, suivre et analyser une collection de cartes Pokémon.

Le projet est construit autour d'une interface **Dark / Obsidian**, avec une approche sobre et orientée gestion de collection.

L'objectif est de faire évoluer progressivement l'application d'un simple gestionnaire de collection vers un véritable outil de Collection Intelligence, capable d'analyser la collection, suivre sa valeur et faciliter l'ajout de nouvelles cartes grâce au scanner.

---

## ✨ M1 — Collection Management & Dashboard

Le **M1** constitue la première version fonctionnelle de l'application.

### 📊 Dashboard

Le dashboard permet de suivre rapidement l'état de la collection :

- Nombre total de cartes
- Nombre de cartes uniques
- Montant total investi
- Valeur estimée actuelle
- Profit estimé
- ROI
- Répartition par langue
- Répartition par rareté
- Carte la plus valorisée
- Ajouts récents
- Collection Insights

### 🗂️ Collection Management

La page Collection permet de gérer l'ensemble des cartes :

#### Gestion

- Ajouter une carte
- Modifier une carte
- Supprimer une carte
- Suppression multiple
- Modification multiple
- Recherche
- Affichage responsive
- Sélection multiple

#### Filtres

- Langue
- Rareté
- État
- Extension
- Valeur
- Prix
- Données manquantes
- Critères combinables

#### Tri

- Plus récent
- Nom
- Valeur
- Extension
- Numéro
- Prix
- Rentabilité

#### Vues

- Vues enregistrées
- Création de vues personnalisées
- Modification de vues
- Suppression de vues
- Activation rapide des vues sauvegardées

#### Workflow

- Compteur de résultats
- Filtres actifs
- Reset des filtres
- Actions bulk
- Feedback utilisateur
- Toasts de confirmation
- États de sélection
- Navigation fluide

## 🧠 Collection Intelligence

Le projet possède désormais une couche d'analyse dédiée à l'intelligence de collection.

### 📈 Analytics

Analyse de la collection selon différents axes :

- Analyse par extension
- Répartition de la valeur
- Analyse de rentabilité
- Concentration de la valeur
- Statistiques avancées
- Répartition des cartes
- Analyse des données de collection

### ❤️ Collection Health

Indicateurs permettant d'identifier les points faibles de la collection :

- Données manquantes
- Informations incomplètes
- Qualité des données
- État général de la collection
- Indicateurs de complétude

### 🎯 Collection Goals

Gestion d'objectifs de collection :

- Création d'objectifs
- Suivi de progression
- Indicateurs de progression
- Analyse de l'avancement

### 🤖 Smart Recommendations

Le système peut générer des recommandations à partir des données présentes dans la collection :

- Opportunités d'amélioration
- Données manquantes
- Concentration excessive
- Axes d'optimisation
- Suggestions basées sur l'état actuel de la collection

### 💰 Market & Pricing

Le système de pricing permet maintenant de distinguer la valeur d'achat de la valeur de marché.

#### Prix de marché

Chaque carte peut contenir :

- Prix de marché
- Source du prix
- Date de mise à jour
- Historique des prix

Sources supportées :

- Manuel
- Cardmarket
- TCGPlayer
- eBay
- Autre

### 📉 Price History

L'application conserve l'évolution des prix lorsqu'une valeur de marché est modifiée.

L'historique permet notamment de suivre :

- Prix initial
- Prix actuel
- Variation globale
- Variation depuis le dernier relevé
- Source du prix
- Date du relevé

Les doublons de snapshots à prix identique sont évités.

### 📊 Profitability

L'application calcule notamment :

- Valeur d'investissement
- Valeur de marché
- Profit non réalisé
- ROI

Les calculs prennent également en compte la quantité possédée.

### 🔎 Duplicate Detection

Un système de détection des doublons permet d'identifier les cartes potentiellement identiques.

Fonctionnalités :

- Détection des doublons
- Groupement des cartes similaires
- Prévisualisation des doublons
- Fusion de cartes
- Ignorer un doublon
- Gestion des doublons ignorés

### 📦 Import / Export

> Prévu pour M7

L'import/export n'a volontairement pas été intégré dans M4 afin de conserver un périmètre cohérent pour le workflow de collection.

Prévu :

- Import de collection
- Export de collection
- Formats structurés
- Sauvegarde/restauration des données

### 📷 Scanner & Card Recognition

Le M6 introduit un système de scanner permettant de faciliter l'identification et l'ajout de cartes Pokémon.

Le scanner est actuellement conçu autour d'une approche locale et progressive :

Image
↓
Validation
↓
OCR
↓
Normalisation
↓
Matching
↓
Ranking
↓
Auto-fill
↓
Add Card
↓
Collection

### 📸 Image Capture & Upload

Le scanner permet :

- Capture d'une image
- Upload d'une image
- Prévisualisation
- Suppression de l'image
- Validation de l'image

Contraintes actuelles :

- Taille maximale : 10 MB
- Largeur minimale : 300 px
- Hauteur minimale : 300 px

Les URLs temporaires blob: sont également nettoyées afin d'éviter de conserver inutilement les ressources en mémoire.

### 🔍 OCR / Recognition Engine

La reconnaissance utilise Tesseract.js.

Le moteur permet actuellement d'extraire :

- Nom
- Numéro
- Texte visible
- Informations exploitables pour le matching

Langues prévues/supportées par le moteur :

- Français
- Anglais
- Japonais
- Coréen

Le moteur actuel utilise principalement l'anglais comme langue de reconnaissance par défaut. La détection/mapping automatique de langue pourra être approfondie ultérieurement.

### 🧩 Matching Engine

Le texte OCR est comparé aux cartes présentes dans la collection.

Le moteur utilise notamment :

- Normalisation du texte
- Suppression des accents
- Comparaison des noms
- Comparaison des numéros
- Comparaison des extensions
- Distance de Levenshtein
- Similarité de chaînes
- Correction de certaines erreurs OCR
- Détection des numéros de cartes

Exemples de formats détectés :

- 25/102
- SV123/198

### 🎯 Candidate Ranking & Confidence

Les cartes candidates sont classées selon un score de correspondance.

Chaque résultat possède :

- Score
- Rang
- Niveau de confiance
- Écart avec le candidat suivant
- Raisons de la correspondance

Niveaux de confiance :

- Élevée
- Moyenne
- Faible

Le système prend notamment en compte :

- Correspondance du nom
- Correspondance du numéro
- Correspondance de l'extension
- Similarité du texte
- Ambiguïté entre les candidats

### ⚡ Auto-fill

Lorsqu'une correspondance est sélectionnée, les informations connues peuvent être automatiquement injectées dans le formulaire d'ajout :

- Nom
- Extension
- Numéro
- Langue
- Rareté

L'utilisateur conserve la possibilité de modifier les informations avant l'ajout.

### ➕ Scanner → Collection

Le scanner est directement intégré au workflow de collection.

Flux actuel :

Scanner
↓
Sélection / capture de l'image
↓
Validation
↓
Reconnaissance OCR
↓
Recherche de correspondances
↓
Sélection d'un candidat
↓
Préremplissage
↓
Add Card Dialog
↓
Validation utilisateur
↓
Ajout dans CollectionProvider
↓
Toast de confirmation
↓
Navigation vers /collection

Le scanner ne contourne donc pas le système de collection existant : il utilise le même workflow d'ajout que l'interface classique.

### 💾 Persistance

Les données sont actuellement stockées localement avec :

- `localStorage`
- Données initiales dans `data/cards.json`
- `CollectionProvider` pour centraliser la gestion de la collection

Aucun compte ou backend n'est nécessaire pour cette version.

---

## 🎨 Interface

Design basé sur une esthétique :

- Dark / Obsidian
- Minimaliste
- Inspirée des interfaces de gestion et dashboards
- Responsive desktop / tablette / mobile
- Coins légèrement arrondis
- Bordures et effets subtils
- Icônes Lucide
- Composants shadcn/ui

---

## 🛠️ Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React**
- **Recharts**
- **localStorage**

### Scanner

- Tesseract.js
- OCR
- Image validation
- Matching engine
- Fuzzy matching
- Candidate ranking

---

## 📁 Structure principale

```text
app/
├── page.tsx
└── collection/
│   └── page.tsx
│
components/
├── collection/
│   ├── card-item.tsx
│   ├── collection-provider.tsx
│   └── ...
│
├── dashboard/
│   ├── collection-highlights.tsx
│   ├── language-distribution.tsx
│   └── rarity-distribution.tsx
│
├── scanner/
│   ├── scanner-page.tsx
│   └── ...
│
├── layout/
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── footer.tsx
│
└── ui/
│
data/
└── cards.json
│
lib/
└── collection-stats.ts
├── pricing.ts
├── price-history.ts
└── recognition/
│   ├── card-recognition.ts
│   ├── card-matching.ts
│   └── card-autofill.ts
│
types/
└── card.ts
```

---

## 🃏 Modèle d'une carte

Le modèle actuel contient notamment les informations suivantes :

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
  marketPrice?: number;
  priceSource?: PriceSource;
  priceUpdatedAt?: string;
  priceHistory?: PriceSnapshot[];
  image?: string;
  location?: string;
  notes?: string;
};
```

## Price History

```ts
type PriceSnapshot = {
  price: number;
  source?: PriceSource;
  recordedAt: string;
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

### Vérification du projet

```bash
npm run lint
```

### Build production

```bash
npm run build
```

---

## 🗺️ Roadmap

### 🔜 🔮 Future

- [ ] Base de données
- [ ] API Pokémon
- [ ] Prix de marché
- [ ] Historique des prix
- [ ] Scanner / identification de cartes
- [ ] Import / export
- [ ] Gestion des classeurs et emplacements
- [ ] Authentification
- [ ] Synchronisation cloud

ROADMAP global - [ROADMAP](./ROADMAP.md)

---

## 📌 Current Status

**Version : M4**

Le projet dispose maintenant d'une base fonctionnelle permettant de gérer une collection Pokémon et d'obtenir une première vision financière et statistique de celle-ci.

La prochaine étape est **M5 — Market / Pricing**, avec davantage d'analyse et de statistiques avancées.
