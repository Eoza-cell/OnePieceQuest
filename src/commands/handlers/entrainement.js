
import PlayerManager from '../../systems/PlayerManager.js';
import CommandHandler from '../CommandHandler.js';

const handleTraining = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}entrainement [attribut]\n\nAttributs disponibles: force, vitesse, intelligence, reflexe\n\nExemple: ${CommandHandler.prefix}entrainement force`);
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
};

export default handleTraining;
