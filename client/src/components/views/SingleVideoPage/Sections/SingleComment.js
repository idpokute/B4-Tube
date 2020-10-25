import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Col } from 'react-bootstrap';
import Axios from 'axios';

function SingleComment(props) {
  const user = useSelector(state => state.user);
  const [CommentValue, setCommentValue] = useState('');
  const [Validated, setValidated] = useState(false);
  const [OpenReply, setOpenReply] = useState(false);

  const onChange = e => {
    setCommentValue(e.currentTarget.value);
  };

  const onClickOpenReply = e => {
    setOpenReply(!OpenReply);
  };

  const onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;

    setValidated(true);

    if (form.checkValidity() === true) {
      const variable = {
        content: CommentValue,
        writer: user.userData._id,
        postId: props.postId,
        responseTo: props.comment._id,
      };
      const fn = async () => {
        try {
          const res = await Axios.post('/api/comment/saveComment', variable);

          console.log('this is called in singleComment');

          if (res.data.success) {
            props.refreshFunction(res.data.result);
            setCommentValue('');
            setValidated(false);
          }
        } catch (err) {
          console.error(err);
          alert('Save Comment Fail!');
        }
      };
      fn();
    }
  };

  return (
    <div>
      {props.comment.writer.name} {props.comment.content}{' '}
      <span onClick={onClickOpenReply}>Reply</span>
      {OpenReply && (
        <Form
          noValidate
          validated={Validated}
          onSubmit={onSubmit}
          className="border rounded p-2"
        >
          <Form.Row>
            <Col sm="10">
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  as="textarea"
                  value={CommentValue}
                  onChange={onChange}
                  size="sm"
                  placeholder="add comment"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please write your comment
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col xs="2">
              <Button type="submit" size="lg" block className="mb-2">
                Add
              </Button>
            </Col>
          </Form.Row>
        </Form>
      )}
    </div>
  );
}

export default SingleComment;
