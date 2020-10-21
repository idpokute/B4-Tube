import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../../modules/user';
import { withRouter } from 'react-router-dom';
import { Nav, Navbar, Button } from 'react-bootstrap';
import {
  Upload,
  CollectionPlayFill,
  BoxArrowInDownRight,
  BoxArrowUpRight,
  PersonFill,
} from 'react-bootstrap-icons';
import RightLogin from './Sections/RightLogin';

function NavBar(props) {
  const user = useSelector(state => state.user);

  return (
    <Navbar bg="dark" sticky="top" variant="dark" expand="md">
      <Navbar.Brand href="/" className="text-danger font-weight-bold">
        <CollectionPlayFill size={24} /> B4-Tube
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/subscription" className="text-uppercase">
            Subscriptions
          </Nav.Link>
        </Nav>

        <Nav>
          <RightLogin />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default withRouter(NavBar);
