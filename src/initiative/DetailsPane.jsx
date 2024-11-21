import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { db } from "../database/dataStore";
import Tags from "./Tags";
import { useCallback, useEffect, useState } from "react";
import reactTextareaAutosize from "react-textarea-autosize";
import { debounce } from "lodash";
import Counter from "../common/Counter";

function DetailsPane({
  selectedCharacterId,
  setSelectedCharacterId,
  setEditedCharacter,
  characters,
  setWhoseTurnToCharacter,
}) {
  const selectedCharacter = characters?.find((c) => c.id === selectedCharacterId) || null;
  const [charNotes, setCharNotes] = useState(selectedCharacter?.charNotes || "");

  useEffect(() => {
    if (selectedCharacter) {
      setCharNotes(selectedCharacter?.charNotes || "");
    }
  }, [selectedCharacter]);

  function deleteCharacter(id) {
    db.characters.delete(id);
    // Deselect
    setSelectedCharacterId(undefined);
  }

  // Update char notes in db with debounce
  const delayedUpdateCharNotes = useCallback(
    debounce((selectedCharacterId, text) => {
      db.characters.where({ id: selectedCharacterId }).modify({ charNotes: text });
    }, 1000),
    []
  );

  function updateCharNotes(text) {
    setCharNotes(text);
    delayedUpdateCharNotes(selectedCharacterId, text);
  }

  return (
    selectedCharacter && (
      <>
        <Row>
          <Col>
            <h3>{selectedCharacter.name}</h3>
          </Col>
          <Col className='text-end align-middle' xs={4}>
            <div className='d-flex gap-2 flex-wrap justify-content-end align-items-center'>
              <Form.Group controlId='characterName'>
                <Form.Check
                  label='Megtart'
                  title='Új harcnál nem törlendő'
                  checked={!!selectedCharacter.dontDelete}
                  onChange={(e) =>
                    db.characters
                      .where({ id: selectedCharacter.id })
                      .modify({ dontDelete: e.target.checked })
                  }
                />
              </Form.Group>
              <Button
                title='Ő jön'
                onClick={() => setWhoseTurnToCharacter(selectedCharacter)}
                size='sm'
                variant='info'>
                <i className='bi bi-chevron-right'></i>
              </Button>
              <Button onClick={() => setEditedCharacter(selectedCharacter)} size='sm'>
                <i className='bi bi-pencil'></i>
              </Button>
              <Button
                onClick={() => deleteCharacter(selectedCharacterId)}
                size='sm'
                variant='danger'>
                <i className='bi bi-trash'></i>
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col>
            <Tags characters={characters} selectedCharacter={selectedCharacter} />
          </Col>
        </Row>

        <Row>
          <Col>
            <InputGroup className='mt-2'>
              <Form.Control
                as={reactTextareaAutosize}
                value={charNotes}
                onChange={(e) => updateCharNotes(e.target.value)}
                placeholder='Jegyzetek'
              />
            </InputGroup>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col>
            <div className='d-flex gap-1 flex-wrap'>
              {selectedCharacter.counters?.map((counter) => (
                <Counter
                  key={counter.name + selectedCharacterId}
                  characters={characters}
                  counterName={counter.name}
                  selectedCharacterId={selectedCharacter.id}
                />
              ))}
              <Counter
                key={"uj" + selectedCharacterId}
                characters={characters}
                selectedCharacterId={selectedCharacter.id}
              />
            </div>
          </Col>
        </Row>
      </>
    )
  );
}

export default DetailsPane;
