class ZoneSystem {
    constructor() {
        this.zones = {
            'East Blue': {
                name: 'East Blue',
                emoji: '🌊',
                minLevel: 1,
                maxLevel: 10,
                description: 'La mer la plus paisible. Zone d\'apprentissage pour nouveaux pirates.',
                dangers: 'Pirates faibles, Marines de base',
                rewards: 'Berrys faibles, XP d\'apprentissage'
            },
            'Grand Line': {
                name: 'Grand Line',
                emoji: '🌪️',
                minLevel: 10,
                maxLevel: 25,
                description: 'La mer des dangers. Climat imprévisible et ennemis puissants.',
                dangers: 'Pirates expérimentés, Vice-Amiraux, climats extrêmes',
                rewards: 'Berrys moyens, techniques avancées, Haki'
            },
            'Nouveau Monde': {
                name: 'Nouveau Monde',
                emoji: '⚡',
                minLevel: 25,
                maxLevel: 50,
                description: 'La seconde moitié de Grand Line. Seuls les plus forts survivent.',
                dangers: 'Supernovas, Commandants Yonko, Amiraux',
                rewards: 'Berrys élevés, Fruits rares, techniques ultimes'
            },
            'Eaux Interdites': {
                name: 'Eaux Interdites',
                emoji: '🌀',
                minLevel: 50,
                maxLevel: 999,
                description: 'Territoires mythiques où règnent les légendes.',
                dangers: 'Yonko, Fleet Admiral, créatures légendaires',
                rewards: 'Trésors mythiques, Haki Royal, gloire éternelle'
            }
        };
    }

    getZone(zoneName) {
        return this.zones[zoneName];
    }

    getAllZones() {
        return Object.values(this.zones);
    }

    canAccessZone(playerLevel, zoneName) {
        const zone = this.getZone(zoneName);
        if (!zone) return { access: false, reason: 'Zone inconnue' };

        if (playerLevel < zone.minLevel) {
            return {
                access: false,
                reason: `Niveau ${zone.minLevel} requis pour accéder à ${zoneName}`
            };
        }

        return { access: true };
    }

    getZonesList() {
        return Object.values(this.zones).map((zone, index) => {
            return `${index + 1}. ${zone.emoji} *${zone.name}* (Niv. ${zone.minLevel}-${zone.maxLevel})\n   ${zone.description}\n   ⚠️ Dangers: ${zone.dangers}\n   🎁 Récompenses: ${zone.rewards}`;
        }).join('\n\n');
    }

    getRecommendedZone(playerLevel) {
        for (const zone of Object.values(this.zones)) {
            if (playerLevel >= zone.minLevel && playerLevel <= zone.maxLevel) {
                return zone;
            }
        }
        return this.zones['East Blue'];
    }
}

module.exports = new ZoneSystem();
