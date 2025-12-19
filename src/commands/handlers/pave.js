
import CommandHandler from '../CommandHandler.js';

const handlePave = async (client, sender, args, replyTo) => {
    const paveText = `╔════════════════╗
BEST UTILISATION FOR ALL
╚════════════════╝
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
_💬DIALOGUE_:
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
*_🕹️ Actions:_*
- 🔻*_Section A_*:
▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
\`\`\` N.E.W BEST IMMERSION 👾\`\`\``;

    await CommandHandler.sendMessage(client, replyTo, paveText);

    setTimeout(async () => {
        await CommandHandler.sendMessage(client, replyTo, `*Le compte à rebours de 6 minutes est terminé!*`);
    }, 360000);
};

export default handlePave;
