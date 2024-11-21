import useLocalStorageState from "use-local-storage-state";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { db } from "../database/dataStore";
import AddCharacterDialog from "./AddCharacterDialog";
import ControlButtons from "./ControlButtons";
import DetailsPane from "./DetailsPane";
import InitiativeList from "./InitiativeList";
import { useDiceRoller } from "../common/DiceRoller";
import { Button } from "react-bootstrap";
import { sortCharacters, updateCharacters } from "../common/utils";

const Initiatives = () => {
  const [whoseTurn, setWhoseTurn] = useLocalStorageState("sr4-initiative-whoseTurn", {
    defaultValue: 0,
  });
  const [editedCharacter, setEditedCharacter] = useState();
  const [selectedCharacterId, setSelectedCharacterId] = useState();
  const [round, setRound] = useLocalStorageState("sr4-initiative-round", {
    defaultValue: 1,
  });
  const [phase, setPhase] = useLocalStorageState("sr4-initiative-phase", {
    defaultValue: 1,
  });

  const { DiceRoller, rollDice } = useDiceRoller();

  const characters = useLiveQuery(() => db.characters.orderBy("order").toArray());

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
    setRound(newValue);
    setPhase(1);
    setWhoseTurn(0);
  }

  function stepWhoseTurn() {
    const nextCharacterinThisPhase = characters.find(
      (character, idx) => character.phases >= phase && idx > whoseTurn
    );
    if (nextCharacterinThisPhase) {
      const idx = characters.indexOf(nextCharacterinThisPhase);
      setWhoseTurn(idx);
      setSelectedCharacterId(nextCharacterinThisPhase.id);
    } else {
      const nextCharacterInNextPhase = characters.find((character) => character.phases > phase);
      if (nextCharacterInNextPhase) {
        const idx = characters.indexOf(nextCharacterInNextPhase);
        setPhase(phase + 1);
        setWhoseTurn(idx);
        setSelectedCharacterId(nextCharacterInNextPhase.id);
      } else {
        newRound(1);
        setWhoseTurn(0);
        setSelectedCharacterId(characters[0].id);
        setPhase(1);
      }
    }
  }

  function setWhoseTurnToCharacter(character) {
    setWhoseTurn(characters.indexOf(character));
  }

  return (
    <Container fluid className='px-3 initiatives'>
      <Row className='pt-2'>
        <Col xs='1'>
          <ControlButtons
            setEditedCharacter={setEditedCharacter}
            characters={characters}
            newRound={newRound}
            setSelectedCharacterId={setSelectedCharacterId}
          />
        </Col>
        <Col>
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
        <Col xs='6'>
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
        onClose={() => sortCharacters(characters)}
      />
      <DiceRoller />
    </Container>
  );
};
export default Initiatives;
