
import CommandHandler from '../CommandHandler.js';

const handleAttributes = async (client, sender, args, replyTo) => {
    const attributesText = `📊 *GUIDE DES ATTRIBUTS* 📊

*⚡ FORCE*
• Dégâts au corps à corps
• +2% dégâts par point
• +10 = soulever 200kg
• +20 = briser des roches

*💨 VITESSE*
• Rapidité de déplacement
• Niveau 5 = 8 m/s
• Niveau 10 = 12 m/s
• Niveau 20 = 25 m/s

*🛡️ ENDURANCE*
• Résistance physique
• +5 énergie par point
• +10 = -10% dégâts reçus
• +50 = résistance extrême

*👁️ RÉFLEXE*
• Temps de réaction
• +10 = 1.5s
• +15 = 1.0s
• +25 = 0.5s (Haki niveau)

*🧠 INTELLIGENCE*
• Maîtrise des techniques
• +1% maîtrise par point
• +15 = créer ses techniques
• +30 = contrôle Logia

*🎯 PRÉCISION*
• Justesse des attaques
• +10 = 5% coups critiques
• +20 = viser points faibles
• +30 = tir quasi-parfait

*═══════════════════════*`;

    await CommandHandler.sendMessage(client, replyTo, attributesText);
};

export default handleAttributes;
