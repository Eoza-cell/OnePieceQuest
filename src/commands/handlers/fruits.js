
import DevilFruitSystem from '../../systems/DevilFruitSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleFruits = async (client, sender, args, replyTo) => {
    const fruitsText = `🍎 *FRUITS DU DÉMON* 🍎\n\n${DevilFruitSystem.getFruitsList()}\n*═══════════════════════*\n\nPour manger un fruit:\n${CommandHandler.prefix}manger [nom du fruit]\n\nExemple: ${CommandHandler.prefix}manger Gomu Gomu no Mi`;
    await CommandHandler.sendMessage(client, replyTo, fruitsText);
};

export default handleFruits;
