import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Form, Col } from 'react-bootstrap';
import Axios from 'axios';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  const user = useSelector(state => state.user);
  const [CommentValue, setCommentValue] = useState('');
  const [Validated, setValidated] = useState(false);

  const videoId = props.match.params.videoId;

  const onChange = e => {
    setCommentValue(e.currentTarget.value);
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
        postId: videoId,
      };
      const fn = async () => {
        try {
          const res = await Axios.post('/api/comment/saveComment', variable);

          console.log(res.data);

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
      <p>Comments</p>

      {props.comments &&
        props.comments.map(
          (comment, index) =>
            !comment.responseTo && (
              <React.Fragment key={index}>
                <SingleComment
                  postId={videoId}
                  comment={comment}
                  refreshFunction={props.refreshFunction}
                />
                <ReplyComment
                  postId={videoId}
                  parentCommentId={comment._id}
                  comments={props.comments}
                  refreshFunction={props.refreshFunction}
                />
              </React.Fragment>
            )
        )}

      <hr />
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
    </div>
  );
}

export default withRouter(Comment);
