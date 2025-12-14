
import { createCanvas } from 'canvas';
import fs from 'fs-extra';
import path from 'path';

// Helper function to draw wrapped text
const drawText = (context, text, x, y, maxWidth, lineHeight) => {
    const lines = text.split('\n');
    for (const line of lines) {
        let words = line.split(' ');
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
            let testLine = currentLine + ' ' + words[i];
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth) {
                context.fillText(currentLine, x, y);
                y += lineHeight;
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        context.fillText(currentLine, x, y);
        y += lineHeight;
    }
    return y;
};


const createImageForRule = async (title, content, filePath) => {
    const width = 1080;
    const height = 1080;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Background
    context.fillStyle = '#23272A';
    context.fillRect(0, 0, width, height);

    // Title
    context.font = 'bold 50px Arial';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';
    context.fillText(title, width / 2, 100);

    // Separator line
    context.strokeStyle = '#FFFFFF';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(100, 140);
    context.lineTo(width - 100, 140);
    context.stroke();

    // Content
    context.font = '30px Arial';
    context.fillStyle = '#DDDDDD';
    context.textAlign = 'left';

    drawText(context, content, 100, 220, width - 200, 45);

    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(filePath, buffer);
};

const handleRules = async (client, sender, args, replyTo) => {
    await client.sendMessage(replyTo, { text: '📜 Un instant, je prépare les parchemins des règles...' });

    const rulesData = [
        {
            title: "SYSTÈME D’ATTRIBUTS",
            content: "Force (⚡): Puissance physique.\n+1 Force = +2% dégâts physiques.\n\n" +
                     "Vitesse (💨): Rapidité de déplacement et d'action.\n\n" +
                     "Endurance (🛡️): Résistance aux coups et à la fatigue.\n+1 Endurance = +5 points d’énergie.\n+10 Endurance = -10% dégâts reçus.\n\n" +
                     "Réflexe (👁️): Temps de réaction.\n\n" +
                     "Intelligence (🧠): Stratégie et maîtrise des techniques.\n+1 Intelligence = +1% maîtrise.\n+15 = Création de techniques.\n\n" +
                     "Précision (🎯): Justesse des attaques.\n+10 Précision = 5% coup critique."
        },
        {
            title: "NIVEAUX ET EXPÉRIENCE (XP)",
            content: "Gagnez de l'XP en combattant, en vous entraînant ou via des quêtes.\n\n" +
                     "Combat gagné: +100 XP\n" +
                     "Entraînement RP: +50 à +150 XP\n" +
                     "Quête secondaire: +100 à +300 XP\n" +
                     "Grande mission: +500 XP\n" +
                     "Événement ou boss: +1000 à +3000 XP\n\n" +
                     "Niveau 1 → 2: 100 XP\n" +
                     "Niveau 5 → 10: 1500 XP\n" +
                     "Niveau 10 → 15: 3000 XP (Débloque Haki Observation)\n" +
                     "Niveau 15 → 20: 4500 XP (Débloque Haki Armement)"
        },
        {
            title: "ÉNERGIE ET FATIGUE",
            content: "Chaque action consomme de l’énergie.\n" +
                     "Énergie totale = Endurance × 10\n\n" +
                     "Attaque basique: -2 énergie\n" +
                     "Esquive rapide: -4 énergie\n" +
                     "Technique spéciale: -10 énergie\n" +
                     "Coup ultime: -20 énergie\n\n" +
                     "Si énergie = 0: Vitesse -50%, attaques faibles.\n" +
                     "Repos RP: +10 énergie / min."
        },
        {
            title: "STYLES DE COMBAT (Niv 5+)",
            content: "Épéiste 🗡️: +15% Précision, +10% Réflexe\n" +
                     "Combattant 🥊: +20% Force, +10% Endurance\n" +
                     "Tireur 🔫: +20% Précision, +5% Intelligence\n" +
                     "Artiste Martial 💥: +10% Vitesse, +10% Réflexe\n" +
                     "Stratège 🧠: +15% Intelligence, +5% Endurance\n" +
                     "Fruit User 🍇: Pouvoir spécial mais -10% Endurance"
        },
        {
            title: "RACES JOUABLES",
            content: "Humain: +5 à un attribut au choix\n" +
                     "Homme-poisson: +10 Force, respiration aquatique\n" +
                     "Géant: +20 Force, -10 Vitesse\n" +
                     "Mink: +10 Vitesse, Electro\n" +
                     "Skypéien: +10 Réflexe, peut voler avec Dial\n" +
                     "Cyborg: +10 Endurance, pièces mécaniques"
        }
    ];

    for (const rule of rulesData) {
        const tempPath = path.join(process.cwd(), `rule_${Date.now()}.png`);
        try {
            await createImageForRule(rule.title, rule.content, tempPath);

            const imageBuffer = await fs.readFile(tempPath);
            await client.sendMessage(replyTo, {
                image: imageBuffer,
                caption: `📜 ${rule.title}`
            });

            await fs.unlink(tempPath);
        } catch (error) {
            console.error(`Erreur lors de la création de l'image de règle ${rule.title}:`, error);
            await client.sendMessage(replyTo, { text: `❌ Impossible de générer l'image pour "${rule.title}".` });
        }
    }
};

export default handleRules;
