
import PlayerManager from '../../systems/PlayerManager.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleStats = async (client, sender, args, replyTo) => {
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
};

export default handleStats;
