
import HakiSystem from '../../systems/HakiSystem.js';
import CommandHandler from '../CommandHandler.js';

const handleHaki = async (client, sender, args, replyTo) => {
    const hakiText = `⚡ *SYSTÈME HAKI* ⚡\n\n${HakiSystem.getHakiList()}\n*═══════════════════════*\n\nPour débloquer un Haki:\n${CommandHandler.prefix}debloquer [type]\n\nTypes: kenbunshoku, busoshoku, haoshoku`;
    await CommandHandler.sendMessage(client, replyTo, hakiText);
};

export default handleHaki;
