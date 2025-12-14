
import PlayerManager from '../../systems/PlayerManager.js';
import DevilFruitSystem from '../../systems/DevilFruitSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleEatFruit = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);
    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage avec ${CommandHandler.prefix}start`);
        return;
    }

    if (player.devilFruit) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous avez déjà mangé le ${player.devilFruit}!`);
        return;
    }

    const fruitName = args.join(' ');
    const fruit = DevilFruitSystem.getFruit(fruitName);

    if (!fruit) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Fruit inconnu! Utilisez ${CommandHandler.prefix}fruits pour voir la liste.`);
        return;
    }

    await PlayerManager.updatePlayer(sender, {
        devilFruit: fruitName,
        devilFruitMastery: 0
    });

    const updatedPlayer = PlayerManager.getPlayer(sender);
    Object.keys(fruit.masteryBonus).forEach(attr => {
        updatedPlayer.attributes[attr] += fruit.masteryBonus[attr];
    });
    await PlayerManager.updatePlayer(sender, updatedPlayer);

    const eatText = `🍎 *FRUIT DU DÉMON MANGÉ!* 🍎\n\n${fruit.emoji} *${fruitName}*\n${fruit.description}\n\n*Type:* ${fruit.type}\n*Pouvoir:* ${fruit.power}/100\n\n*Capacités:*\n${fruit.abilities.map(a => `• ${a}`).join('\n')}\n\n*Faiblesses:*\n${fruit.weakness}\n\n*Bonus Maîtrise:*\n${Object.entries(fruit.masteryBonus).map(([k,v]) => `+${v} ${k}`).join(', ')}\n\n⚠️ Vous ne pouvez plus nager!`;

    await CommandHandler.sendMessage(client, replyTo, eatText);
};

export default handleEatFruit;
