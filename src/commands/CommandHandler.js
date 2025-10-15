
import PlayerManager from '../systems/PlayerManager.js';
import RaceSystem from '../systems/RaceSystem.js';
import ZoneSystem from '../systems/ZoneSystem.js';
import CombatSystem from '../systems/CombatSystem.js';
import DevilFruitSystem from '../systems/DevilFruitSystem.js';
import HakiSystem from '../systems/HakiSystem.js';
import CrewSystem from '../systems/CrewSystem.js';

class CommandHandler {
    constructor() {
        this.prefix = '!';
        this.commands = this.initializeCommands();
    }

    initializeCommands() {
        return {
            'menu': this.handleMenu.bind(this),
            'start': this.handleStart.bind(this),
            'creer': this.handleCreate.bind(this),
            'profil': this.handleProfile.bind(this),
            'stats': this.handleStats.bind(this),
            'races': this.handleRaces.bind(this),
            'zones': this.handleZones.bind(this),
            'voyage': this.handleTravel.bind(this),
            'entrainement': this.handleTraining.bind(this),
            'combat': this.handleCombat.bind(this),
            'aide': this.handleHelp.bind(this),
            'regles': this.handleRules.bind(this),
            'attributs': this.handleAttributes.bind(this),
            'fruits': this.handleFruits.bind(this),
            'manger': this.handleEatFruit.bind(this),
            'haki': this.handleHaki.bind(this),
            'debloquer': this.handleUnlockHaki.bind(this),
            'equipage': this.handleCrew.bind(this),
            'creerequipage': this.handleCreateCrew.bind(this),
            'rejoindre': this.handleJoinCrew.bind(this),
            'quitter': this.handleLeaveCrew.bind(this)
        };
    }

