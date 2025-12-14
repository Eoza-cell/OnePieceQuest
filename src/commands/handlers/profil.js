
import PlayerManager from '../../systems/PlayerManager.js';
import RaceSystem from '../../systems/RaceSystem.js';
import ZoneSystem from '../../systems/ZoneSystem.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleProfile = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!\n\nUtilisez ${CommandHandler.prefix}start pour commencer.`);
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

Utilisez ${CommandHandler.prefix}stats pour plus de détails!`;

    await CommandHandler.sendMessage(client, replyTo, profileText);
};

export default handleProfile;
