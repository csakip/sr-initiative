import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { db } from "../database/dataStore";
import { FormCheck } from "react-bootstrap";

const AddCharacterDialog = ({ editedCharacter, setEditedCharacter, setSelectedCharacterId }) => {
  function submit(e, copy = false) {
    e.preventDefault();
    if (copy) editedCharacter.id = undefined;
    editedCharacter.name = editedCharacter.name.trim() || "Chummer";
    editedCharacter.phases = editedCharacter.phases || 1;
    editedCharacter.order = editedCharacter.order || 100000;
    db.characters.put(editedCharacter, editedCharacter.id).then((ret) => {
      setSelectedCharacterId(ret);
    });
    setEditedCharacter(undefined);
  }

  return (
    <Modal show={editedCharacter} onHide={() => setEditedCharacter(undefined)} size='lg'>
      <Form onSubmit={submit}>
        <Modal.Header closeButton>
          <Modal.Title>Karakter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <Form.Group controlId='characterName'>
                <Form.Label>Név *</Form.Label>
                <Form.Control
                  type='text'
                  value={editedCharacter?.name ?? ""}
                  autoFocus
                  onChange={(e) => setEditedCharacter({ ...editedCharacter, name: e.target.value })}
                  autoComplete='off'
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group controlId='characterName'>
                <Form.Label>Fázisok *</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='1-4'
                  min='1'
                  max='4'
                  value={editedCharacter?.phases ?? "1"}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      phases: e.target.value
                        ? isNaN(parseInt(e.target.value))
                          ? 1
                          : parseInt(e.target.value)
                        : "1",
                    })
                  }
                  autoComplete='off'
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group controlId='characterRoll'>
                <Form.Label>Kezdeményezés</Form.Label>
                <Form.Control
                  type='number'
                  value={editedCharacter?.initiative?.value ?? ""}
                  autoComplete='off'
                  onChange={(e) => {
                    setEditedCharacter({
                      ...editedCharacter,
                      initiative: { value: e.target.value ? parseInt(e.target.value) : undefined },
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group controlId='characterRoll'>
                <Form.Label>Max kábulás</Form.Label>
                <Form.Control
                  type='number'
                  value={editedCharacter?.maxStun ?? ""}
                  autoComplete='off'
                  min={3}
                  max={18}
                  onChange={(e) => {
                    setEditedCharacter({
                      ...editedCharacter,
                      maxStun: e.target.value ? parseInt(e.target.value) : 0,
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col xs={2}>
              <Form.Group controlId='characterRoll'>
                <Form.Label>Max fizikai</Form.Label>
                <Form.Control
                  type='number'
                  value={editedCharacter?.maxPhysical ?? ""}
                  autoComplete='off'
                  min={3}
                  max={18}
                  onChange={(e) => {
                    setEditedCharacter({
                      ...editedCharacter,
                      maxPhysical: e.target.value ? parseInt(e.target.value) : 0,
                    });
                  }}
                />
              </Form.Group>
            </Col>
            <Col className='text-center' xs='auto'>
              <Form.Group controlId='characterName'>
                <Form.Label>Megtart</Form.Label>
                <FormCheck
                  className='mt-1'
                  checked={!!editedCharacter?.dontDelete}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      dontDelete: e.target.checked,
                    })
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className='justify-content-end'>
          <Button
            variant='secondary'
            onClick={() => setEditedCharacter(undefined)}
            className='me-auto'>
            Bezár
          </Button>
          {editedCharacter?.id && (
            <Button variant='primary' onClick={(e) => submit(e, true)}>
              Másolat mentése
            </Button>
          )}
          <Button variant='primary' type='submit'>
            Ment
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddCharacterDialog;
