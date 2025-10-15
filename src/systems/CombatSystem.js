import PlayerManager from './PlayerManager.js';

class CombatSystem {
    constructor() {
        this.activeCombats = new Map();
    }

    calculateDamage(attacker, defender, attackType = 'basic') {
        const baseDamage = attacker.attributes.force * 2;
        const precisionBonus = attacker.attributes.precision * 0.5;
        const intelligenceBonus = attacker.attributes.intelligence * 0.3;

        let totalDamage = baseDamage + precisionBonus + intelligenceBonus;

        if (attackType === 'special') {
            totalDamage *= 1.5;
        } else if (attackType === 'ultimate') {
            totalDamage *= 2.5;
        }

        const isCritical = Math.random() * 100 < (attacker.attributes.precision / 2);
        if (isCritical) {
            totalDamage *= 1.5;
        }

        const defenderEndurance = defender.attributes.endurance;
        const damageReduction = defenderEndurance * 0.1;
        totalDamage = Math.max(1, totalDamage - damageReduction);

        return {
            damage: Math.floor(totalDamage),
            isCritical,
            type: attackType
        };
    }

    canDodge(attacker, defender) {
        const attackerSpeed = attacker.attributes.vitesse;
        const defenderReflexe = defender.attributes.reflexe;
        const defenderSpeed = defender.attributes.vitesse;

        const dodgeChance = (defenderReflexe * 2 + defenderSpeed) - attackerSpeed;
        const finalDodgeChance = Math.max(5, Math.min(50, dodgeChance));

        return Math.random() * 100 < finalDodgeChance;
    }

    getReactionTime(reflexe) {
        if (reflexe >= 25) return 0.5;
        if (reflexe >= 20) return 0.7;
        if (reflexe >= 15) return 1.0;
        if (reflexe >= 10) return 1.5;
        if (reflexe >= 5) return 2.0;
        return 3.0;
    }

    getSpeedDescription(vitesse) {
        if (vitesse >= 30) return '⚡ Vitesse légendaire (30+ m/s)';
        if (vitesse >= 25) return '🌟 Vitesse élite (25 m/s)';
        if (vitesse >= 18) return '💨 Vitesse capitaine (18 m/s)';
        if (vitesse >= 12) return '🏃 Combattant expérimenté (12 m/s)';
        if (vitesse >= 8) return '🚶 Sprint athlétique (8 m/s)';
        return '👣 Course normale (5 m/s)';
    }

    simulateFight(player1, player2) {
        const results = [];
        let p1Energy = player1.currentEnergy;
        let p2Energy = player2.currentEnergy;

        let turn = 1;
        const maxTurns = 10;

        while (turn <= maxTurns && p1Energy > 0 && p2Energy > 0) {
            if (turn % 2 === 1) {
                const dodged = this.canDodge(player1, player2);
                if (dodged) {
                    results.push(`⚔️ Tour ${turn}: ${player2.name} esquive l'attaque de ${player1.name}!`);
                    p2Energy -= 4;
                } else {
                    const attackResult = this.calculateDamage(player1, player2);
                    const critText = attackResult.isCritical ? ' 💥 CRITIQUE!' : '';
                    results.push(`⚔️ Tour ${turn}: ${player1.name} inflige ${attackResult.damage} dégâts${critText}`);
                    p2Energy -= attackResult.damage;
                }
                p1Energy -= 2;
            } else {
                const dodged = this.canDodge(player2, player1);
                if (dodged) {
                    results.push(`⚔️ Tour ${turn}: ${player1.name} esquive l'attaque de ${player2.name}!`);
                    p1Energy -= 4;
                } else {
                    const attackResult = this.calculateDamage(player2, player1);
                    const critText = attackResult.isCritical ? ' 💥 CRITIQUE!' : '';
                    results.push(`⚔️ Tour ${turn}: ${player2.name} inflige ${attackResult.damage} dégâts${critText}`);
                    p1Energy -= attackResult.damage;
                }
                p2Energy -= 2;
            }

            if (p1Energy <= 0 || p2Energy <= 0) break;
            turn++;
        }

        let winner, loser;
        if (p1Energy > p2Energy) {
            winner = player1;
            loser = player2;
        } else {
            winner = player2;
            loser = player1;
        }

        results.push('');
        results.push(`🏆 *${winner.name}* remporte le combat!`);
        results.push(`Énergie restante: ${Math.max(0, winner === player1 ? p1Energy : p2Energy)}`);

        return {
            winner,
            loser,
            results: results.join('\n'),
            xpGained: 100
        };
    }

    getEnergyCost(actionType) {
        const costs = {
            basic: 2,
            dodge: 4,
            special: 10,
            ultimate: 20,
            defense: 5
        };
        return costs[actionType] || 2;
    }
}

export default new CombatSystem();
