
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
                               `Que faites-vous?`;

        await CommandHandler.sendMessage(client, replyTo, initialMessage);
        return;
    }

    // Handle combat actions
    const combatId = activeBossFights.get(sender);
    if (combatId) {
        const actionText = args.join(' ');
        const result = CombatSystem.handlePlayerAction(combatId, actionText);

        if (result.error) {
            await CommandHandler.sendMessage(client, replyTo, `❌ ${result.error}`);
            return;
        }

        if (result.isPlayerWinner !== undefined) {
            // Combat ended
            activeBossFights.delete(sender);
            const winnerMessage = result.isPlayerWinner ?
                `Félicitations, vous avez vaincu ${result.loser.name}!` :
                `Vous avez été vaincu par ${result.winner.name}...`;

            let lootMessage = '';
            if (result.loot && result.loot.length > 0) {
                lootMessage = `\n\n*Butin:*\n` + result.loot.map(item => `- ${item.name}`).join('\n');
            }

            await CommandHandler.sendMessage(client, replyTo, winnerMessage + lootMessage);
        } else {
            // Combat continues
            const { player, boss, bossId } = result.combatState;
            const healthBarPlayer = generateHealthBar(player.currentEnergy, player.maxEnergy);
            const healthBarBoss = generateHealthBar(boss.stats.health, BossSystem.getBoss(bossId).stats.health);

            const turnMessage = `${result.combatState.log.slice(-2).join('\n')}\n\n` +
                                `${player.name}: ${healthBarPlayer}\n` +
                                `${boss.name}: ${healthBarBoss}\n\n` +
                                `Que faites-vous?`;

            await CommandHandler.sendMessage(client, replyTo, turnMessage);
        }
    } else {
        await CommandHandler.sendMessage(client, replyTo, `❌ Sous-commande invalide. Utilisez !boss list ou !boss fight [nom-du-boss].`);
    }
};

export default handleBoss;
