import axios from 'axios';

const LOGIN_USER = 'user/LOGIN_USER';
const LOGOUT_USER = 'user/LOGOUT_USER';
const REGISTER_USER = 'user/REGISTER';
const AUTH_USER = 'user/AUTH_USER';

// Action creator
export function loginUser(dataToSubmit) {
  const result = axios
    .post('/api/users/login', dataToSubmit)
    .then(res => res.data);

  return {
    type: LOGIN_USER,
    payload: result,
  };
}

export function logoutUser(dataToSubmit) {
  const result = axios.get('/api/users/logout').then(res => res.data);

  return {
    type: LOGOUT_USER,
    payload: result,
  };
}

export function registerUser(dataToSubmit) {
  const result = axios
    .post('/api/users/register', dataToSubmit)
    .then(res => res.data);

  return {
    type: REGISTER_USER,
    payload: result,
  };
}

export function authUser(dataToSubmit) {
  const result = axios
    .get('/api/users/auth', dataToSubmit)
    .then(res => res.data);

  return {
    type: AUTH_USER,
    payload: result,
  };
}

// Reducer
export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginSuccess: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
      };
    case REGISTER_USER:
      return {
        ...state,
        register: action.payload,
      };
    case AUTH_USER:
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
}
