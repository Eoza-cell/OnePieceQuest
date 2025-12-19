
import CrewSystem from '../../systems/CrewSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleLeaveCrew = async (client, sender, args, replyTo) => {
    const result = CrewSystem.leaveCrew(sender);
    if (!result.success) {
        await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
        return;
    }

    if (result.disbanded) {
        await CommandHandler.sendMessage(client, replyTo, `⚓ Équipage dissous (capitaine parti)`);
    } else {
        await CommandHandler.sendMessage(client, replyTo, `👋 Vous avez quitté l'équipage`);
    }
};

export default handleLeaveCrew;
