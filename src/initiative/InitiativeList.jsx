import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { ReactSortable } from "react-sortablejs";
import { setInitiative, updateCharacters } from "../common/utils";
import { useSimpleDialog } from "../common/SimpleDialog";

const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.65,
  ghostClass: "ghost",
  group: "shared",
};

function InitiativeList({
  characters,
  selectedCharacterId,
  setSelectedCharacterId,
  whoseTurn,
  phase,
}) {
  const { openModal, SimpleDialog } = useSimpleDialog();

  function reorderCharacters(chars) {
    updateCharacters(chars.map((c, i) => ({ ...c, order: i })));
  }

  function setInitiativeForCharacter(characterId, value) {
    if (value >= 0 && !isNaN(parseInt(value))) {
      setInitiative(characterId, parseInt(value), characters);
    } else if (value !== undefined && value !== false) {
      setInitiative(characterId, undefined, characters);
    }
  }

  return (
    <>
      <ListGroup>
        <ReactSortable list={characters || []} setList={reorderCharacters} {...sortableOptions}>
          {characters
            ?.filter((c) => c.id)
            .map((character, idx) => (
              <ListGroup.Item
                key={character.id}
                className={selectedCharacterId === character.id ? "selected p-0" : "p-0"}>
                <Row onMouseDown={() => setSelectedCharacterId(character.id)} className='p-2'>
                  {whoseTurn === idx && (
                    <div className='initiative-arrow'>
                      <i className='bi bi-caret-right-fill'></i>
                    </div>
                  )}
                  <Col xs='1' className='pe-0' style={{ width: "42px" }}>
                    <Button
                      size='sm'
                      className='py-0 px-1 text-nowrap w-100'
                      variant='secondary'
                      onClick={() => {
                        openModal({
                          onClose: (value) => setInitiativeForCharacter(character.id, value),
                          title: "Kezdeményezés",
                          body: <></>,
                          okButton: "OK",
                          cancelButton: "Bezár",
                          input: true,
                          defaultInputText: character.initiative?.value,
                        });
                      }}>
                      {character.initiative?.value ?? <i className='bi bi-pencil px-1'></i>}
                    </Button>
                  </Col>
                  <Col>
                    <span
                      style={{ width: "120px" }}
                      className={`d-inline-block character-name me-3 ${
                        phase > character.phases ? "grey" : ""
                      }`}>
                      {character.name}
                    </span>
                    <span
                      className={`character-name me-3 ${phase > character.phases ? "grey" : ""}`}>
                      {character.phases ?? 1} fázis
                    </span>
                    {character.stun > 0 && (
                      <span
                        className={`character-name me-2 ${phase > character.phases ? "grey" : ""}`}>
                        K: -{Math.ceil(character.stun / 3)}
                      </span>
                    )}
                    {character.physical > 0 && (
                      <span
                        className={`character-name me-3 ${phase > character.phases ? "grey" : ""}`}>
                        F: -{Math.ceil(character.physical / 3)}
                      </span>
                    )}
                    {character.tags?.map((tag) => (
                      <Badge key={tag.label} className='me-1'>
                        {tag.label} {tag.length}
                      </Badge>
                    ))}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
        </ReactSortable>
      </ListGroup>
      <SimpleDialog />
    </>
  );
}

export default InitiativeList;
