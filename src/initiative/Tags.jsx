import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { db } from "../database/dataStore";
import { useState } from "react";
import { updateCharacters } from "../common/utils";

const tags = [
  { label: "Kábult", defaultLength: undefined, notes: "" },
  { label: "Ájult", defaultLength: undefined, notes: "" },
  { label: "Sebesült", defaultLength: undefined, notes: "" },
  { label: "Reflexgyorsító", defaultLength: undefined, notes: "" },
  { label: "Tulajdonságnövelés", defaultLength: undefined, notes: "" },
];

function Tags({ characters, selectedCharacter }) {
  const [customTag, setCustomTag] = useState({
    label: "",
    defaultLength: "",
    notes: "",
  });

  // Adds a new custom tag to the selected character
  function addCustomTag(e) {
    e.preventDefault();
    if (!customTag.label) return;
    if (!customTag.notes.endsWith(".")) customTag.notes += ".";
    // Can't add a tag with the same name as an existing one
    if (selectedCharacter.tags?.some((t) => t.label === customTag.label)) return;

    let length;
    try {
      length = parseInt(customTag.defaultLength);
    } catch (e) {
      length = undefined;
    }

    const newTags = [
      ...(selectedCharacter.tags ?? []),
      {
        label: customTag.label,
        length: isNaN(length) ? undefined : length,
        notes: customTag.notes || "",
      },
    ];
    db.characters.update(selectedCharacter.id, { tags: newTags });

    setCustomTag({
      label: "",
      defaultLength: "",
      notes: "",
    });
  }

  function tagMouseDown(e, tag) {
    e.preventDefault();
    const hadThisTag = selectedCharacter.tags?.find((t) => t.label === tag.label);
    let newTags,
      update = false;
    if (!hadThisTag && e.button === 0) {
      newTags = [
        ...(selectedCharacter.tags ?? []),
        { label: tag.label, length: tag.defaultLength, notes: tag.notes },
      ];
      update = true;
    }

    if (hadThisTag && e.button === 0) {
      if (hadThisTag.length !== undefined) {
        hadThisTag.length++;
      } else {
        hadThisTag.length = 1;
      }
      newTags = selectedCharacter.tags;
      update = true;
    }

    if (hadThisTag && e.button === 2) {
      if (hadThisTag.length > 1) {
        hadThisTag.length--;
        newTags = selectedCharacter.tags;
      } else {
        newTags = selectedCharacter.tags?.filter((t) => t.label !== tag.label) ?? [];
      }
      update = true;
    }

    if (hadThisTag && e.button === 1) {
      newTags = selectedCharacter.tags?.filter((t) => t.label !== tag.label) ?? [];
      update = true;
    }

    if (update)
      updateCharacters(
        characters.map((character) =>
          character.id === selectedCharacter.id ? { ...character, tags: newTags } : character
        )
      );
  }

  return (
    <>
      <Row>
        <Col className='pt-2'>
          <div className='d-flex gap-2 flex-wrap'>
            {tags?.map((tag) => (
              <Button
                size='sm'
                variant={
                  selectedCharacter.tags?.some((t) => t.label === tag.label)
                    ? "primary"
                    : "outline-secondary"
                }
                key={tag.label}
                onMouseDown={(e) => tagMouseDown(e, tag)}>
                {tag.label}
              </Button>
            ))}
            {selectedCharacter.tags
              ?.filter((t) => !tags?.some((tag) => tag.label === t.label))
              .map((tag) => (
                <Button
                  size='sm'
                  variant={
                    selectedCharacter.tags?.some((t) => t.label === tag.label)
                      ? "primary"
                      : "outline-secondary"
                  }
                  key={tag.label}
                  onMouseDown={(e) => tagMouseDown(e, tag)}>
                  {tag.label}
                </Button>
              ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={addCustomTag}>
            <InputGroup className='mt-2'>
              <InputGroup.Text>Címke</InputGroup.Text>
              <Form.Control
                value={customTag.label}
                onChange={(e) => setCustomTag({ ...customTag, label: e.target.value })}
                placeholder='Név'
              />
              <Form.Control
                value={customTag.defaultLength}
                onChange={(e) => setCustomTag({ ...customTag, defaultLength: e.target.value })}
                placeholder='Körök'
              />
              <Form.Control
                value={customTag.notes}
                onChange={(e) => setCustomTag({ ...customTag, notes: e.target.value })}
                placeholder='Jegyzet'
              />
              <InputGroup.Text>
                <Button
                  size='sm'
                  className='py-0 px-1 text-nowrap'
                  variant='secondary'
                  type='submit'>
                  Ok
                </Button>
              </InputGroup.Text>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      {selectedCharacter.tags?.map((tag) => (
        <Row key={tag.label}>
          <Col className='pt-2'>
            {tag.label}: {tag.notes}{" "}
            {tag.length && (
              <span>
                Még
                <Form.Control
                  className='d-inline mx-1'
                  style={{ width: "3em" }}
                  value={tag.length}
                  onChange={(e) => {
                    const newValue = isNaN(parseInt(e.target.value)) ? 1 : parseInt(e.target.value);
                    const newTag = { ...tag, length: newValue };
                    db.characters.update(selectedCharacter.id, {
                      tags: selectedCharacter.tags.map((t) => (t.label === tag.label ? newTag : t)),
                    });
                  }}
                />
                körig.
              </span>
            )}
          </Col>
        </Row>
      ))}
    </>
  );
}

export default Tags;
