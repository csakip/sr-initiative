import { ButtonGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useSimpleDialog } from "../common/SimpleDialog";
import { sortCharacters } from "../common/utils";
import { db, exportCharacters, importCharacters } from "../database/dataStore";

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
            Új harc
          </Button>
        )}
        <hr />
        <Button
          size='sm'
          variant='secondary'
          onClick={() => {
            openModal({
              size: "lg",
              open: true,
              title: "Shadowrun 4 kezdeményezés meséglet",
              body: (
                <>
                  <h3>Oldalsó gombok</h3>
                  <ul>
                    <li>
                      <b>Sorrendbe:</b> előfordulhat, hogy a karakterek nem kezdeményezési
                      sorrendben vannak a listában. Ez sorba rakja őket.
                    </li>
                    <li>
                      <b>Új kör:</b> új kört kezd, átugorva a maradék fázisokat és karaktereket.
                      <ul>
                        <li>
                          <b>-1:</b> egy kört visszalép (a címkék nem számolnak visszafelé
                          ilyenkor!)
                        </li>
                      </ul>
                    </li>
                    <li>
                      <b>Új karakter:</b> új karakter ablakban meg lehet adni egy karaktert. Név és
                      fázisok kötelező, a Kezdeményezést később is meg lehet adni. Ha a
                      &quot;Megtart&quot; be van jelölve, akkor &quot;Új harc&quot; indításakor nem
                      törli a karaktert a listából.
                    </li>
                    <li>
                      <b>Új harc:</b> kitöröl minden njk-t, a kezdeményezés értékeket és 1. kör 1.
                      fázisra áll, illetve az első karakterre.
                    </li>
                  </ul>
                  <h3>Karakter lista</h3>
                  <p>
                    Felette a
                    <Button size='sm' className='mx-2 py-0' variant='info'>
                      <i className='bi bi-arrow-down'></i>
                    </Button>
                    gombbal lehet a következő karakterre léptetni a kezdeményezést. A listán a
                    háromszög jelőli, hogy ki jön most. A lista elemeit egérrel át lehet rendezni. A
                    sor elején a ceruza (vagy szám) gombra kattintva lehet átírni a kezdeményezés
                    értékét.
                  </p>
                  <h3>Részletek nézet (jobb oldal)</h3>
                  <h4>Felső gombok</h4>
                  <ul>
                    <li>
                      <b>&gt;:</b> erre a karaterre mozgatja a kezdeményezést.
                    </li>
                    <li>
                      <b>Ceruza:</b> a karakter nevét, fázisát lehet átírni, vagy másolatot
                      készíteni róla.
                    </li>
                    <li>
                      <b>Kuka:</b> törli a karaktert a listából (megerősítés nélkül).
                    </li>
                  </ul>
                  <h4>Címkék</h4>
                  <p>
                    A néhány előre definiált címkére bal gombbal kattintva hozzáadja a karakterhez.
                    Újra bal gombbal a címke időtartamát növeli. Jobb gombbal csökkenti. Időtartam
                    nélküli címke mindig rajta marad. Középső gombbal eltávolítja a címkét.
                  </p>
                  <p>Alatta egyedi címkét lehet hozzáadni.</p>
                  <h4>Jegyzetek</h4>
                  <p>Szabad szöveges mező.</p>
                  <h4>Számlálók</h4>
                  <p>
                    Az új számláló mezőbe a nevét beírva, majd +-ra kattintva, hozzáad egy szám
                    mezőt. Utána a szám mezőbe be lehet írni az értékét, vagy matematikai műveletet,
                    amit Enter megnyomására végrehajt. Pl. &quot;25-4&quot;-et beírva, Enterre 21-et
                    ír be.
                  </p>
                  <p>
                    Csokáv - 2024.11.22. -
                    <a
                      className='ms-2'
                      href='https://github.com/csakip/sr-initiative'
                      target='_blank'
                      rel='noreferrer'>
                      GitHub
                    </a>
                  </p>
                </>
              ),
            });
          }}>
          Súgó
        </Button>
        {characters?.length > 0 && (
          <Button size='sm' variant='secondary' onClick={() => exportCharacters()}>
            Mentés fájlba
          </Button>
        )}
        <Button size='sm' variant='secondary' onClick={() => importCharacters()}>
          Betöltés fájlból
        </Button>
      </div>
      <SimpleDialog />
    </>
  );
}

export default ControlButtons;
