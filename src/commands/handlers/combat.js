
import PlayerManager from '../../systems/PlayerManager.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleCombat = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!\n\nUtilisez ${CommandHandler.prefix}start pour commencer.`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}combat [@joueur]\n\nMentionnez un joueur pour le défier!\n\nExemple: ${CommandHandler.prefix}combat @22663685468`);
        return;
    }

    const opponentMention = args[0];
    let opponentId = opponentMention.replace('@', '') + '@s.whatsapp.net';

    if (!opponentMention.startsWith('@')) {
        opponentId = opponentMention + '@s.whatsapp.net';
    }

    const opponent = PlayerManager.getPlayer(opponentId);

    if (!opponent) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Ce joueur n'a pas encore créé de personnage!\n\nIl doit utiliser ${CommandHandler.prefix}start pour créer son personnage.`);
        return;
    }

    if (sender === opponentId) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous ne pouvez pas vous battre contre vous-même!`);
        return;
    }

    const energyCost = 20;
    if (player.currentEnergy < energyCost) {
        await CommandHandler.sendMessage(client, replyTo, `⚠️ Énergie insuffisante!\n\nVous avez besoin de ${energyCost} énergie pour combattre.\nÉnergie actuelle: ${player.currentEnergy}/${player.maxEnergy}\n\n💤 L'énergie se régénère de 10 par minute.`);
        return;
    }

    await PlayerManager.consumeEnergy(sender, energyCost);

    const combatResult = CombatSystem.simulateFight(player, opponent);

    const xpGained = combatResult.winner === player ? 150 : 50;
    const berrysGained = combatResult.winner === player ? 500 : 100;

    await PlayerManager.addXP(sender, xpGained);
    await PlayerManager.addBerrys(sender, berrysGained);

    let resultText = `⚔️ *COMBAT: ${player.name} VS ${opponent.name}* ⚔️\n\n`;
    resultText += `${combatResult.results}\n\n`;
    resultText += `💰 Récompenses:\n`;
    resultText += `⭐ +${xpGained} XP\n`;
    resultText += `💰 +${berrysGained} Berrys\n`;
    resultText += `⚡ -${energyCost} énergie`;

    await CommandHandler.sendMessage(client, replyTo, resultText);

    const opponentNotif = `⚔️ *COMBAT!*\n\n${player.name} vous a défié en combat!\n\n${combatResult.results}\n\n${combatResult.winner.name === opponent.name ? '🏆 Vous avez gagné!' : '💔 Vous avez perdu...'}`;
    await CommandHandler.sendMessage(client, opponentId, opponentNotif);
};

export default handleCombat;
