import Dexie from "dexie";
import { exportDB, importInto } from "dexie-export-import";

export let db = new Dexie("sr-initiative");

db.version(1).stores({
  characters: "++id, order",
  keyValues: "key",
});

console.log(db);

export function cleanupDb() {
  db.characters.clear();
  db.keyValues.clear();
}

export function saveKeyValue(key, value) {
  db.keyValues.put({ key, value });
}

export async function exportCharacters() {
  const blob = await exportDB(db);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sr-initiative-characters.json";
  link.click();
}

export async function importCharacters() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.style.display = "none";
  input.onchange = (e) => {
    cleanupDb();
    const file = e.target.files[0];
    importInto(db, file).then(() => {
      input.remove();
      db.characters.count().then((count) => alert(`${count} karakter beolvasva.`));
    });
  };
  document.body.appendChild(input);
  input.click();
}
