import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { db, saveKeyValue } from "../database/dataStore";
import AddCharacterDialog from "./AddCharacterDialog";
import ControlButtons from "./ControlButtons";
import DetailsPane from "./DetailsPane";
import InitiativeList from "./InitiativeList";
import { useDiceRoller } from "../common/DiceRoller";
import { Button } from "react-bootstrap";
import { updateCharacters } from "../common/utils";

const Initiatives = () => {
  const [editedCharacter, setEditedCharacter] = useState();
  const [selectedCharacterId, setSelectedCharacterId] = useState();

  const { DiceRoller, rollDice } = useDiceRoller();

  const characters = useLiveQuery(() => db.characters.orderBy("order").toArray());
  const whoseTurn = useLiveQuery(() => db.keyValues.get("whoseTurn"), [], 0)?.value || 0;
  const round = useLiveQuery(() => db.keyValues.get("round"), [], 1)?.value || 1;
  const phase = useLiveQuery(() => db.keyValues.get("phase"), [], 1)?.value || 1;

  function newRound(value) {
    const newValue = round + value || 1;
    if (value > 0) {
      updateCharacters(
        characters.map((character) => {
          // if a tag has a length, reduce it. if it reaches 0, remove it
          if (character.tags) {
            character.tags = character.tags
              .map((t) => {
                if (t.length) {
                  return { ...t, length: t.length - value };
                }
                return t;
              })
              .filter((t) => t.length === undefined || t.length > 0);
          }
          return character;
        })
      );
    }
    saveKeyValue("round", newValue);
    saveKeyValue("phase", 1);
    saveKeyValue("whoseTurn", 0);
  }

  function stepWhoseTurn() {
    const nextCharacterinThisPhase = characters.find(
      (character, idx) => character.phases >= phase && idx > whoseTurn
    );
    if (nextCharacterinThisPhase) {
      const idx = characters.indexOf(nextCharacterinThisPhase);
      saveKeyValue("whoseTurn", idx);
      setSelectedCharacterId(nextCharacterinThisPhase.id);
    } else {
      const nextCharacterInNextPhase = characters.find((character) => character.phases > phase);
      if (nextCharacterInNextPhase) {
        const idx = characters.indexOf(nextCharacterInNextPhase);
        saveKeyValue("phase", phase + 1);
        saveKeyValue("whoseTurn", idx);
        setSelectedCharacterId(nextCharacterInNextPhase.id);
      } else {
        newRound(1);
        saveKeyValue("whoseTurn", 0);
        setSelectedCharacterId(characters[0].id);
        saveKeyValue("phase", 1);
      }
    }
  }

  function setWhoseTurnToCharacter(character) {
    saveKeyValue("whoseTurn", characters.indexOf(character));
  }

  return (
    <Container fluid className='px-3 initiatives'>
      <Row className='pt-2'>
        <Col xs='auto' className='p-0'>
          <ControlButtons
            setEditedCharacter={setEditedCharacter}
            characters={characters}
            newRound={newRound}
            setSelectedCharacterId={setSelectedCharacterId}
          />
        </Col>
        <Col xs={10} md className='mb-3'>
          <h5>
            {characters?.length > 0 && (
              <>
                <Button size='sm' className='me-3 py-0' variant='info' onClick={stepWhoseTurn}>
                  <i className='bi bi-arrow-down'></i>
                </Button>
                {round}. kör {phase}. fázis
              </>
            )}
          </h5>
          <InitiativeList
            {...{ characters, selectedCharacterId, setSelectedCharacterId, whoseTurn, phase }}
          />
        </Col>
        <Col xs='12' md>
          <div className='scrollable-menu'>
            {selectedCharacterId && (
              <DetailsPane
                {...{
                  selectedCharacterId,
                  setSelectedCharacterId,
                  setEditedCharacter,
                  characters,
                  rollDice,
                  setWhoseTurnToCharacter,
                }}
              />
            )}
          </div>
        </Col>
      </Row>
      <AddCharacterDialog
        editedCharacter={editedCharacter}
        setEditedCharacter={setEditedCharacter}
        setSelectedCharacterId={setSelectedCharacterId}
      />
      <DiceRoller />
    </Container>
  );
};
export default Initiatives;
