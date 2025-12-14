
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PlayerManager from '../systems/PlayerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CommandHandler {
    constructor() {
        this.prefix = '!';
        this.commands = {};
    }

    async #loadCommands() {
        const commandFiles = fs.readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandName = file.replace('.js', '');
            const { default: commandHandler } = await import(`./handlers/${file}`);
            this.commands[commandName] = commandHandler;
        }
    }

    static async create() {
        const handler = new CommandHandler();
        await handler.#loadCommands();
        return handler;
    }

    async handleCommand(client, message) {
        const jid = message.key.remoteJid;
        
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text ||
                     message.message?.imageMessage?.caption ||
                     message.message?.videoMessage?.caption || '';

        console.log(`📝 Texte extrait: "${text}" de ${jid}`);

        if (!text.startsWith(this.prefix)) return;

        const args = text.slice(this.prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        console.log(`🎯 Commande détectée: ${commandName}`);

        if (!this.commands[commandName]) {
            console.log(`❌ Commande inconnue: ${commandName}`);
            return;
        }
        
        const senderId = message.key.participant || jid;
        const replyTo = jid;
        
        await PlayerManager.regenerateEnergy(senderId);

        try {
            await this.commands[commandName](client, senderId, args, replyTo);
            console.log(`✅ Commande ${commandName} - Joueur: ${senderId} - Réponse: ${replyTo}`);
        } catch (error) {
            console.error(`❌ Erreur commande ${commandName}:`, error);
            await CommandHandler.sendMessage(client, replyTo, '❌ Une erreur est survenue. Réessayez plus tard.');
        }
    }

    static async sendMessage(sock, jid, text) {
        try {
            await sock.sendMessage(jid, { text: text });
            console.log(`✉️ Message envoyé à ${jid}`);
        } catch (error) {
            console.error('❌ Erreur envoi message:', error);
        }
    }
}

export default CommandHandler;
