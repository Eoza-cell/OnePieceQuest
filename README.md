# 🏴‍☠️ ONE PIECE: NOUVELLE ÈRE 🏴‍☠️

Bot WhatsApp RPG complet basé sur l'univers de One Piece, développé avec Node.js et Baileys.

## 📋 Description

Un système RPG sophistiqué pour WhatsApp permettant aux joueurs de créer des personnages, s'entraîner, combattre, et progresser dans l'univers de One Piece.

## ✨ Fonctionnalités

### 🎮 Système de Jeu
- **6 Attributs**: Force, Vitesse, Endurance, Réflexe, Intelligence, Précision
- **6 Races Jouables**: Humain, Homme-poisson, Géant, Mink, Skypéien, Cyborg
- **Système de Niveaux**: Progression par XP avec déblocages
- **Gestion d'Énergie**: Consommation et régénération automatique
- **Zones Multiples**: East Blue, Grand Line, Nouveau Monde, Eaux Interdites

### ⚔️ Système de Combat
- Combat tour par tour avec calculs de dégâts
- Esquive basée sur les réflexes et la vitesse
- Coups critiques basés sur la précision
- Réduction de dégâts basée sur l'endurance

### 🏋️ Progression
- Entraînement RP pour améliorer les attributs
- Système d'XP et de montée de niveau
- Points d'attributs à distribuer
- Voyage entre les zones avec restrictions

## 🎯 Commandes Disponibles

### Général
- `!menu` - Affiche le menu principal
- `!aide` - Aide détaillée
- `!regles` - Règles du jeu
- `!attributs` - Explication des attributs

### Personnage
- `!start` - Démarrer l'aventure
- `!creer [nom] [race]` - Créer un personnage
- `!profil` - Voir son profil
- `!stats` - Statistiques détaillées

### Informations
- `!races` - Liste des races
- `!zones` - Liste des zones

### Actions
- `!voyage [zone]` - Voyager vers une zone
- `!entrainement [attribut]` - S'entraîner (force, vitesse, intelligence, reflexe)

## 🚀 Installation

```bash
npm install
```

## ▶️ Démarrage

```bash
node index.js
```

Lors du premier lancement, un QR code s'affichera. Scannez-le avec WhatsApp pour connecter le bot.

## 📦 Dépendances

- `@whiskeysockets/baileys` - API WhatsApp Web
- `@hapi/boom` - Gestion des erreurs
- `pino` - Logging
- `qrcode-terminal` - Affichage QR code
- `node-cache` - Cache en mémoire
- `fs-extra` - Opérations fichiers
- `moment` - Gestion dates

## 📁 Structure

```
.
├── index.js                  # Point d'entrée du bot
├── src/
│   ├── commands/
│   │   └── CommandHandler.js # Gestionnaire de commandes
│   ├── systems/
│   │   ├── PlayerManager.js  # Gestion des joueurs
│   │   ├── RaceSystem.js     # Système de races
│   │   ├── ZoneSystem.js     # Système de zones
│   │   └── CombatSystem.js   # Système de combat
│   └── utils/
│       └── logger.js         # Utilitaire de logging
├── data/
│   └── players.json          # Base de données joueurs
└── auth_info/                # Informations d'authentification WhatsApp
```

## 🎲 Système de Progression

### Attributs et Entraînement
- **Force**: 3 RP → +1 Force
- **Vitesse**: 5 RP → +1 Vitesse
- **Intelligence**: 3 RP → +1 Intelligence
- **Réflexe**: 2 RP → +1 Réflexe

### Niveaux
- Niveau 1 → 2: 100 XP
- Niveau 2 → 5: +200 XP par niveau
- Niveau 5 → 10: +300 XP par niveau
- Niveau 10+: progression croissante

### Zones
- **East Blue** (Niv. 1-10): Zone d'apprentissage
- **Grand Line** (Niv. 10-25): Dangers climatiques
- **Nouveau Monde** (Niv. 25-50): Pirates puissants
- **Eaux Interdites** (Niv. 50+): Légendaires

## ⚠️ Notes

- L'utilisation de ce bot peut violer les conditions d'utilisation de WhatsApp
- Utilisez de manière responsable
- Ne spammez pas
- Le bot utilise l'API non officielle de WhatsApp Web

## 🔮 Fonctionnalités Futures

- Fruits du Démon (Paramecia, Zoan, Logia)
- Système de Haki (Observation, Armement, Royal)
- Styles de combat avec techniques spéciales
- Système d'équipages
- Économie et métiers
- Système de réputation et alignement
- Événements mondiaux et boss

## 📄 Licence

Ce projet est à but éducatif uniquement.

---

_« Dans un monde où les mers n'ont pas de fin, seule la volonté forge les légendes. »_
