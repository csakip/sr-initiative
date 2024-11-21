import { ButtonGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSimpleDialog } from "../common/SimpleDialog";
import { sortCharacters } from "../common/utils";
import { db } from "../database/dataStore";

function ControlButtons({ setEditedCharacter, characters, newRound }) {
  const { openModal, closeModal, SimpleDialog } = useSimpleDialog();

  function startNewRound(increment = 1) {
    newRound(increment);
  }

  return (
    <>
      <div className='scrollable-menu buttons d-flex flex-column'>
        {characters?.length > 0 && (
          <>
            <Button size='sm' variant='secondary' onClick={() => sortCharacters(characters)}>
              Sorrendbe
            </Button>
            <ButtonGroup size='sm'>
              <Button variant='secondary' onClick={() => startNewRound()}>
                Új kör
              </Button>
              <Button
                variant='outline-secondary'
                onClick={() => startNewRound(-1)}
                style={{ flex: 0 }}>
                -1
              </Button>
            </ButtonGroup>
            <hr />
          </>
        )}
        <Button
          size='sm'
          variant='secondary'
          onClick={() => setEditedCharacter({ name: "", roll: "" })}>
          Új karakter
        </Button>
        {characters?.length > 0 && (
          <Button
            size='sm'
            variant='info'
            onClick={() => {
              openModal({
                open: true,
                title: "Törlés",
                body: "Törlösz minden njk-t és a játékosok kezdeményezését?",
                cancelButton: "Mégse",
                onClose: (ret) => {
                  if (ret) {
                    newRound();
                    db.characters.bulkDelete(
                      characters
                        .filter(
                          (c) =>
                            (c.dontDelete === undefined && c.type === "npc") ||
                            c.dontDelete === false
                        )
                        .map((c) => c.id)
                    );
                    db.characters.toCollection().modify({ initiative: undefined });
                  }
                  closeModal();
                },
              });
            }}>
            Új harc
          </Button>
        )}
      </div>
      <SimpleDialog />
    </>
  );
}

export default ControlButtons;
