
import ZoneSystem from '../../systems/ZoneSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleZones = async (client, sender, args, replyTo) => {
    const zonesText = `🗺️ *ZONES DU MONDE* 🗺️

${ZoneSystem.getZonesList()}

*═══════════════════════*

Pour voyager vers une zone:
${CommandHandler.prefix}voyage [zone]

Exemple: ${CommandHandler.prefix}voyage Grand Line`;

    await CommandHandler.sendMessage(client, replyTo, zonesText);
};

export default handleZones;
