
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import CommandHandler from './src/commands/CommandHandler.js';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ['Ubuntu', 'Chrome', '128.0.6613.86'],
        version: [2, 3000, 1025190524],
        logger: pino({ level: 'silent' }),
        getMessage: async key => {
            console.log('⚠️ Message non déchiffré, retry demandé:', key);
            return { conversation: '🔄 Réessaye d\'envoyer ton message' };
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n📱 Scannez ce QR code avec WhatsApp:\n');
            qrcode.generate(qr, { small: true });
            console.log('\n⚠️ Le QR code expire après quelques secondes. Rechargez si nécessaire.\n');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
                : true;

            console.log('🔌 Connexion fermée. Raison:', lastDisconnect?.error);

            if (shouldReconnect) {
                console.log('🔄 Reconnexion...');
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('✅ Connecté à WhatsApp!');
            console.log('🏴‍☠️ Bot ONE PIECE: NOUVELLE ÈRE actif!');
            console.log('📱 Envoyez !menu pour commencer');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message.message) return;

        const messageText = message.message.conversation ||
            message.message.extendedTextMessage?.text || '';

        if (!messageText.startsWith('!')) return;

        console.log(`📨 Message reçu de ${message.key.remoteJid}: ${messageText}`);

        await CommandHandler.handleCommand(sock, message);
    });
}

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🏴‍☠️  ONE PIECE: NOUVELLE ÈRE  🏴‍☠️    ║
║                                        ║
║     Bot WhatsApp RPG - v2.0.0          ║
║      (Baileys - Optimisé Replit)       ║
║                                        ║
╚════════════════════════════════════════╝

⚓ Démarrage du bot...
`);

connectToWhatsApp().catch(err => {
    console.error('❌ Erreur fatale:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Exception non capturée:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promesse rejetée:', err);
});
