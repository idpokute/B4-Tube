import React, { useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';

function Comment() {
  const [Validated, setValidated] = useState(false);

  const onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;

    setValidated(true);

    if (form.checkValidity() === true) {
    }
  };

  return (
    <div>
      <p>Comments</p>
      <hr />
      <Form
        noValidate
        validated={Validated}
        onSubmit={onSubmit}
        className="border rounded p-2"
      >
        <Form.Row>
          <Col sm="10">
            <Form.Control
              as="textarea"
              // value
              onChange
              size="sm"
              placeholder="add comment"
            />
          </Col>

          <Col xs="2">
            <Button type="submit" size="lg" block className="mb-2">
              Add
            </Button>
          </Col>
        </Form.Row>
      </Form>
    </div>
  );
}

export default Comment;
