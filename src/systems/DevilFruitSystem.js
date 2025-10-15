
class DevilFruitSystem {
    constructor() {
        this.fruits = {
            // PARAMECIA
            'Gomu Gomu no Mi': {
                type: 'Paramecia',
                emoji: '🫐',
                description: 'Transforme le corps en caoutchouc',
                power: 85,
                abilities: ['Immunité foudre', 'Élasticité extrême'],
                weakness: 'Tranchant',
                masteryBonus: { force: 10, endurance: 8 }
            },
            'Bara Bara no Mi': {
                type: 'Paramecia',
                emoji: '🔪',
                description: 'Permet de séparer son corps en morceaux',
                power: 65,
                abilities: ['Immunité tranchant', 'Vol partiel'],
                weakness: 'Contondant',
                masteryBonus: { reflexe: 12, vitesse: 8 }
            },
            'Mera Mera no Mi': {
                type: 'Logia',
                emoji: '🔥',
                description: 'Contrôle et devient du feu',
                power: 95,
                abilities: ['Intangibilité', 'Contrôle flammes', 'Vol'],
                weakness: 'Eau, Granit marin',
                masteryBonus: { force: 15, intelligence: 10 }
            },
            'Hie Hie no Mi': {
                type: 'Logia',
                emoji: '❄️',
                description: 'Contrôle et devient de la glace',
                power: 95,
                abilities: ['Intangibilité', 'Congélation', 'Création glace'],
                weakness: 'Feu, Granit marin',
                masteryBonus: { force: 12, intelligence: 13 }
            },
            'Goro Goro no Mi': {
                type: 'Logia',
                emoji: '⚡',
                description: 'Contrôle et devient de la foudre',
                power: 100,
                abilities: ['Intangibilité', 'Vitesse lumière', 'Électrocution'],
                weakness: 'Caoutchouc, Granit marin',
                masteryBonus: { vitesse: 20, precision: 15 }
            },
            'Ushi Ushi no Mi Model: Bison': {
                type: 'Zoan',
                emoji: '🦬',
                description: 'Transformation en bison',
                power: 70,
                abilities: ['Force brute', 'Forme hybride', 'Endurance'],
                weakness: 'Ranged',
                masteryBonus: { force: 15, endurance: 10 }
            },
            'Tori Tori no Mi Model: Phoenix': {
                type: 'Zoan Mythique',
                emoji: '🦅',
                description: 'Transformation en phénix',
                power: 98,
                abilities: ['Vol', 'Régénération', 'Flammes bleues'],
                weakness: 'Granit marin',
                masteryBonus: { endurance: 20, intelligence: 10 }
            }
        };
    }

    getFruit(name) {
        return this.fruits[name] || null;
    }

    getAllFruits() {
        return Object.entries(this.fruits).map(([name, data]) => ({
            name,
            ...data
        }));
    }

    getFruitsByType(type) {
        return this.getAllFruits().filter(f => f.type === type || f.type.includes(type));
    }

    calculateMastery(intelligence, level) {
        return Math.min(100, (intelligence * 2) + (level * 3));
    }

    canAwaken(mastery, level) {
        return mastery >= 80 && level >= 50;
    }

    getFruitsList() {
        let list = '*═══ FRUITS DU DÉMON ═══*\n\n';
        
        const paramecia = this.getFruitsByType('Paramecia');
        list += '🫐 *PARAMECIA*\n';
        paramecia.forEach(f => {
            list += `${f.emoji} ${f.name}\n`;
            list += `   ${f.description}\n`;
            list += `   Pouvoir: ${f.power}/100\n\n`;
        });

        const logia = this.getFruitsByType('Logia');
        list += '🌊 *LOGIA*\n';
        logia.forEach(f => {
            list += `${f.emoji} ${f.name}\n`;
            list += `   ${f.description}\n`;
            list += `   Pouvoir: ${f.power}/100\n\n`;
        });

        const zoan = this.getFruitsByType('Zoan');
        list += '🦁 *ZOAN*\n';
        zoan.forEach(f => {
            list += `${f.emoji} ${f.name}\n`;
            list += `   ${f.description}\n`;
            list += `   Pouvoir: ${f.power}/100\n\n`;
        });

        return list;
    }
}

export default new DevilFruitSystem();
