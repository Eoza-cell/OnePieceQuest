# Replit Project Documentation - ONE PIECE: NOUVELLE ÈRE

## 📌 Vue d'Ensemble

Bot WhatsApp RPG One Piece développé en Node.js avec Baileys. Système complet de personnages, combat, progression et gestion d'énergie.

## 🏗️ Architecture du Projet

### Structure des Fichiers

```
├── index.js                    # Point d'entrée principal du bot
├── src/
│   ├── commands/
│   │   └── CommandHandler.js   # Gestionnaire de toutes les commandes (!menu, !profil, etc.)
│   ├── systems/
│   │   ├── PlayerManager.js    # Gestion CRUD des joueurs + XP/énergie
│   │   ├── RaceSystem.js       # 6 races avec bonus spécifiques
│   │   ├── ZoneSystem.js       # 4 zones avec restrictions de niveau
│   │   └── CombatSystem.js     # Calculs de combat tour par tour
│   └── utils/
│       └── logger.js           # Configuration Pino pour logs
├── data/
│   └── players.json            # Persistence des joueurs (créé automatiquement)
└── auth_info/                  # Auth WhatsApp multi-device (auto-généré)
```

## 🎮 Fonctionnalités Implémentées

### ✅ Phase MVP (Complétée)

1. **Connexion WhatsApp**
   - Authentification multi-devices avec Baileys
   - Gestion QR code personnalisée
   - Reconnexion automatique

2. **Système de Personnages**
   - 6 races jouables (Humain, Homme-poisson, Géant, Mink, Skypéien, Cyborg)
   - 6 attributs (Force, Vitesse, Endurance, Réflexe, Intelligence, Précision)
   - Bonus raciaux automatiques

3. **Système de Progression**
   - XP et niveaux (1-50+)
   - Entraînement RP validé pour améliorer attributs
   - Distribution de points à la montée de niveau

4. **Système d'Énergie**
   - Énergie max = Endurance × 10
   - Consommation par action
   - Régénération automatique (+10/minute)

5. **Système de Zones**
   - 4 zones: East Blue, Grand Line, Nouveau Monde, Eaux Interdites
   - Restrictions de niveau
   - Voyage entre zones

6. **Système de Combat**
   - Calcul de dégâts basé sur attributs
   - Esquive (Réflexe + Vitesse)
   - Coups critiques (Précision)
   - Réduction de dégâts (Endurance)

7. **Commandes**
   - 15+ commandes fonctionnelles
   - Aide contextuelle
   - Messages en français

### 🔮 Phase 2 (À Implémenter)

1. **Fruits du Démon**
   - Paramecia, Zoan, Logia
   - Système de maîtrise basé sur Intelligence
   - Quêtes d'obtention

2. **Système de Haki**
   - Observation (Kenbunshoku) - Niveau 10+
   - Armement (Busoshoku) - Niveau 15+
   - Royal (Haoshoku) - Niveau 20+ (rare)

3. **Styles de Combat**
   - 6 styles (Épéiste, Combattant, Tireur, etc.)
   - Techniques personnalisées
   - Bonus de style

4. **Équipages**
   - Création/recrutement
   - Rôles d'équipage
   - Quêtes collaboratives

5. **Économie Complète**
   - Métiers (Forgeron, Médecin, Cuisinier, etc.)
   - Commerce
   - Salaires hebdomadaires

6. **Réputation & Alignement**
   - Pirate, Marine, Révolutionnaire, Civil
   - Impact sur interactions
   - Primes de capture

## 🔧 Configuration Technique

### Dépendances Principales

```json
{
  "@whiskeysockets/baileys": "^6.7.20",  // WhatsApp Web API
  "@hapi/boom": "^10.0.1",                // Error handling
  "pino": "^10.0.0",                      // Logging
  "qrcode-terminal": "^0.12.0",           // QR display
  "node-cache": "^5.1.2",                 // In-memory cache
  "fs-extra": "^11.3.2",                  // File operations
  "moment": "^2.30.1"                     // Date/time
}
```

