
import PlayerManager from '../../systems/PlayerManager.js';
import CombatSystem from '../../systems/CombatSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleRdm = async (client, sender, args, replyTo) => {
    const participants = await client.groupMetadata(replyTo).then(meta => meta.participants);
    const playerIds = participants.map(p => p.id);

    const availablePlayers = playerIds.filter(id => PlayerManager.getPlayer(id));

    if (availablePlayers.length < 2) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Pas assez de joueurs pour un RDM!`);
        return;
    }

    const player1Id = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    let player2Id = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    while (player1Id === player2Id) {
        player2Id = availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    }

    const player1 = PlayerManager.getPlayer(player1Id);
    const player2 = PlayerManager.getPlayer(player2Id);

    const combatResult = CombatSystem.simulateFight(player1, player2);

    let resultText = `⚔️ *RANDOM DEATHMATCH* ⚔️\n\n`;
    resultText += `${player1.name} VS ${player2.name}\n\n`;
    resultText += `${combatResult.results}\n\n`;
    resultText += `🏆 ${combatResult.winner.name} remporte la victoire!`;

    await CommandHandler.sendMessage(client, replyTo, resultText);
};

export default handleRdm;
