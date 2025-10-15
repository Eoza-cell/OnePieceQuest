class RaceSystem {
    constructor() {
        this.races = {
            'Humain': {
                name: 'Humain',
                emoji: '👤',
                bonus: { choix: 5 },
                description: 'Race équilibrée. +5 à un attribut au choix',
                special: 'Adaptabilité'
            },
            'Homme-poisson': {
                name: 'Homme-poisson',
                emoji: '🐟',
                bonus: { force: 10 },
                description: '+10 Force, respiration aquatique',
                special: 'Maître des mers'
            },
            'Géant': {
                name: 'Géant',
                emoji: '🗿',
                bonus: { force: 20, vitesse: -10 },
                description: '+20 Force, -10 Vitesse',
                special: 'Titan naturel'
            },
            'Mink': {
                name: 'Mink',
                emoji: '🐺',
                bonus: { vitesse: 10 },
                description: '+10 Vitesse, Electro',
                special: 'Sens animaux développés'
            },
            'Skypéien': {
                name: 'Skypéien',
                emoji: '☁️',
                bonus: { reflexe: 10 },
                description: '+10 Réflexe, peut voler avec Dial',
                special: 'Habitant des îles célestes'
            },
            'Cyborg': {
                name: 'Cyborg',
                emoji: '🤖',
                bonus: { endurance: 10 },
                description: '+10 Endurance, pièces mécaniques',
                special: 'Mi-homme, mi-machine'
            }
        };
    }

    getRace(raceName) {
        return this.races[raceName];
    }

    getAllRaces() {
        return Object.values(this.races);
    }

    getRacesList() {
        return Object.keys(this.races).map((key, index) => {
            const race = this.races[key];
            let bonusText = '';
            if (race.bonus.choix) {
                bonusText = `+${race.bonus.choix} à un attribut au choix`;
            } else {
                const bonuses = Object.entries(race.bonus)
                    .map(([attr, val]) => `${val > 0 ? '+' : ''}${val} ${attr}`)
                    .join(', ');
                bonusText = bonuses;
            }
            return `${index + 1}. ${race.emoji} *${race.name}*\n   ${bonusText}\n   ${race.description}`;
        }).join('\n\n');
    }

    applyRaceBonus(attributes, raceName) {
        const race = this.getRace(raceName);
        if (!race) return attributes;

        const newAttributes = { ...attributes };
        
        for (const [attr, bonus] of Object.entries(race.bonus)) {
            if (attr !== 'choix' && newAttributes[attr] !== undefined) {
                newAttributes[attr] += bonus;
            }
        }

        return newAttributes;
    }
}

export default new RaceSystem();
