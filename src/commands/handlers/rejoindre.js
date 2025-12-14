
import PlayerManager from '../../systems/PlayerManager.js';
import CrewSystem from '../../systems/CrewSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleJoinCrew = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);
    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}rejoindre [id équipage]`);
        return;
    }

    const result = CrewSystem.joinCrew(args[0], sender);
    if (!result.success) {
        await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
        return;
    }

    await CommandHandler.sendMessage(client, replyTo, `🎉 Vous avez rejoint l'équipage!`);
};

export default handleJoinCrew;