    async handleCommand(client, message) {
        const jid = message.key.remoteJid;
        
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text ||
                     message.message?.imageMessage?.caption ||
                     message.message?.videoMessage?.caption || '';

        console.log(`📝 Texte extrait: "${text}" de ${jid}`);

        if (!text.startsWith(this.prefix)) return;

        const args = text.slice(this.prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        console.log(`🎯 Commande détectée: ${commandName}`);

        if (!this.commands[commandName]) {
            console.log(`❌ Commande inconnue: ${commandName}`);
            return;
        }

        // ID du joueur = participant si groupe, sinon jid direct
        const senderId = message.key.participant || jid;
        
        // RÉPONDRE DANS LE GROUPE (jid) mais avec l'ID du joueur (senderId)
        const replyTo = jid; // ✅ Toujours répondre où le message a été envoyé
        
        await PlayerManager.regenerateEnergy(senderId);

        try {
            await this.commands[commandName](client, senderId, args, replyTo);
            console.log(`✅ Commande ${commandName} - Joueur: ${senderId} - Réponse: ${replyTo}`);
        } catch (error) {
            console.error(`❌ Erreur commande ${commandName}:`, error);
            await CommandHandler.sendMessage(client, replyTo, '❌ Une erreur est survenue. Réessayez plus tard.');
        }
    }

    async handleMenu(client, sender, args, replyTo) {
        const menuText = `🏴‍☠️ *ONE PIECE: NOUVELLE ÈRE* 🏴‍☠️

*═══ COMMANDES PRINCIPALES ═══*

📋 *Général*
${this.prefix}menu - Affiche ce menu
${this.prefix}aide - Aide détaillée
${this.prefix}regles - Règles du jeu

👤 *Personnage*
${this.prefix}start - Démarrer l'aventure
${this.prefix}creer [nom] [race] - Créer personnage
${this.prefix}profil - Voir son profil
${this.prefix}stats - Statistiques

🍎 *Fruits du Démon*
${this.prefix}fruits - Liste des fruits
${this.prefix}manger [fruit] - Manger un fruit

⚡ *Haki*
${this.prefix}haki - Types de Haki
${this.prefix}debloquer [type] - Débloquer Haki

⚓ *Équipages*
${this.prefix}equipage - Voir son équipage
${this.prefix}creerequipage [nom] - Créer équipage
${this.prefix}rejoindre [id] - Rejoindre équipage
${this.prefix}quitter - Quitter équipage

🌍 *Actions*
${this.prefix}voyage [zone] - Voyager
${this.prefix}entrainement [attribut] - S'entraîner
${this.prefix}combat [@joueur] - Combattre

📚 *Infos*
${this.prefix}races - Races disponibles
${this.prefix}zones - Zones du monde
${this.prefix}attributs - Guide attributs

*═══════════════════════*

_La volonté forge les légendes!_ 🏴‍☠️`;

        await CommandHandler.sendMessage(client, replyTo, menuText);
    }

    async handleStart(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (player) {
            await CommandHandler.sendMessage(client, replyTo, `⚓ Vous avez déjà un personnage!\n\nUtilisez ${this.prefix}profil pour voir vos stats.`);
            return;
        }

        const welcomeText = `🏴‍☠️ *BIENVENUE DANS ONE PIECE: NOUVELLE ÈRE* 🏴‍☠️

Préparez-vous à vivre une aventure épique dans l'univers de One Piece!

*═══ CRÉATION DE PERSONNAGE ═══*

Pour créer votre personnage, utilisez:
${this.prefix}creer [nom] [race]

*Exemple:*
${this.prefix}creer Luffy Humain

*═══ RACES DISPONIBLES ═══*

${RaceSystem.getRacesList()}

*═══════════════════════*

Choisissez votre race avec soin, elle influencera votre aventure!`;

        await CommandHandler.sendMessage(client, replyTo, welcomeText);
    }

    async handleCreate(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (player) {
            await CommandHandler.sendMessage(client, replyTo, '⚓ Vous avez déjà un personnage!');
            return;
        }

        if (args.length < 2) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}creer [nom] [race]\n\nExemple: ${this.prefix}creer Luffy Humain\n\nUtilisez ${this.prefix}races pour voir les races disponibles.`);
            return;
        }

        const name = args[0];
        const raceName = args.slice(1).join(' ');
        const race = RaceSystem.getRace(raceName);

        if (!race) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Race inconnue: ${raceName}\n\nUtilisez ${this.prefix}races pour voir les races disponibles.`);
            return;
        }

        const newPlayer = await PlayerManager.createPlayer(sender, name, raceName);
        newPlayer.attributes = RaceSystem.applyRaceBonus(newPlayer.attributes, raceName);
        await PlayerManager.updatePlayer(sender, newPlayer);

        const creationText = `🎉 *PERSONNAGE CRÉÉ AVEC SUCCÈS!* 🎉

${race.emoji} *${name}* - ${raceName}

*═══ VOS ATTRIBUTS ═══*
⚡ Force: ${newPlayer.attributes.force}
💨 Vitesse: ${newPlayer.attributes.vitesse}
🛡️ Endurance: ${newPlayer.attributes.endurance}
👁️ Réflexe: ${newPlayer.attributes.reflexe}
🧠 Intelligence: ${newPlayer.attributes.intelligence}
🎯 Précision: ${newPlayer.attributes.precision}

*═══ STATISTIQUES ═══*
📊 Niveau: ${newPlayer.level}
⭐ XP: ${newPlayer.xp}/100
⚡ Énergie: ${newPlayer.currentEnergy}/${newPlayer.maxEnergy}
💰 Berrys: ${newPlayer.berrys}
🌊 Zone: ${newPlayer.zone}

*═══════════════════════*

Votre aventure commence maintenant!
Utilisez ${this.prefix}menu pour voir toutes les commandes disponibles.`;

        await CommandHandler.sendMessage(client, replyTo, creationText);
    }

    async handleProfile(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!\n\nUtilisez ${this.prefix}start pour commencer.`);
            return;
        }

        const race = RaceSystem.getRace(player.race);
        const xpNeeded = PlayerManager.getXPForLevel(player.level + 1);
        const zone = ZoneSystem.getZone(player.zone);

        const profileText = `⚓ *PROFIL DE ${player.name.toUpperCase()}* ⚓

${race.emoji} *Race:* ${player.race}
🎭 *Alignement:* ${player.alignment}

*═══ NIVEAU & PROGRESSION ═══*
📊 Niveau: ${player.level}
⭐ XP: ${player.xp}/${xpNeeded}
📈 Progression: ${Math.floor((player.xp / xpNeeded) * 100)}%

*═══ ATTRIBUTS ═══*
⚡ Force: ${player.attributes.force}
💨 Vitesse: ${player.attributes.vitesse} - ${CombatSystem.getSpeedDescription(player.attributes.vitesse)}
🛡️ Endurance: ${player.attributes.endurance}
👁️ Réflexe: ${player.attributes.reflexe} (${CombatSystem.getReactionTime(player.attributes.reflexe)}s)
🧠 Intelligence: ${player.attributes.intelligence}
🎯 Précision: ${player.attributes.precision}

*═══ RESSOURCES ═══*
⚡ Énergie: ${player.currentEnergy}/${player.maxEnergy}
💰 Berrys: ${player.berrys.toLocaleString()}
⭐ Réputation: ${player.reputation}

*═══ LOCALISATION ═══*
${zone.emoji} ${player.zone}

*═══════════════════════*

Utilisez ${this.prefix}stats pour plus de détails!`;

        await CommandHandler.sendMessage(client, replyTo, profileText);
    }

    async handleStats(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!`);
            return;
        }

        const physicalDamage = player.attributes.force * 2;
        const damageReduction = player.attributes.endurance * 0.1;
        const critChance = player.attributes.precision / 2;

        const statsText = `📊 *STATISTIQUES DE ${player.name.toUpperCase()}* 📊

*═══ PUISSANCE DE COMBAT ═══*
💪 Dégâts physiques: +${Math.floor(physicalDamage)}
🛡️ Réduction dégâts: -${Math.floor(damageReduction)}%
💥 Chance critique: ${critChance.toFixed(1)}%
🎯 Bonus précision: +${Math.floor(player.attributes.precision * 0.5)}

*═══ CAPACITÉS ═══*
💨 Vitesse déplacement: ${player.attributes.vitesse} m/s
⚡ Temps de réaction: ${CombatSystem.getReactionTime(player.attributes.reflexe)}s
🧠 Maîtrise technique: +${player.attributes.intelligence}%
🏋️ Capacité portage: ${player.attributes.force * 20} kg

*═══ ENTRAÎNEMENT ═══*
⚡ Force: ${player.trainingCount.force}/3 RP
💨 Vitesse: ${player.trainingCount.vitesse}/5 RP
🧠 Intelligence: ${player.trainingCount.intelligence}/3 RP
👁️ Réflexe: ${player.trainingCount.reflexe}/2 RP

*═══════════════════════*

Continuez à vous entraîner pour devenir plus fort!`;

        await CommandHandler.sendMessage(client, replyTo, statsText);
    }

    async handleRaces(client, sender, args, replyTo) {
        const racesText = `👥 *RACES JOUABLES* 👥

${RaceSystem.getRacesList()}

*═══════════════════════*

Pour créer un personnage:
${this.prefix}creer [nom] [race]

Exemple: ${this.prefix}creer Zoro Humain`;

        await CommandHandler.sendMessage(client, replyTo, racesText);
    }

    async handleZones(client, sender, args, replyTo) {
        const zonesText = `🗺️ *ZONES DU MONDE* 🗺️



    async handleFruits(client, sender, args, replyTo) {
        const fruitsText = `🍎 *FRUITS DU DÉMON* 🍎\n\n${DevilFruitSystem.getFruitsList()}\n*═══════════════════════*\n\nPour manger un fruit:\n${this.prefix}manger [nom du fruit]\n\nExemple: ${this.prefix}manger Gomu Gomu no Mi`;
        await CommandHandler.sendMessage(client, replyTo, fruitsText);
    }

    async handleEatFruit(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);
        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage avec ${this.prefix}start`);
            return;
        }

        if (player.devilFruit) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous avez déjà mangé le ${player.devilFruit}!`);
            return;
        }

        const fruitName = args.join(' ');
        const fruit = DevilFruitSystem.getFruit(fruitName);

        if (!fruit) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Fruit inconnu! Utilisez ${this.prefix}fruits pour voir la liste.`);
            return;
        }

        await PlayerManager.updatePlayer(sender, { 
            devilFruit: fruitName,
            devilFruitMastery: 0 
        });

        const updatedPlayer = PlayerManager.getPlayer(sender);
        Object.keys(fruit.masteryBonus).forEach(attr => {
            updatedPlayer.attributes[attr] += fruit.masteryBonus[attr];
        });
        await PlayerManager.updatePlayer(sender, updatedPlayer);

        const eatText = `🍎 *FRUIT DU DÉMON MANGÉ!* 🍎\n\n${fruit.emoji} *${fruitName}*\n${fruit.description}\n\n*Type:* ${fruit.type}\n*Pouvoir:* ${fruit.power}/100\n\n*Capacités:*\n${fruit.abilities.map(a => `• ${a}`).join('\n')}\n\n*Faiblesses:*\n${fruit.weakness}\n\n*Bonus Maîtrise:*\n${Object.entries(fruit.masteryBonus).map(([k,v]) => `+${v} ${k}`).join(', ')}\n\n⚠️ Vous ne pouvez plus nager!`;

        await CommandHandler.sendMessage(client, replyTo, eatText);
    }

    async handleHaki(client, sender, args, replyTo) {
        const hakiText = `⚡ *SYSTÈME HAKI* ⚡\n\n${HakiSystem.getHakiList()}\n*═══════════════════════*\n\nPour débloquer un Haki:\n${this.prefix}debloquer [type]\n\nTypes: kenbunshoku, busoshoku, haoshoku`;
        await CommandHandler.sendMessage(client, replyTo, hakiText);
    }

    async handleUnlockHaki(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);
        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
            return;
        }

        const hakiType = args[0]?.toLowerCase();
        const hakiKey = hakiType === 'kenbunshoku' ? 'Kenbunshoku' : 
                       hakiType === 'busoshoku' ? 'Busoshoku' : 
                       hakiType === 'haoshoku' ? 'Haoshoku' : null;

        if (!hakiKey) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Type invalide! Utilisez: kenbunshoku, busoshoku ou haoshoku`);
            return;
        }

        if (player.haki[hakiType]?.unlocked) {
            await CommandHandler.sendMessage(client, replyTo, `⚠️ Vous avez déjà débloqué ce Haki!`);
            return;
        }

        const canUnlock = HakiSystem.canUnlock(hakiKey, player.level);
        if (!canUnlock.can) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${canUnlock.reason}`);
            return;
        }

        player.haki[hakiType] = { unlocked: true, level: 1 };
        await PlayerManager.updatePlayer(sender, player);

        const haki = HakiSystem.hakiTypes[hakiKey];
        await CommandHandler.sendMessage(client, replyTo, `🎉 *HAKI DÉBLOQUÉ!* 🎉\n\n${haki.emoji} ${haki.name}\n\n${haki.description}\n\n*Bonus:*\n${Object.entries(haki.bonus).map(([k,v]) => `+${v} ${k}`).join('\n')}`);
    }

    async handleCrew(client, sender, args, replyTo) {
        const crew = CrewSystem.getPlayerCrew(sender);
        if (!crew) {
            await CommandHandler.sendMessage(client, replyTo, `⚓ Vous n'êtes dans aucun équipage!\n\n${this.prefix}creerequipage [nom] - Créer un équipage\n${this.prefix}rejoindre [id] - Rejoindre un équipage`);
            return;
        }

        const captain = PlayerManager.getPlayer(crew.captain);
        const crewText = `⚓ *ÉQUIPAGE: ${crew.name.toUpperCase()}* ⚓\n\n👑 Capitaine: ${captain.name}\n👥 Membres: ${crew.members.length}\n💰 Trésor: ${crew.treasury.toLocaleString()} ฿\n⭐ Réputation: ${crew.reputation}\n\n*Membres:*\n${crew.members.map(id => {
            const p = PlayerManager.getPlayer(id);
            return `• ${p.name} (Niv.${p.level})`;
        }).join('\n')}`;

        await CommandHandler.sendMessage(client, replyTo, crewText);
    }

    async handleCreateCrew(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);
        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
            return;
        }

        if (args.length === 0) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}creerequipage [nom]`);
            return;
        }

        const crewName = args.join(' ');
        const result = CrewSystem.createCrew(sender, crewName);

        if (!result.success) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
            return;
        }

        await CommandHandler.sendMessage(client, replyTo, `🎉 *ÉQUIPAGE CRÉÉ!* 🎉\n\n⚓ ${crewName}\n👑 Capitaine: ${player.name}\n\nID: ${result.crew.id}\n\nPartagez cet ID pour recruter!`);
    }

    async handleJoinCrew(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);
        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
            return;
        }

        if (args.length === 0) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}rejoindre [id équipage]`);
            return;
        }

        const result = CrewSystem.joinCrew(args[0], sender);
        if (!result.success) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
            return;
        }

        await CommandHandler.sendMessage(client, replyTo, `🎉 Vous avez rejoint l'équipage!`);
    }

    async handleLeaveCrew(client, sender, args, replyTo) {
        const result = CrewSystem.leaveCrew(sender);
        if (!result.success) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
            return;
        }

        if (result.disbanded) {
            await CommandHandler.sendMessage(client, replyTo, `⚓ Équipage dissous (capitaine parti)`);
        } else {
            await CommandHandler.sendMessage(client, replyTo, `👋 Vous avez quitté l'équipage`);
        }
    }

