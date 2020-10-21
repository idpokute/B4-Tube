import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Nav } from 'react-bootstrap';
import { logoutUser } from '../../../../modules/user';
import { Upload, BoxArrowUpRight, PersonFill } from 'react-bootstrap-icons';

function RightLogin(props) {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [LoggedOut, setLoggedOut] = useState(false);

  // Logout
  const onLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      if (res.payload.success) {
        localStorage.removeItem('userId');
        console.log('logout!');
        props.history.push('/login');
      }
    } catch (e) {
      console.error(e);
      alert('Logout Failed');
    }
  };

  // Signin and Signup conditional button.
  const renderSignupArea = () => {
    // Prevent flash using loading...
    if (!user.userData) {
      return (
        <div className="spinner-grow text-warning" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      );
    } else if (user.userData && !user.userData.isAuth) {
      return (
        <>
          <Nav.Link
            href="/login"
            className="text-uppercase text-blue"
            style={{
              color: 'rgb(62, 166, 255)',
              border: '1px solid rgb(62,166, 255)',
            }}
          >
            <PersonFill />
            &nbsp;Login
          </Nav.Link>
        </>
      );
    }
    // Logged-in Users' menu
    return (
      <>
        <Nav.Link href="/video/upload" className="text-uppercase">
          <Upload /> Upload
        </Nav.Link>
        <Nav.Link
          onClick={onLogout}
          className="text-warning text-uppercase border border-warning rounded px-2"
        >
          <BoxArrowUpRight /> Logout
        </Nav.Link>
      </>
    );
  };

  // if (LoggedOut) {
  //   return <Redirect to="/" push={true} />;
  // }

  return <>{renderSignupArea()}</>;
}

export default withRouter(RightLogin);
