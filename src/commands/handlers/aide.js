
import CommandHandler from '../CommandHandler.js';

const handleHelp = async (client, sender, args, replyTo) => {
    const helpText = `📖 *GUIDE D'AIDE* 📖

*═══ COMMANDES DE BASE ═══*

${CommandHandler.prefix}start - Commencer l'aventure
${CommandHandler.prefix}menu - Menu principal
${CommandHandler.prefix}creer [nom] [race] - Créer un personnage
${CommandHandler.prefix}profil - Voir son profil
${CommandHandler.prefix}stats - Statistiques détaillées

*═══ EXPLORATION ═══*

${CommandHandler.prefix}zones - Liste des zones
${CommandHandler.prefix}voyage [zone] - Voyager
${CommandHandler.prefix}entrainement [attribut] - S'entraîner

*═══ INFORMATIONS ═══*

${CommandHandler.prefix}races - Races disponibles
${CommandHandler.prefix}regles - Règles du jeu
${CommandHandler.prefix}attributs - Explication attributs

*═══════════════════════*

Pour toute question, relisez les règles!`;

    await CommandHandler.sendMessage(client, replyTo, helpText);
};

export default handleHelp;
