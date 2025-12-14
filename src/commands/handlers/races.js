
import RaceSystem from '../../systems/RaceSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleRaces = async (client, sender, args, replyTo) => {
    const racesText = `👥 *RACES JOUABLES* 👥

${RaceSystem.getRacesList()}

*═══════════════════════*

Pour créer un personnage:
${CommandHandler.prefix}creer [nom] [race]

Exemple: ${CommandHandler.prefix}creer Zoro Humain`;

    await CommandHandler.sendMessage(client, replyTo, racesText);
};

export default handleRaces;
