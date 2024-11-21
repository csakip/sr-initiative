export function format(numberOfDice) {
  if (numberOfDice === null || numberOfDice === undefined || isNaN(numberOfDice)) return "";
  if (!Number.isInteger(numberOfDice)) {
    return "-";
  }
  if (numberOfDice < 0) return "-";
  return `${numberOfDice}`;
}

export function roll(numberOfDice) {
  let k = numberOfDice;
  if (typeof numberOfDice === "string" && numberOfDice.endsWith("d"))
    k = Math.floor(parseInt(numberOfDice));
  const result = { rolls: [], hits: 0, glitch: false };
  if (k < 0) return null;
  for (let i = 0; i < k; i++) {
    const rolled = d6();
    result.rolls.push(rolled);
    if (rolled >= 5) result.hits++;
  }

  result.glitch = result.rolls.filter((r) => r === 1).length >= numberOfDice / 2;

  return result;
}

function d6() {
  return Math.floor(Math.random() * 6) + 1;
}
