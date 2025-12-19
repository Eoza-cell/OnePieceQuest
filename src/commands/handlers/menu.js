
import CommandHandler from '../CommandHandler.js';

const handleMenu = async (client, sender, args, replyTo) => {
    const menuText = `🏴‍☠️ *ONE PIECE: NOUVELLE ÈRE* 🏴‍☠️

*═══ COMMANDES PRINCIPALES ═══*

📋 *Général*
${CommandHandler.prefix}menu - Affiche ce menu
${CommandHandler.prefix}aide - Aide détaillée
${CommandHandler.prefix}regles - Règles du jeu

👤 *Personnage*
${CommandHandler.prefix}start - Démarrer l'aventure
${CommandHandler.prefix}creer [nom] [race] - Créer personnage
${CommandHandler.prefix}profil - Voir son profil
${CommandHandler.prefix}stats - Statistiques

🍎 *Fruits du Démon*
${CommandHandler.prefix}fruits - Liste des fruits
${CommandHandler.prefix}manger [fruit] - Manger un fruit

⚡ *Haki*
${CommandHandler.prefix}haki - Types de Haki
${CommandHandler.prefix}debloquer [type] - Débloquer Haki

⚓ *Équipages*
${CommandHandler.prefix}equipage - Voir son équipage
${CommandHandler.prefix}creerequipage [nom] - Créer équipage
${CommandHandler.prefix}rejoindre [id] - Rejoindre équipage
${CommandHandler.prefix}quitter - Quitter équipage

🌍 *Actions*
${CommandHandler.prefix}voyage [zone] - Voyager
${CommandHandler.prefix}entrainement [attribut] - S'entraîner
${CommandHandler.prefix}combat [@joueur] - Combattre
${CommandHandler.prefix}boss [fight|list] [boss-name] - Combattre un boss

📚 *Infos*
${CommandHandler.prefix}races - Races disponibles
${CommandHandler.prefix}zones - Zones du monde
${CommandHandler.prefix}attributs - Guide attributs

*═══════════════════════*

_La volonté forge les légendes!_ 🏴‍☠️`;

    await CommandHandler.sendMessage(client, replyTo, menuText);
};

export default handleMenu;
