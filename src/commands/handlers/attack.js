
import { handleAction } from './boss.js';

const handleAttack = async (client, sender, args, replyTo) => {
    await handleAction(client, sender, 'attack');
};

export default handleAttack;
