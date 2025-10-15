
class HakiSystem {
    constructor() {
        this.hakiTypes = {
            'Kenbunshoku': {
                emoji: '👁️',
                name: 'Haki de l\'Observation',
                minLevel: 10,
                description: 'Permet de sentir les présences et anticiper les attaques',
                bonus: { reflexe: 5, precision: 3 }
            },
            'Busoshoku': {
                emoji: '🛡️',
                name: 'Haki de l\'Armement',
                minLevel: 15,
                description: 'Renforce le corps et permet de toucher les Logia',
                bonus: { force: 5, endurance: 5 }
            },
            'Haoshoku': {
                emoji: '👑',
                name: 'Haki des Rois',
                minLevel: 20,
                description: 'Haki suprême qui intimide les faibles (RARE)',
                bonus: { force: 10, intelligence: 10 },
                rarity: 0.05 // 5% de chance
            }
        };
    }

    canUnlock(hakiType, level) {
        const haki = this.hakiTypes[hakiType];
        if (!haki) return { can: false, reason: 'Haki inconnu' };
        
        if (level < haki.minLevel) {
            return { 
                can: false, 
                reason: `Niveau ${haki.minLevel} requis (actuel: ${level})` 
            };
        }

        if (hakiType === 'Haoshoku' && Math.random() > haki.rarity) {
            return { 
                can: false, 
                reason: 'Vous n\'avez pas la volonté d\'un roi...' 
            };
        }

        return { can: true };
    }

    calculateHakiPower(hakiLevel, attribute) {
        return Math.floor(hakiLevel * 2 + attribute * 0.5);
    }

    getHakiList() {
        let list = '*═══ TYPES DE HAKI ═══*\n\n';
        
        Object.entries(this.hakiTypes).forEach(([key, haki]) => {
            list += `${haki.emoji} *${haki.name}*\n`;
            list += `   Niveau requis: ${haki.minLevel}\n`;
            list += `   ${haki.description}\n`;
            if (haki.rarity) {
                list += `   ⚠️ RARE - Chance: ${(haki.rarity * 100).toFixed(1)}%\n`;
            }
            list += '\n';
        });

        return list;
    }
}

export default new HakiSystem();
