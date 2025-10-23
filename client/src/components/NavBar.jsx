import React from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/NavBar.css"; // This file is still used for general navbar styling

function NavBar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar className="app-navbar" expand="lg" collapseOnSelect>
      <Container fluid="lg">
        <LinkContainer to={isAuthenticated ? "/dashboard" : "/"}>
          <Navbar.Brand className="fw-bold fs-4">NoteMaker</Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated && user ? (
              // --- USER IS LOGGED IN ---
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link>
                    <span>Dashboard</span>
                  </Nav.Link>
                </LinkContainer>

                {/* THIS IS THE UPDATED DROPDOWN */}
                <NavDropdown
                  title={`Hello, ${user.name}`}
                  id="username"
                  align="end"
                  className="ms-3"
                >
                  {/* 1. "My Info" Link */}
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>My Info</NavDropdown.Item>
                  </LinkContainer>

                  {/* 2. A divider for neatness */}
                  <NavDropdown.Divider />

                  {/* 3. "Logout" Button */}
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              // --- USER IS LOGGED OUT ---
              <>
                <LinkContainer to="/login">
                  <Nav.Link>
                    <span>Log In</span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/signup">
                  <Button
                    variant="primary"
                    className="rounded-pill ms-3 px-4 py-2"
                  >
                    Sign Up
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
