import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../modules/user';
import { withRouter } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function LoginPage(props) {
  const dispatch = useDispatch();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Message, setMessage] = useState('');
  const [Validated, setValidated] = useState(false);

  const onEmailChange = e => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordChange = e => {
    setPassword(e.currentTarget.value);
  };
  const onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const form = e.currentTarget;

    setValidated(true);

    if (form.checkValidity() === true) {
      let body = {
        email: Email,
        password: Password,
      };
      dispatch(loginUser(body)).then(res => {
        if (res.payload.loginSuccess) {
          window.localStorage.setItem('userId', res.payload.userId);
          props.history.push('/');
        } else {
          setMessage('Login Fail, please check email and password');
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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={Password}
            onChange={onPasswordChange}
            placeholder="Password"
            required
          />
          <Form.Control.Feedback type="invalid">
            Write your Password which is longer than 6 character
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="text-capital" block>
          Login
        </Button>

        <Form.Text className="my-2 text-center font-weight-bold text-danger">
          {Message}
        </Form.Text>

        <hr />
        <Form.Text className="my-2 font-weight-bold text-info">
          Don't you have account yet? You can register
        </Form.Text>

        <Button
          variant="outline-info"
          className="text-capital"
          // onClick={onRegister}
          href="/register"
          block
        >
          Register
        </Button>

        <hr />

        <Form.Text className="text-danger ">
          Or you can use email: test1@test.com and password: 123456 for testing.
        </Form.Text>
      </Form>
    </div>
  );
}

export default withRouter(LoginPage);
