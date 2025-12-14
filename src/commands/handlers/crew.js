
import CrewSystem from '../../systems/CrewSystem.js';
import PlayerManager from '../../systems/PlayerManager.js';
import CommandHandler from '../CommandHandler.js';

const handleCrew = async (client, sender, args, replyTo) => {
    const crew = CrewSystem.getPlayerCrew(sender);
    if (!crew) {
        await CommandHandler.sendMessage(client, replyTo, `⚓ Vous n'êtes dans aucun équipage!\n\n${CommandHandler.prefix}creerequipage [nom] - Créer un équipage\n${CommandHandler.prefix}rejoindre [id] - Rejoindre un équipage`);
        return;
    }

    const captain = PlayerManager.getPlayer(crew.captain);
    const crewText = `⚓ *ÉQUIPAGE: ${crew.name.toUpperCase()}* ⚓\n\n👑 Capitaine: ${captain.name}\n👥 Membres: ${crew.members.length}\n💰 Trésor: ${crew.treasury.toLocaleString()} ฿\n⭐ Réputation: ${crew.reputation}\n\n*Membres:*\n${crew.members.map(id => {
        const p = PlayerManager.getPlayer(id);
        return `• ${p.name} (Niv.${p.level})`;
    }).join('\n')}`;

    await CommandHandler.sendMessage(client, replyTo, crewText);
};

export default handleCrew;
