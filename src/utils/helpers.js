
const generateHealthBar = (current, max) => {
    const percentage = (current / max) * 100;
    const filledCount = Math.round(percentage / 10);
    const emptyCount = 10 - filledCount;

    const filled = '▰'.repeat(filledCount);
    const empty = '▱'.repeat(emptyCount);

    return `${filled}${empty} (${current}/${max})`;
};

export { generateHealthBar };
