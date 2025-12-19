
import PlayerManager from '../../systems/PlayerManager.js';
import HakiSystem from '../../systems/HakiSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleUnlockHaki = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);
    if (!player) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Créez d'abord un personnage!`);
        return;
    }

    const hakiType = args[0]?.toLowerCase();
    const hakiKey = hakiType === 'kenbunshoku' ? 'Kenbunshoku' :
                   hakiType === 'busoshoku' ? 'Busoshoku' :
                   hakiType === 'haoshoku' ? 'Haoshoku' : null;

    if (!hakiKey) {
        await CommandHandler.sendMessage(client, replyTo, `❌ Type invalide! Utilisez: kenbunshoku, busoshoku ou haoshoku`);
        return;
    }

    if (player.haki[hakiType]?.unlocked) {
        await CommandHandler.sendMessage(client, replyTo, `⚠️ Vous avez déjà débloqué ce Haki!`);
        return;
    }

    const canUnlock = HakiSystem.canUnlock(hakiKey, player.level);
    if (!canUnlock.can) {
        await CommandHandler.sendMessage(client, replyTo, `❌ ${canUnlock.reason}`);
        return;
    }

    player.haki[hakiType] = { unlocked: true, level: 1 };
    await PlayerManager.updatePlayer(sender, player);

    const haki = HakiSystem.hakiTypes[hakiKey];
    await CommandHandler.sendMessage(client, replyTo, `🎉 *HAKI DÉBLOQUÉ!* 🎉\n\n${haki.emoji} ${haki.name}\n\n${haki.description}\n\n*Bonus:*\n${Object.entries(haki.bonus).map(([k,v]) => `+${v} ${k}`).join('\n')}`);
};

export default handleUnlockHaki;
