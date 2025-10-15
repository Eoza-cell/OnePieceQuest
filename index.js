import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import NodeCache from 'node-cache';
import qrcode from 'qrcode-terminal';
import CommandHandler from './src/commands/CommandHandler.js';

const msgRetryCounterCache = new NodeCache();

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        defaultQueryTimeoutMs: undefined
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
            const shouldReconnect = lastDisconnect?.error instanceof Boom
                ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
                : true;
            
            console.log('🔌 Connexion fermée. Raison:', lastDisconnect?.error);
            
            if (shouldReconnect) {
                console.log('🔄 Reconnexion...');
                setTimeout(() => connectToWhatsApp(), 3000);
            } else {
                console.log('❌ Déconnecté. Supprimez le dossier auth_info et redémarrez.');
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
        if (message.key.fromMe) return;

        const messageText = message.message?.conversation 
            || message.message?.extendedTextMessage?.text 
            || '';

        if (messageText.startsWith('!')) {
            console.log(`📨 Message reçu de ${message.key.remoteJid}: ${messageText}`);
            await CommandHandler.handleCommand(sock, message);
        }
    });

    sock.ev.on('messages.update', async (updates) => {
        for (const update of updates) {
            if (update.update.status) {
                console.log(`📧 Statut message: ${update.update.status}`);
            }
        }
    });

    sock.ev.on('presence.update', async (presence) => {
        console.log(`👤 Présence: ${presence.id} - ${presence.presences?.[presence.id]?.lastKnownPresence}`);
    });

    return sock;
}

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🏴‍☠️  ONE PIECE: NOUVELLE ÈRE  🏴‍☠️    ║
║                                        ║
║     Bot WhatsApp RPG - v2.0.0          ║
║         (Baileys v7.0.0-rc.5)          ║
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
