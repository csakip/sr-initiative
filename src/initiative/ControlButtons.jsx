import { Nav } from "react-bootstrap";
import { useSimpleDialog } from "../common/SimpleDialog";
import { sortCharacters } from "../common/utils";
import { db, exportCharacters, importCharacters } from "../database/dataStore";
import { HelpText } from "../HelpText";

function ControlButtons({ setEditedCharacter, characters, newRound }) {
  const { openModal, closeModal, SimpleDialog } = useSimpleDialog();

  function startNewRound(increment = 1) {
    newRound(increment);
  }

  return (
    <div className='sidebar'>
      <Nav>
        {characters?.length > 0 && (
          <>
            <Nav.Link onClick={() => startNewRound()}>
              <i className='bi bi-arrow-clockwise'></i>
              <span>Köv. kör</span>
            </Nav.Link>
            <Nav.Link onClick={() => startNewRound(-1)}>
              <i className='bi bi-arrow-up'></i>
              <span>Vissza 1 kört</span>
            </Nav.Link>
            <Nav.Link onClick={() => sortCharacters(characters)}>
              <i className='bi bi-filter'></i>
              <span>Sorrendbe</span>
            </Nav.Link>
            <hr />
          </>
        )}
        <Nav.Link onClick={() => setEditedCharacter({ name: "", roll: "" })}>
          <i className='bi bi-person-plus'></i>
          <span>Új karakter</span>
        </Nav.Link>
        {characters?.length > 0 && (
          <>
            <Nav.Link
              onClick={() => {
                openModal({
                  open: true,
                  title: "Új harc indítása",
                  body: "Törlösz minden nem megtartott karaktert és a megtartottak kezdeményezését?",
                  cancelButton: "Mégse",
                  onClose: (ret) => {
                    if (ret) {
                      newRound();
                      db.characters.bulkDelete(
                        characters.filter((c) => !c.dontDelete).map((c) => c.id)
                      );
                      db.characters.toCollection().modify({ initiative: undefined });
                    }
                    closeModal();
                  },
                });
              }}>
              <i className='bi bi-flag'></i>
              <span>Új harc</span>
            </Nav.Link>
            <hr />
          </>
        )}
        <Nav.Link
          onClick={() => {
            openModal({
              size: "lg",
              open: true,
              title: "Shadowrun 4 kezdeményezés meséglet",
              body: <HelpText />,
            });
          }}>
          <i className='bi bi-question-circle'></i>
          <span>Súgó</span>
        </Nav.Link>
        {characters?.length > 0 && (
          <Nav.Link onClick={() => exportCharacters()}>
            <i className='bi bi-download'></i>
            <span>Mentés fájlba</span>
          </Nav.Link>
        )}
        <Nav.Link onClick={() => importCharacters()}>
          <i className='bi bi-upload'></i>
          <span>Betöltés fájlból</span>
        </Nav.Link>
      </Nav>
      <SimpleDialog />
    </div>
  );
}

export default ControlButtons;
