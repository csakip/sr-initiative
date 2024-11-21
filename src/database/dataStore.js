import Dexie from "dexie";
import { exportDB, importInto } from "dexie-export-import";

export let db = new Dexie("sr-initiative");

db.version(1).stores({
  characters: "++id, order",
});

console.log(db);

export function cleanupDb() {
  db.characters.clear();
}

export async function exportCharacters() {
  const blob = await exportDB(db, {
    filter: (table) => table === "characters",
  });
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
    db.characters.clear();
    const file = e.target.files[0];
    importInto(db, file, {
      filter: (table) => table === "characters",
    }).then(() => {
      input.remove();
      db.characters.count().then((count) => alert(`${count} karakter beolvasva.`));
      db.cloud.sync();
    });
  };
  document.body.appendChild(input);
  input.click();
}
