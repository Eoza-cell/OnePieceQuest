
import PlayerManager from '../../systems/PlayerManager.js';
import CrewSystem from '../../systems/CrewSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleCreateCrew = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);
    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}creerequipage [nom]`);
        return;
    }

    const crewName = args.join(' ');
    const result = CrewSystem.createCrew(sender, crewName);

    if (!result.success) {
        await CommandHandler.sendMessage(client, replyTo, `❌ ${result.reason}`);
        return;
    }

    await CommandHandler.sendMessage(client, replyTo, `🎉 *ÉQUIPAGE CRÉÉ!* 🎉\n\n⚓ ${crewName}\n👑 Capitaine: ${player.name}\n\nID: ${result.crew.id}\n\nPartagez cet ID pour recruter!`);
};

export default handleCreateCrew;