${ZoneSystem.getZonesList()}

*═══════════════════════*

Pour voyager vers une zone:
${this.prefix}voyage [zone]

Exemple: ${this.prefix}voyage Grand Line`;

        await CommandHandler.sendMessage(client, replyTo, zonesText);
    }

    async handleTravel(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!`);
            return;
        }

        if (args.length === 0) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}voyage [zone]\n\nUtilisez ${this.prefix}zones pour voir les zones disponibles.`);
            return;
        }

        const zoneName = args.join(' ');
        const zone = ZoneSystem.getZone(zoneName);

        if (!zone) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Zone inconnue: ${zoneName}`);
            return;
        }

        const access = ZoneSystem.canAccessZone(player.level, zoneName);
        if (!access.access) {
            await CommandHandler.sendMessage(client, replyTo, `⚠️ Accès refusé!\n\n${access.reason}`);
            return;
        }

        await PlayerManager.updatePlayer(sender, { zone: zoneName });

        await CommandHandler.sendMessage(client, replyTo, `🌊 *VOYAGE RÉUSSI!* 🌊\n\nVous êtes maintenant dans: ${zone.emoji} *${zoneName}*\n\n${zone.description}\n\n⚠️ Dangers: ${zone.dangers}\n🎁 Récompenses: ${zone.rewards}`);
    }

    async handleTraining(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!`);
            return;
        }

        if (args.length === 0) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}entrainement [attribut]\n\nAttributs disponibles: force, vitesse, intelligence, reflexe\n\nExemple: ${this.prefix}entrainement force`);
            return;
        }

        const attributeType = args[0].toLowerCase();
        const validAttributes = ['force', 'vitesse', 'intelligence', 'reflexe'];

        if (!validAttributes.includes(attributeType)) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Attribut invalide!\n\nAttributs disponibles: ${validAttributes.join(', ')}`);
            return;
        }

        const energyCost = 10;
        if (!await PlayerManager.consumeEnergy(sender, energyCost)) {
            await CommandHandler.sendMessage(client, replyTo, `⚠️ Énergie insuffisante!\n\nVous avez besoin de ${energyCost} énergie.\nÉnergie actuelle: ${player.currentEnergy}/${player.maxEnergy}\n\n💤 L'énergie se régénère de 10 par minute.`);
            return;
        }

        const xpResult = await PlayerManager.addXP(sender, 50);
        const trainingResult = await PlayerManager.incrementTraining(sender, attributeType);

        let resultText = `🏋️ *ENTRAÎNEMENT TERMINÉ!* 🏋️\n\n`;
        resultText += `Vous vous êtes entraîné en ${attributeType}!\n`;
        resultText += `⭐ +50 XP\n`;
        resultText += `⚡ -${energyCost} énergie\n\n`;

        if (trainingResult.leveledUp) {
            resultText += `🎉 *AMÉLIORATION!*\n`;
            resultText += `${attributeType.toUpperCase()}: ${trainingResult.newValue - 1} → ${trainingResult.newValue}\n\n`;
        } else {
            resultText += `📈 Progression: ${trainingResult.current}/${trainingResult.needed} RP\n\n`;
        }

        if (xpResult.leveledUp) {
            resultText += `🌟 *NIVEAU SUPÉRIEUR!*\n`;
            resultText += `Niveau ${xpResult.newLevel - 1} → ${xpResult.newLevel}\n`;
            resultText += `+${xpResult.pointsToDistribute} points d'attributs disponibles!\n\n`;
        }

        const updatedPlayer = PlayerManager.getPlayer(sender);
        resultText += `💪 État actuel:\n`;
        resultText += `⚡ Énergie: ${updatedPlayer.currentEnergy}/${updatedPlayer.maxEnergy}\n`;
        resultText += `⭐ XP: ${updatedPlayer.xp}/${PlayerManager.getXPForLevel(updatedPlayer.level + 1)}`;

        await CommandHandler.sendMessage(client, replyTo, resultText);
    }

    async handleCombat(client, sender, args, replyTo) {
        const player = PlayerManager.getPlayer(sender);

        if (!player) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!\n\nUtilisez ${this.prefix}start pour commencer.`);
            return;
        }

        if (args.length === 0) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${this.prefix}combat [@joueur]\n\nMentionnez un joueur pour le défier!\n\nExemple: ${this.prefix}combat @22663685468`);
            return;
        }

        // Extraire le numéro du joueur adversaire (format: @221234567890)
        const opponentMention = args[0];
        let opponentId = opponentMention.replace('@', '') + '@s.whatsapp.net';
        
        // Si le format n'est pas bon, essayer sans modification
        if (!opponentMention.startsWith('@')) {
            opponentId = opponentMention + '@s.whatsapp.net';
        }

        const opponent = PlayerManager.getPlayer(opponentId);

        if (!opponent) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Ce joueur n'a pas encore créé de personnage!\n\nIl doit utiliser ${this.prefix}start pour créer son personnage.`);
            return;
        }

        if (sender === opponentId) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Vous ne pouvez pas vous battre contre vous-même!`);
            return;
        }

        // Vérifier l'énergie
        const energyCost = 20;
        if (player.currentEnergy < energyCost) {
            await CommandHandler.sendMessage(client, replyTo, `⚠️ Énergie insuffisante!\n\nVous avez besoin de ${energyCost} énergie pour combattre.\nÉnergie actuelle: ${player.currentEnergy}/${player.maxEnergy}\n\n💤 L'énergie se régénère de 10 par minute.`);
            return;
        }

        // Consommer l'énergie
        await PlayerManager.consumeEnergy(sender, energyCost);

        // Simuler le combat
        const combatResult = CombatSystem.simulateFight(player, opponent);

        // Récompenses
        const xpGained = combatResult.winner === player ? 150 : 50;
        const berrysGained = combatResult.winner === player ? 500 : 100;

        await PlayerManager.addXP(sender, xpGained);
        await PlayerManager.addBerrys(sender, berrysGained);

        // Message de résultat
        let resultText = `⚔️ *COMBAT: ${player.name} VS ${opponent.name}* ⚔️\n\n`;
        resultText += `${combatResult.results}\n\n`;
        resultText += `💰 Récompenses:\n`;
        resultText += `⭐ +${xpGained} XP\n`;
        resultText += `💰 +${berrysGained} Berrys\n`;
        resultText += `⚡ -${energyCost} énergie`;

        await CommandHandler.sendMessage(client, replyTo, resultText);

        // Notifier l'adversaire
        const opponentNotif = `⚔️ *COMBAT!*\n\n${player.name} vous a défié en combat!\n\n${combatResult.results}\n\n${combatResult.winner.name === opponent.name ? '🏆 Vous avez gagné!' : '💔 Vous avez perdu...'}`;
        await CommandHandler.sendMessage(client, opponentId, opponentNotif);
    }

    async handleHelp(client, sender, args, replyTo) {
        const helpText = `📖 *GUIDE D'AIDE* 📖

*═══ COMMANDES DE BASE ═══*

${this.prefix}start - Commencer l'aventure
${this.prefix}menu - Menu principal
${this.prefix}creer [nom] [race] - Créer un personnage
${this.prefix}profil - Voir son profil
${this.prefix}stats - Statistiques détaillées

*═══ EXPLORATION ═══*

${this.prefix}zones - Liste des zones
${this.prefix}voyage [zone] - Voyager
${this.prefix}entrainement [attribut] - S'entraîner

*═══ INFORMATIONS ═══*

${this.prefix}races - Races disponibles
${this.prefix}regles - Règles du jeu
${this.prefix}attributs - Explication attributs

*═══════════════════════*

Pour toute question, relisez les règles!`;

        await CommandHandler.sendMessage(client, replyTo, helpText);
    }

    async handleRules(client, sender, args, replyTo) {
        const rulesText = `📜 *RÈGLES DU JEU* 📜

*═══ PROGRESSION ═══*
• Gagnez de l'XP par combat et entraînement
• Montez de niveau pour débloquer de nouvelles capacités
• Améliorez vos attributs par l'entraînement RP

*═══ ÉNERGIE ═══*
• Chaque action consomme de l'énergie
• Énergie max = Endurance × 10
• Régénération: +10 énergie/minute
• Repos nécessaire si épuisé

*═══ ATTRIBUTS ═══*
⚡ Force - Dégâts physiques (+2% par point)
💨 Vitesse - Rapidité et esquive
🛡️ Endurance - Résistance et énergie max
👁️ Réflexe - Temps de réaction
🧠 Intelligence - Maîtrise des techniques
🎯 Précision - Coups critiques

*═══ ZONES ═══*
• East Blue: Niv. 1-10
• Grand Line: Niv. 10-25
• Nouveau Monde: Niv. 25-50
• Eaux Interdites: Niv. 50+

*═══════════════════════*

Respectez les règles et jouez fair-play!`;

        await CommandHandler.sendMessage(client, replyTo, rulesText);
    }

    async handleAttributes(client, sender, args, replyTo) {
        const attributesText = `📊 *GUIDE DES ATTRIBUTS* 📊

*⚡ FORCE*
• Dégâts au corps à corps
• +2% dégâts par point
• +10 = soulever 200kg
• +20 = briser des roches

*💨 VITESSE*
• Rapidité de déplacement
• Niveau 5 = 8 m/s
• Niveau 10 = 12 m/s
• Niveau 20 = 25 m/s

*🛡️ ENDURANCE*
• Résistance physique
• +5 énergie par point
• +10 = -10% dégâts reçus
• +50 = résistance extrême

*👁️ RÉFLEXE*
• Temps de réaction
• +10 = 1.5s
• +15 = 1.0s
• +25 = 0.5s (Haki niveau)

*🧠 INTELLIGENCE*
• Maîtrise des techniques
• +1% maîtrise par point
• +15 = créer ses techniques
• +30 = contrôle Logia

*🎯 PRÉCISION*
• Justesse des attaques
• +10 = 5% coups critiques
• +20 = viser points faibles
• +30 = tir quasi-parfait

*═══════════════════════*`;

        await CommandHandler.sendMessage(client, replyTo, attributesText);
    }

    static async sendMessage(sock, jid, text) {
        try {
            await sock.sendMessage(jid, { text: text });
            console.log(`✉️ Message envoyé à ${jid}`);
        } catch (error) {
            console.error('❌ Erreur envoi message:', error);
        }
    }
}

export default new CommandHandler();
