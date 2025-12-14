
import PlayerManager from '../../systems/PlayerManager.js';
import ZoneSystem from '../../systems/ZoneSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleTravel = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Vous n'avez pas encore de personnage!`);
        return;
    }

    if (args.length === 0) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Usage: ${CommandHandler.prefix}voyage [zone]\n\nUtilisez ${CommandHandler.prefix}zones pour voir les zones disponibles.`);
        return;
    }

    const zoneName = args.join(' ');
    const zone = ZoneSystem.getZone(zoneName);

    if (!zone) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Zone inconnue: ${zoneName}`);
        return;
    }

    const access = ZoneSystem.canAccessZone(player.level, zoneName);
    if (!access.access) {
        await CommandHandler.sendMessage(client, replyTo, `⚠️ Accès refusé!\n\n${access.reason}`);
        return;
    }

    await PlayerManager.updatePlayer(sender, { zone: zoneName });

    await CommandHandler.sendMessage(client, replyTo, `🌊 *VOYAGE RÉUSSI!* 🌊\n\nVous êtes maintenant dans: ${zone.emoji} *${zoneName}*\n\n${zone.description}\n\n⚠️ Dangers: ${zone.dangers}\n🎁 Récompenses: ${zone.rewards}`);
};

export default handleTravel;