### Workflow Replit

- **Nom**: WhatsApp Bot
- **Commande**: `npm start`
- **Type**: Console (pas de webview)

### Variables d'Environnement

Aucune variable requise pour le moment. Les secrets pour futures intégrations (OpenAI, etc.) seront ajoutés en Phase 2.

## 📊 Base de Données

### Structure Player (JSON)

```javascript
{
  "phoneNumber": "1234567890@s.whatsapp.net",
  "name": "Luffy",
  "race": "Humain",
  "level": 1,
  "xp": 0,
  "attributes": {
    "force": 15,        // +5 bonus humain
    "vitesse": 5,
    "endurance": 10,
    "reflexe": 5,
    "intelligence": 10,
    "precision": 5
  },
  "maxEnergy": 100,     // endurance × 10
  "currentEnergy": 100,
  "berrys": 1000,
  "zone": "East Blue",
  "reputation": 0,
  "alignment": "Civil",
  "style": null,
  "inventory": [],
  "trainingCount": {
    "force": 0,
    "vitesse": 0,
    "intelligence": 0,
    "reflexe": 0
  },
  "createdAt": "2025-10-14 14:30:00",
  "lastEnergyRegen": 1728923400000
}
```

## 🐛 Problèmes Connus & Solutions

### Connection Failure (405)

**Symptôme**: Le bot ne se connecte pas à WhatsApp  
**Cause**: Environnement Replit, protocole WhatsApp, ou auth corrompue  
**Solution**:
1. Supprimer `auth_info/`
2. Redémarrer le workflow
3. Scanner le nouveau QR code

### QR Code pas visible

**Solution**: Les logs montrent le QR code. Regarder dans la console Replit.

## 📝 Conventions de Code

- **Style**: ES6+ avec CommonJS modules
- **Nommage**: camelCase pour variables/fonctions
- **Async/Await**: Utilisé partout (pas de callbacks)
- **Logs**: Console.log avec emojis pour clarté
- **Erreurs**: Try/catch avec messages en français

## 🎯 Commandes Utilisateur

| Commande | Description | Exemple |
|----------|-------------|---------|
| `!menu` | Menu principal | `!menu` |
| `!start` | Démarrer l'aventure | `!start` |
| `!creer [nom] [race]` | Créer personnage | `!creer Zoro Humain` |
| `!profil` | Voir son profil | `!profil` |
| `!stats` | Stats détaillées | `!stats` |
| `!races` | Liste des races | `!races` |
| `!zones` | Liste des zones | `!zones` |
| `!voyage [zone]` | Voyager | `!voyage Grand Line` |
| `!entrainement [attr]` | S'entraîner | `!entrainement force` |
| `!regles` | Règles du jeu | `!regles` |
| `!attributs` | Guide attributs | `!attributs` |

## 🔄 Récentes Modifications

### 2025-10-14
- ✅ Création complète du bot MVP
- ✅ Implémentation des 6 systèmes principaux
- ✅ 15+ commandes fonctionnelles
- ✅ Persistence JSON
- ✅ Gestion QR code moderne (sans deprecated option)
- ✅ Documentation complète

## 🚀 Prochaines Étapes

1. Résoudre problème de connexion WhatsApp
2. Tester toutes les commandes
3. Implémenter Fruits du Démon
4. Ajouter système Haki
5. Créer styles de combat
6. Développer système d'équipages
7. Migrer vers PostgreSQL pour scalabilité

## 💡 Notes Importantes

- **WhatsApp ToS**: Utilisation de l'API non officielle peut violer les CGU
- **Sauvegarde**: `data/players.json` doit être sauvegardé régulièrement
- **Sécurité**: Ne jamais commit `auth_info/` dans Git
- **Performance**: Régénération d'énergie calculée à la demande (pas de timer)

---

**Développeur**: Agent Replit  
**Date de création**: 14 octobre 2025  
**Version**: 1.0.0 MVP
