import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PlayerManager {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data/players.json');
        this.players = {};
        this.loadPlayers();
    }

    async loadPlayers() {
        try {
            await fs.ensureDir(path.dirname(this.dataPath));
            if (await fs.pathExists(this.dataPath)) {
                this.players = await fs.readJson(this.dataPath);
            } else {
                this.players = {};
                await this.savePlayers();
            }
        } catch (error) {
            console.error('Erreur chargement joueurs:', error);
            this.players = {};
        }
    }

    async savePlayers() {
        try {
            await fs.writeJson(this.dataPath, this.players, { spaces: 2 });
        } catch (error) {
            console.error('Erreur sauvegarde joueurs:', error);
        }
    }

    getPlayer(phoneNumber) {
        return this.players[phoneNumber];
    }

    async createPlayer(phoneNumber, name, race) {
        const baseAttributes = {
            force: 10,
            vitesse: 5,
            endurance: 10,
            reflexe: 5,
            intelligence: 10,
            precision: 5
        };

        const player = {
            phoneNumber,
            name,
            race,
            level: 1,
            xp: 0,
            attributes: baseAttributes,
            maxEnergy: baseAttributes.endurance * 10,
            currentEnergy: baseAttributes.endurance * 10,
            berrys: 1000,
            zone: 'East Blue',
            reputation: 0,
            alignment: 'Civil',
            style: null,
            inventory: [],
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            lastEnergyRegen: Date.now(),
            trainingCount: {
                force: 0,
                vitesse: 0,
                intelligence: 0,
                reflexe: 0
            }
        };

        this.players[phoneNumber] = player;
        await this.savePlayers();
        return player;
    }

    async updatePlayer(phoneNumber, updates) {
        if (this.players[phoneNumber]) {
            this.players[phoneNumber] = { ...this.players[phoneNumber], ...updates };
            await this.savePlayers();
            return this.players[phoneNumber];
        }
        return null;
    }

    async regenerateEnergy(phoneNumber) {
        const player = this.getPlayer(phoneNumber);
        if (!player) return;

        const now = Date.now();
        const timePassed = Math.floor((now - player.lastEnergyRegen) / 60000);
        
        if (timePassed > 0) {
            const regenAmount = timePassed * 10;
            player.currentEnergy = Math.min(player.maxEnergy, player.currentEnergy + regenAmount);
            player.lastEnergyRegen = now;
            await this.savePlayers();
        }
    }

    async consumeEnergy(phoneNumber, amount) {
        const player = this.getPlayer(phoneNumber);
        if (!player) return false;

        if (player.currentEnergy >= amount) {
            player.currentEnergy -= amount;
            await this.savePlayers();
            return true;
        }
        return false;
    }

    async addXP(phoneNumber, xpAmount) {
        const player = this.getPlayer(phoneNumber);
        if (!player) return null;

        player.xp += xpAmount;
        
        const xpNeeded = this.getXPForLevel(player.level + 1);
        const leveledUp = player.xp >= xpNeeded;

        if (leveledUp) {
            player.level += 1;
            player.xp -= xpNeeded;
            await this.savePlayers();
            return { leveledUp: true, newLevel: player.level, pointsToDistribute: 10 };
        }

        await this.savePlayers();
        return { leveledUp: false, currentXP: player.xp, xpNeeded };
    }

    getXPForLevel(level) {
        const xpTable = {
            2: 100,
            3: 200,
            4: 300,
            5: 400,
            6: 600,
            7: 800,
            8: 1000,
            9: 1200,
            10: 1500,
            11: 1800,
            12: 2100,
            13: 2400,
            14: 2700,
            15: 3000
        };

        if (xpTable[level]) return xpTable[level];
        if (level > 15 && level <= 20) return 3000 + (level - 15) * 500;
        return 4500 + (level - 20) * 1000;
    }

    async addBerrys(phoneNumber, amount) {
        const player = this.getPlayer(phoneNumber);
        if (!player) return false;

        player.berrys += amount;
        await this.savePlayers();
        return true;
    }

    async incrementTraining(phoneNumber, attributeType) {
        const player = this.getPlayer(phoneNumber);
        if (!player) return null;

        player.trainingCount[attributeType] += 1;

        const trainingNeeded = {
            force: 3,
            vitesse: 5,
            intelligence: 3,
            reflexe: 2
        };

        const needed = trainingNeeded[attributeType];
        if (player.trainingCount[attributeType] >= needed) {
            player.trainingCount[attributeType] = 0;
            player.attributes[attributeType] += 1;
            
            if (attributeType === 'endurance') {
                player.maxEnergy = player.attributes.endurance * 10;
            }

            await this.savePlayers();
            return { leveledUp: true, newValue: player.attributes[attributeType] };
        }

        await this.savePlayers();
        return { 
            leveledUp: false, 
            current: player.trainingCount[attributeType], 
            needed 
        };
    }
}

export default new PlayerManager();
