import { db } from "../database/dataStore";
// import { roll } from "../dice";

export function updateCharacters(chars) {
  if (!chars) return;
  db.characters.bulkUpdate(chars.map((c) => ({ key: c.id, changes: { ...c } })));
}

export function sortCharacters(chars) {
  const newOrder = [...chars].sort(
    (a, b) => (b.initiative?.value || 0) - (a.initiative?.value || 0)
  );
  newOrder.forEach((c, i) => {
    c.order = i;
  });
  updateCharacters(newOrder);
}

export function setInitiative(id, value, characters) {
  characters.forEach((character) => {
    if (character.id === id) {
      character.initiative = { value, rolls: ["no"] };
    }
  });
  sortCharacters(characters);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function fuzzyMatch(pattern, str) {
  pattern =
    ".*" +
    pattern
      .toLowerCase()
      .split("")
      .map((l) => `${escapeRegExp(l)}.*`)
      .join("");
  const re = new RegExp(pattern);
  return re.test(str.toLowerCase());
}
