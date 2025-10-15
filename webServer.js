
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WebServer {
    constructor() {
        this.app = express();
        this.port = 5000;
        this.logs = [];
        this.botStatus = {
            connected: false,
            players: 0,
            messages: 0,
            qrCode: null
        };
        
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    setupRoutes() {
        // Page principale
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // API: Statut du bot
        this.app.get('/api/status', (req, res) => {
            res.json(this.botStatus);
        });

        // API: QR Code
        this.app.get('/api/qr', (req, res) => {
            res.json({ qr: this.botStatus.qrCode });
        });

        // API: Logs
        this.app.get('/api/logs', (req, res) => {
            res.json({ logs: this.logs.slice(-50) }); // Derniers 50 logs
        });

        // API: Statistiques des joueurs
        this.app.get('/api/players', async (req, res) => {
            try {
                const playersData = await fs.readJson('./data/players.json').catch(() => ({ players: {} }));
                const players = Object.values(playersData.players || {});
                
                res.json({
                    total: players.length,
                    players: players.map(p => ({
                        name: p.name,
                        race: p.race,
                        level: p.level,
                        zone: p.zone
                    }))
                });
            } catch (error) {
                res.json({ total: 0, players: [] });
            }
        });
    }

    // Méthodes pour mettre à jour le statut
    updateStatus(connected) {
        this.botStatus.connected = connected;
        this.addLog(connected ? '✅ Bot connecté à WhatsApp' : '❌ Bot déconnecté');
    }

    setQRCode(qrCode) {
        this.botStatus.qrCode = qrCode;
        this.addLog('📱 Nouveau QR code généré');
    }

    incrementMessages() {
        this.botStatus.messages++;
    }

    async updatePlayerCount() {
        try {
            const playersData = await fs.readJson('./data/players.json').catch(() => ({ players: {} }));
            this.botStatus.players = Object.keys(playersData.players || {}).length;
        } catch (error) {
            this.botStatus.players = 0;
        }
    }

    addLog(message) {
        const timestamp = new Date().toLocaleTimeString('fr-FR');
        this.logs.push(`[${timestamp}] ${message}`);
        
        // Garder seulement les 100 derniers logs
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(-100);
        }
    }

    start() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`\n🌐 Interface web disponible sur: http://0.0.0.0:${this.port}`);
            this.addLog(`🚀 Serveur web démarré sur le port ${this.port}`);
        });
    }
}

export default WebServer;
