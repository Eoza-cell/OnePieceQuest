
class BossSystem {
    constructor() {
        this.bosses = {
            'vice-admiral-kaito': {
                name: 'Vice-Admiral "Iron Fist" Kaito',
                description: 'A corrupt Marine Vice-Admiral known for his ruthless tactics.',
                stats: {
                    health: 5000,
                    attack: 250,
                    defense: 150,
                },
                actions: [
                    { name: 'Iron Fist Meteor', type: 'attack', damageMultiplier: 2.5, cost: 50 },
                    { name: 'Justice Barrage', type: 'attack', damageMultiplier: 1.2, cost: 20 },
                    { name: 'Armament: Hardening', type: 'defense', defenseBoost: 100, cost: 30 },
                ],
                lootTable: [
                    { name: "Kaito's Gauntlet", chance: 0.1 },
                    { name: 'Marine Commendation', chance: 0.5 },
                    { name: 'Berrys', chance: 1.0, amount: 10000 },
                ],
            },
            'sea-king-azure-fang': {
                name: 'Sea King "Azure Fang"',
                description: 'A colossal Sea King that terrorizes the Grand Line.',
                stats: {
                    health: 8000,
                    attack: 350,
                    defense: 100,
                },
                actions: [
                    { name: 'Tidal Wave', type: 'attack', damageMultiplier: 1.8, cost: 60 },
                    { name: 'Azure Fang Crush', type: 'attack', damageMultiplier: 2.2, cost: 40 },
                    { name: 'Deep Dive', type: 'defense', defenseBoost: 200, cost: 20 },
                ],
                lootTable: [
                    { name: 'Azure Fang Scale', chance: 0.1 },
                    { name: 'Sea King Meat', chance: 0.5 },
                    { name: 'Berrys', chance: 1.0, amount: 15000 },
                ],
            },
        };
    }

    getBoss(bossId) {
        return this.bosses[bossId];
    }

    getBossList() {
        return Object.keys(this.bosses).map(bossId => {
            const boss = this.bosses[bossId];
            return `*${boss.name}* - ${boss.description}`;
        }).join('\n');
    }
}

export default new BossSystem();
