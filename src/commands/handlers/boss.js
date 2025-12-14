
import BossSystem from '../../systems/BossSystem.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';
import { generateHealthBar } from '../../utils/helpers.js';

const activeBossFights = new Map();

const handleBoss = async (client, sender, args, replyTo) => {
    const subcommand = args[0];

    if (subcommand === 'list') {
        const bossList = BossSystem.getBossList();
        await CommandHandler.sendMessage(client, replyTo, `*Liste des Boss Disponibles:*\n\n${bossList}`);
        return;
    }

    if (subcommand === 'fight') {
        const bossId = args[1];
        if (!bossId) {
            await CommandHandler.sendMessage(client, replyTo, `❌ Veuillez spécifier un boss à combattre.`);
            return;
        }

        const result = CombatSystem.startBossFight(sender, bossId);
        if (result.error) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${result.error}`);
            return;
        }

        activeBossFights.set(sender, result.combatId);

        const combat = CombatSystem.getCombat(result.combatId);
        const { player, boss } = combat;

        const healthBarPlayer = generateHealthBar(player.currentEnergy, player.maxEnergy);
        const healthBarBoss = generateHealthBar(boss.stats.health, BossSystem.getBoss(bossId).stats.health);

        const initialMessage = `*${player.name}* affronte *${boss.name}*!\n\n` +
                               `${player.name}: ${healthBarPlayer}\n` +
                               `${boss.name}: ${healthBarBoss}\n\n` +
                               `C'est votre tour! Utilisez ${CommandHandler.prefix}attack ou ${CommandHandler.prefix}dodge.`;

        await CommandHandler.sendMessage(client, replyTo, initialMessage);
        return;
    }

    await CommandHandler.sendMessage(client, replyTo, `❌ Sous-commande invalide. Utilisez ${CommandHandler.prefix}boss list ou ${CommandHandler.prefix}boss fight [nom-du-boss].`);
};

// This is a temporary solution to link actions to the boss fight.
// A more robust solution would involve a proper event bus.
const handleAction = async (client, sender, action) => {
    const combatId = activeBossFights.get(sender);
    if (!combatId) return;

    const result = CombatSystem.handlePlayerAction(combatId, action);
    const combat = result.combatState;
    if (!combat) return; // Combat ended

    const { player, boss } = combat;

    const healthBarPlayer = generateHealthBar(player.currentEnergy, player.maxEnergy);
    const healthBarBoss = generateHealthBar(boss.stats.health, BossSystem.getBoss(combat.boss.name.toLowerCase().replace(/ /g, '-')).stats.health);

    const turnMessage = `${combat.log.join('\n')}\n\n` +
                        `${player.name}: ${healthBarPlayer}\n` +
                        `${boss.name}: ${healthBarBoss}\n\n` +
                        `C'est votre tour! Utilisez !attack ou !dodge.`;

    await CommandHandler.sendMessage(client, player.phoneNumber, turnMessage);
};

export default handleBoss;
export { handleAction };
