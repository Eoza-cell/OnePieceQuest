
import PlayerManager from '../../systems/PlayerManager.js';
import RaceSystem from '../../systems/RaceSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleStart = async (client, sender, args, replyTo) => {
    const player = PlayerManager.getPlayer(sender);

    if (player) {
        await CommandHandler.sendMessage(client, replyTo, `⚓ Vous avez déjà un personnage!\n\nUtilisez ${CommandHandler.prefix}profil pour voir vos stats.`);
        return;
    }

    const welcomeText = `🏴‍☠️ *BIENVENUE DANS ONE PIECE: NOUVELLE ÈRE* 🏴‍☠️

Préparez-vous à vivre une aventure épique dans l'univers de One Piece!

*═══ CRÉATION DE PERSONNAGE ═══*

Pour créer votre personnage, utilisez:
${CommandHandler.prefix}creer [nom] [race]

*Exemple:*
${CommandHandler.prefix}creer Luffy Humain

*═══ RACES DISPONIBLES ═══*

${RaceSystem.getRacesList()}

*═══════════════════════*

Choisissez votre race avec soin, elle influencera votre aventure!`;

    await CommandHandler.sendMessage(client, replyTo, welcomeText);
};

export default handleStart;
