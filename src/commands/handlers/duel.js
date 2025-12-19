
import PlayerManager from '../../systems/PlayerManager.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleDuel = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!\n\nUtilisez ${CommandHandler.prefix}start pour commencer.`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}duel [@joueur]\n\nMentionnez un joueur pour le défier!`);
        return;
    }

    const opponentMention = args[0];
    let opponentId = opponentMention.replace('@', '') + '@s.whatsapp.net';

    if (!opponentMention.startsWith('@')) {
        opponentId = opponentMention + '@s.whatsapp.net';
    }

    const opponent = PlayerManager.getPlayer(opponentId);

    if (!opponent) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Ce joueur n'a pas encore créé de personnage!`);
        return;
    }

    if (sender === opponentId) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous ne pouvez pas vous battre contre vous-même!`);
        return;
    }

    await CommandHandler.sendMessage(client, replyTo, `⚔️ *DUEL LANCÉ!* ⚔️\n\n${player.name} a défié ${opponent.name} en duel!\n\nLe combat commencera dans 6 minutes. Préparez-vous!`);
    await CommandHandler.sendMessage(client, opponentId, `⚔️ *DUEL LANCÉ!* ⚔️\n\n${player.name} vous a défié en duel!\n\nLe combat commencera dans 6 minutes. Préparez-vous!`);

    setTimeout(async () => {
        const combatResult = CombatSystem.simulateFight(player, opponent);
        let resultText = `*Le duel entre ${player.name} et ${opponent.name} est terminé!* \n\n`;
        resultText += combatResult.results;
        await CommandHandler.sendMessage(client, replyTo, resultText);
    }, 360000);
};

export default handleDuel;
