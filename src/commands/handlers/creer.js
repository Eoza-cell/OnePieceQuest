
import PlayerManager from '../../systems/PlayerManager.js';
import RaceSystem from '../../systems/RaceSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleCreate = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (player) {
        await CommandHandler.sendMessage(client, replyTo, '⚓ Vous avez déjà un personnage!');
        return;
    }

    if (args.length < 2) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}creer [nom] [race]\n\nExemple: ${CommandHandler.prefix}creer Luffy Humain\n\nUtilisez ${CommandHandler.prefix}races pour voir les races disponibles.`);
        return;
    }

    const name = args[0];
    const raceName = args.slice(1).join(' ');
    const race = RaceSystem.getRace(raceName);

    if (!race) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Race inconnue: ${raceName}\n\nUtilisez ${CommandHandler.prefix}races pour voir les races disponibles.`);
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
Utilisez ${CommandHandler.prefix}menu pour voir toutes les commandes disponibles.`;

    await CommandHandler.sendMessage(client, replyTo, creationText);
};

export default handleCreate;
