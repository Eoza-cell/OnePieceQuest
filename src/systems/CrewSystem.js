
import PlayerManager from './PlayerManager.js';

class CrewSystem {
    constructor() {
        this.crews = {};
    }

    createCrew(captainId, crewName) {
        if (this.getPlayerCrew(captainId)) {
            return { success: false, reason: 'Vous êtes déjà dans un équipage' };
        }

        const crewId = `crew_${Date.now()}`;
        this.crews[crewId] = {
            id: crewId,
            name: crewName,
            captain: captainId,
            members: [captainId],
            treasury: 0,
            reputation: 0,
            createdAt: new Date().toISOString()
        };

        return { success: true, crew: this.crews[crewId] };
    }

    joinCrew(crewId, playerId) {
        const crew = this.crews[crewId];
        if (!crew) return { success: false, reason: 'Équipage introuvable' };
        
        if (this.getPlayerCrew(playerId)) {
            return { success: false, reason: 'Déjà dans un équipage' };
        }

        crew.members.push(playerId);
        return { success: true };
    }

    leaveCrew(playerId) {
        const crew = this.getPlayerCrew(playerId);
        if (!crew) return { success: false, reason: 'Pas dans un équipage' };

        if (crew.captain === playerId) {
            delete this.crews[crew.id];
            return { success: true, disbanded: true };
        }

        crew.members = crew.members.filter(id => id !== playerId);
        return { success: true };
    }

    getPlayerCrew(playerId) {
        return Object.values(this.crews).find(crew => 
            crew.members.includes(playerId)
        );
    }

    addToTreasury(crewId, amount) {
        if (this.crews[crewId]) {
            this.crews[crewId].treasury += amount;
        }
    }
}

export default new CrewSystem();
