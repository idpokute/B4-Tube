import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../modules/user';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function RegisterPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState('');
  const [Name, setName] = useState('');
  const [Password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [Message, setMessage] = useState('');
  const [Validated, setValidated] = useState(false);

  const onEmailChange = e => {
    setEmail(e.currentTarget.value);
  };
  const onNameChange = e => {
    setName(e.currentTarget.value);
  };
  const onPasswordChange = e => {
    setPassword(e.currentTarget.value);
  };
  const onConfirmPasswordChange = e => {
    setConfirmPassword(e.currentTarget.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;
    setValidated(true);

    if (Password !== ConfirmPassword) {
      return alert('Please double check your password');
    }

    if (form.checkValidity() === true) {
      let body = {
        email: Email,
        password: Password,
        name: Name,
      };
      dispatch(registerUser(body)).then(res => {
        if (res.payload.success) {
          setMessage(
            'You are registered. You will be redirected signin page soon.'
          );

          setTimeout(() => {
            props.history.push('/login');
          }, 2000);
        } else {
          alert('Singnup Failed');
        }
      });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <Form
        noValidate
        validated={Validated}
        onSubmit={onSubmit}
        className="border rounded p-2"
      >
        <Form.Text className="my-2 text-center font-weight-bold text-danger">
          {Message}
        </Form.Text>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={Email}
            onChange={onEmailChange}
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            Please Check Email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={Name}
            onChange={onNameChange}
            placeholder="Write your name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={Password}
            onChange={onPasswordChange}
            placeholder="Password"
            required
            minLength="6"
          />
          <Form.Text className="text-muted">
            You must enter password longer than 6 characters.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={ConfirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Password"
            required
            minLength="6"
          />
          <Form.Control.Feedback type="invalid">
            Please double check your password.
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="text-capital" block>
          Register
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(RegisterPage);
