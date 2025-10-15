import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import CommandHandler from './src/commands/CommandHandler.js';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './auth_info'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('\n📱 Scannez ce QR code avec WhatsApp:\n');
    qrcode.generate(qr, { small: true });
    console.log('\n⚠️ Le QR code expire après quelques secondes. Rechargez si nécessaire.\n');
});

client.on('ready', () => {
    console.log('✅ Connecté à WhatsApp!');
    console.log('🏴‍☠️ Bot ONE PIECE: NOUVELLE ÈRE actif!');
    console.log('📱 Envoyez !menu pour commencer');
});

client.on('authenticated', () => {
    console.log('🔐 Authentification réussie!');
});

client.on('auth_failure', (msg) => {
    console.error('❌ Échec d\'authentification:', msg);
});

client.on('disconnected', (reason) => {
    console.log('🔌 Déconnecté:', reason);
    console.log('🔄 Redémarrage...');
    client.initialize();
});

client.on('message', async (message) => {
    const messageText = message.body;

    if (!messageText.startsWith('!')) return;

    console.log(`📨 Message reçu de ${message.from}: ${messageText}`);

    // Adapter le message au format CommandHandler
    const adaptedMessage = {
        key: {
            remoteJid: message.from,
            fromMe: message.fromMe,
            id: message.id._serialized
        },
        message: {
            conversation: messageText
        }
    };

    await CommandHandler.handleCommand(client, adaptedMessage);
});

console.log(`
╔════════════════════════════════════════╗
║                                        ║
║   🏴‍☠️  ONE PIECE: NOUVELLE ÈRE  🏴‍☠️    ║
║                                        ║
║     Bot WhatsApp RPG - v2.0.0          ║
║      (WhatsApp Web.js - Stable)        ║
║                                        ║
╚════════════════════════════════════════╝

⚓ Démarrage du bot...
`);

client.initialize().catch(err => {
    console.error('❌ Erreur fatale:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Exception non capturée:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Promesse rejetée:', err);
});