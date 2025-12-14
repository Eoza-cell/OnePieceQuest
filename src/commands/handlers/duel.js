
import PlayerManager from '../../systems/PlayerManager.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const duels = {};

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

    const duelId = `${sender}-${opponentId}`;
    duels[duelId] = {
        player1: sender,
        player2: opponentId,
        turn: 1,
        player1Actions: [],
        player2Actions: [],
    };

    await CommandHandler.sendMessage(client, replyTo, `⚔️ *DUEL LANCÉ!* ⚔️\n\n${player.name} a défié ${opponent.name} en duel!\n\nLe combat commencera dans 6 minutes. Préparez-vous!`);
    await CommandHandler.sendMessage(client, opponentId, `⚔️ *DUEL LANCÉ!* ⚔️\n\n${player.name} vous a défié en duel!\n\nLe combat commencera dans 6 minutes. Préparez-vous!`);

    setTimeout(() => {
        startDuel(client, duelId, replyTo);
    }, 360000);
};

const startDuel = async (client, duelId, replyTo) => {
    const duel = duels[duelId];
    if (!duel) return;

    const player1 = PlayerManager.getPlayer(duel.player1);
    const player2 = PlayerManager.getPlayer(duel.player2);

    let combatLog = `*Le duel entre ${player1.name} et ${player2.name} commence!* \n\n`;

    while (player1.currentEnergy > 0 && player2.currentEnergy > 0) {
        combatLog += `*--- Tour ${duel.turn} ---*\n`;
        combatLog += `${player1.name}: ${player1.currentEnergy} ⚡\n`;
        combatLog += `${player2.name}: ${player2.currentEnergy} ⚡\n\n`;

        const player1Action = duel.player1Actions.shift() || 'attaque';
        const player2Action = duel.player2Actions.shift() || 'attaque';

        const result = CombatSystem.simulateTurn(player1, player2, player1Action, player2Action);

        combatLog += result.log;

        player1.currentEnergy = result.player1.currentEnergy;
        player2.currentEnergy = result.player2.currentEnergy;

        if (player1.currentEnergy <= 0) {
            combatLog += `\n*${player1.name} est à court d'énergie! ${player2.name} remporte la victoire!*`;
            break;
        }

        if (player2.currentEnergy <= 0) {
            combatLog += `\n*${player2.name} est à court d'énergie! ${player1.name} remporte la victoire!*`;
            break;
        }

        duel.turn++;
    }

    await CommandHandler.sendMessage(client, replyTo, combatLog);
    delete duels[duelId];
};

const addAction = (duelId, playerId, action) => {
    const duel = duels[duelId];
    if (!duel) return;

    if (duel.player1 === playerId) {
        duel.player1Actions.push(action);
    } else if (duel.player2 === playerId) {
        duel.player2Actions.push(action);
    }
};

export default handleDuel;
