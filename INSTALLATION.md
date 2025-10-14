# 🚀 Guide d'Installation - ONE PIECE: NOUVELLE ÈRE

## 📋 Prérequis

- Node.js 20 ou supérieur
- Un numéro WhatsApp
- Accès internet stable

## 🔧 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd <nom-du-projet>
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le bot**
```bash
npm start
```

## 📱 Connexion à WhatsApp

### Première Connexion

1. **Lancer le bot** avec `npm start`
2. **Un QR code s'affichera** dans le terminal
3. **Ouvrir WhatsApp** sur votre téléphone
4. Aller dans **Paramètres > Appareils connectés > Connecter un appareil**
5. **Scanner le QR code** affiché dans le terminal
6. Attendre la confirmation: `✅ Connecté à WhatsApp!`

### Reconnexion

Après la première connexion, le bot se reconnectera automatiquement grâce aux fichiers d'authentification sauvegardés dans `auth_info/`.

## ⚠️ Résolution des Problèmes

### Erreur "Connection Failure (405)"

Cette erreur peut survenir pour plusieurs raisons:

**Solution 1: Supprimer l'authentification**
```bash
rm -rf auth_info/
npm start
```
Puis scannez à nouveau le QR code.

**Solution 2: Vérifier la connexion internet**
- Assurez-vous d'avoir une connexion stable
- Essayez de redémarrer le bot après quelques minutes

**Solution 3: Utiliser un VPN**
Dans certains cas, utiliser un VPN peut résoudre les problèmes de connexion.

### Le QR code n'apparaît pas

1. Vérifiez que le port 443 n'est pas bloqué
2. Supprimez le dossier `auth_info/`
3. Redémarrez le bot

### Le bot ne répond pas aux messages

1. Vérifiez que les messages commencent par `!`
2. Assurez-vous que le bot est bien connecté (`✅ Connecté à WhatsApp!`)
3. Vérifiez les logs pour voir les messages reçus

### Erreur "DisconnectReason.loggedOut"

Si vous voyez cette erreur, cela signifie que vous avez déconnecté le bot depuis WhatsApp:

1. Supprimez le dossier `auth_info/`
2. Redémarrez le bot
3. Scannez à nouveau le QR code

## 🔐 Sécurité

### Fichiers Importants

- **auth_info/**: Contient les informations d'authentification WhatsApp
  - ⚠️ Ne partagez JAMAIS ce dossier
  - ⚠️ Ajoutez-le à `.gitignore`

- **data/players.json**: Base de données des joueurs
  - 💾 Sauvegardez ce fichier régulièrement
  - 🔒 Gardez-le privé

### Bonnes Pratiques

1. Ne lancez qu'une seule instance du bot à la fois
2. Ne scannez pas le QR code sur plusieurs appareils
3. Sauvegardez régulièrement vos données
4. Gardez Node.js à jour

## 🌐 Déploiement

### Sur un Serveur

Pour faire tourner le bot 24/7:

**Avec PM2 (recommandé):**
```bash
npm install -g pm2
pm2 start index.js --name "one-piece-bot"
pm2 save
pm2 startup
```

**Avec Screen:**
```bash
screen -S whatsapp-bot
npm start
# Appuyez sur Ctrl+A puis D pour détacher
```

### Sur Replit

Le bot est déjà configuré pour Replit. Il suffit de:
1. Cliquer sur "Run"
2. Scanner le QR code dans la console
3. Le bot restera actif

## 📊 Vérification du Bon Fonctionnement

Une fois connecté, envoyez-vous (ou demandez à quelqu'un d'envoyer):

```
!menu
```

Si le bot répond avec le menu complet, tout fonctionne correctement! 🎉

## 🆘 Support

### Logs

Les logs sont affichés dans la console et montrent:
- Les connexions/déconnexions
- Les messages reçus
- Les erreurs

### Commandes de Débogage

Pour vérifier l'état du bot:
```bash
# Vérifier les processus Node.js
ps aux | grep node

# Voir les logs en temps réel (avec PM2)
pm2 logs one-piece-bot

# Redémarrer le bot (avec PM2)
pm2 restart one-piece-bot
```

## 🔄 Mise à Jour

Pour mettre à jour le bot:
```bash
git pull
npm install
npm start
```

---

**Note importante:** L'utilisation de bots WhatsApp non officiels peut violer les conditions d'utilisation de WhatsApp. Utilisez ce bot à vos propres risques et de manière responsable.
