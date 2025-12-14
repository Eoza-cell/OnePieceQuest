
import PlayerManager from './PlayerManager.js';
import BossSystem from './BossSystem.js';

class CombatSystem {
    constructor() {
        this.activeCombats = new Map();
    }

    startBossFight(playerId, bossId) {
        const player = PlayerManager.getPlayer(playerId);
        const boss = { ...BossSystem.getBoss(bossId) }; // Deep copy to avoid modifying the original

        if (!player || !boss) {
            return { error: 'Player or boss not found.' };
        }

        const combatId = `boss-${playerId}-${Date.now()}`;
        this.activeCombats.set(combatId, {
            player,
            boss,
            bossId, // Store the original bossId
            turn: 1,
            log: [`*Le combat contre ${boss.name} commence !*`],
        });

        return { combatId };
    }

    handlePlayerAction(combatId, actionText) {
        const combat = this.activeCombats.get(combatId);
        if (!combat) return { error: 'Combat not found.' };

        const { player, boss } = combat;

        // --- Player's Turn ---
        let playerDamage = 0;
        let playerActionLog = '';
        let action = 'attack'; // Default action

        if (actionText.includes('esquive') || actionText.includes('dodge')) {
            action = 'dodge';
        }

        if (action === 'attack') {
            playerDamage = Math.max(1, player.attributes.force * 2 - boss.stats.defense);
            player.currentEnergy -= 5;
            playerActionLog = `${player.name} attaque et inflige ${playerDamage} dégâts !`;
        } else if (action === 'dodge') {
            player.currentEnergy -= 8;
            playerActionLog = `${player.name} se prépare à esquiver !`;
        }

        boss.stats.health -= playerDamage;
        combat.log.push(playerActionLog);

        if (boss.stats.health <= 0) {
            return this.endCombat(combatId, player, boss);
        }

        // --- Boss's Turn ---
        const bossAction = boss.actions[Math.floor(Math.random() * boss.actions.length)];
        let bossDamage = 0;
        let bossActionLog = '';
        let wasDodged = false;

        if (bossAction.type === 'attack') {
            if (action === 'dodge' && Math.random() < (player.attributes.vitesse / 100)) {
                wasDodged = true;
                bossActionLog = `${player.name} esquive de justesse l'attaque *${bossAction.name}* !`;
            } else {
                bossDamage = Math.max(1, bossAction.damageMultiplier * boss.stats.attack - player.attributes.endurance);
                bossActionLog = `${boss.name} utilise *${bossAction.name}* et inflige ${bossDamage} dégâts !`;
            }
        } else if (bossAction.type === 'defense') {
            boss.stats.defense += bossAction.defenseBoost;
            bossActionLog = `${boss.name} utilise *${bossAction.name}* et augmente sa défense !`;
        }

        if (!wasDodged) {
            player.currentEnergy -= bossDamage;
        }

        combat.log.push(bossActionLog);

        if (player.currentEnergy <= 0) {
            return this.endCombat(combatId, boss, player);
        }

        combat.turn++;
        return { combatState: combat };
    }

    endCombat(combatId, winner, loser) {
        this.activeCombats.delete(combatId);
        const isPlayerWinner = winner.hasOwnProperty('phoneNumber');

        let loot = null;
        if (isPlayerWinner) {
            const boss = loser;
            loot = [];
            for (const item of boss.lootTable) {
                if (Math.random() < item.chance) {
                    loot.push(item);
                    winner.inventory.push(item);
                }
            }
            PlayerManager.updatePlayer(winner.phoneNumber, { inventory: winner.inventory });
        }

        return {
            winner,
            loser,
            isPlayerWinner,
            loot,
        };
    }

    getCombat(combatId) {
        return this.activeCombats.get(combatId);
    }

    getSpeedDescription(vitesse) {
        if (vitesse >= 30) return '⚡ Vitesse légendaire (30+ m/s)';
        if (vitesse >= 25) return '🌟 Vitesse élite (25 m/s)';
        if (vitesse >= 18) return '💨 Vitesse capitaine (18 m/s)';
        if (vitesse >= 12) return '🏃 Combattant expérimenté (12 m/s)';
        if (vitesse >= 8) return '🚶 Sprint athlétique (8 m/s)';
        return '👣 Course normale (5 m/s)';
    }

    getReactionTime(reflexe) {
        if (reflexe >= 25) return 0.5;
        if (reflexe >= 20) return 0.7;
        if (reflexe >= 15) return 1.0;
        if (reflexe >= 10) return 1.5;
        if (reflexe >= 5) return 2.0;
        return 3.0;
    }

    simulateFight(player1, player2) {
        const results = [];
        let p1Energy = player1.currentEnergy;
        let p2Energy = player2.currentEnergy;

        let turn = 1;
        const maxTurns = 20; // Increased for more dynamic fights

        const calculateDodgeChance = (attacker, defender) => {
            const speedDiff = defender.attributes.vitesse - attacker.attributes.vitesse;
            const reflexBonus = defender.attributes.reflexe * 0.01;
            // Base dodge chance of 5%, plus bonuses. Max 75%.
            return Math.max(0.05, Math.min(0.75, 0.05 + (speedDiff * 0.02) + reflexBonus));
        };

        const calculateCritChance = (attacker) => {
            // 5% chance per 10 precision points.
            return (attacker.attributes.precision / 10) * 0.05;
        };

        const calculateDamage = (attacker, defender, isCrit) => {
            const baseDamage = attacker.attributes.force * (1 + (attacker.attributes.force * 0.02));
            const defenseReduction = 1 - (defender.attributes.endurance / 100); // 1% reduction per endurance point
            let damage = Math.max(1, baseDamage * defenseReduction);
            if (isCrit) {
                damage *= 1.5; // Critical hits do 50% more damage
                results.push(`💥 *COUP CRITIQUE!*`);
            }
            return Math.floor(damage);
        };

        const performAttack = (attacker, defender, currentDefenderEnergy) => {
            const dodgeChance = calculateDodgeChance(attacker, defender);
            if (Math.random() < dodgeChance) {
                results.push(`💨 ${defender.name} esquive l'attaque de ${attacker.name}!`);
                return currentDefenderEnergy - 4; // Dodge costs energy
            }

            const critChance = calculateCritChance(attacker);
            const isCrit = Math.random() < critChance;
            const damage = calculateDamage(attacker, defender, isCrit);

            results.push(`⚔️ ${attacker.name} inflige ${damage} dégâts à ${defender.name}.`);
            return currentDefenderEnergy - damage;
        };

        while (turn <= maxTurns && p1Energy > 0 && p2Energy > 0) {
            results.push(`\n*— Tour ${turn} —*`);

            // Player 1 attacks Player 2
            p2Energy = performAttack(player1, player2, p2Energy);
            if (p2Energy <= 0) break;

            // Player 2 attacks Player 1
            p1Energy = performAttack(player2, player1, p1Energy);
            if (p1Energy <= 0) break;

            // Energy cost per turn
            p1Energy -= 2;
            p2Energy -= 2;

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

        // Ensure energy doesn't go below zero in the final report
        p1Energy = Math.max(0, p1Energy);
        p2Energy = Math.max(0, p2Energy);
        results.push(`Énergie restante: ${winner.name} (${p1Energy}) | ${loser.name} (${p2Energy})`);

        return {
            winner,
            loser,
            results: results.join('\n'),
            xpGained: 100
        };
    }
}

export default new CombatSystem();
