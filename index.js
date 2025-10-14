const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const NodeCache = require('node-cache');
const CommandHandler = require('./src/commands/CommandHandler');

const msgRetryCounterCache = new NodeCache();
const store = makeInMemoryStore({
    logger: pino().child({ level: 'silent', stream: 'store' })
});

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        defaultQueryTimeoutMs: undefined
    });

    store.bind(sock.ev);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
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
║     Bot WhatsApp RPG - v1.0.0          ║
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
