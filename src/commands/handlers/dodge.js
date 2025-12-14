
import { handleAction } from './boss.js';

const handleDodge = async (client, sender, args, replyTo) => {
    await handleAction(client, sender, 'dodge');
};

export default handleDodge;
