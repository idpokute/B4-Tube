import React from 'react';
import { withRouter } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import { CollectionPlayFill } from 'react-bootstrap-icons';
import RightLogin from './Sections/RightLogin';

function NavBar(props) {
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
