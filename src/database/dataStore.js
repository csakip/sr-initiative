import Dexie from "dexie";
import { exportDB, importInto } from "dexie-export-import";

export let db = new Dexie("sr-initiative");

db.version(1).stores({
  characters: "++id, order",
  keyValues: "key",
});

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

export async function importCharacters(add) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.style.display = "none";
  input.onchange = (e) => {
    // if (!add) cleanupDb();
    const file = e.target.files[0];
    importInto(db, file, {
      clearTablesBeforeImport: !add,
      overwriteValues: !add,
      filter: (table) => !add || table === "characters",
      transform: (table, value, key) => {
        console.log(table, value, key);
        value.id = undefined;
        return { key, value };
      },
    }).then(() => {
      input.remove();
    });
  };
  document.body.appendChild(input);
  input.click();
}
