import React, { useEffect } from "react";
import { Container, Button, Row, Col, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// 1. We no longer need the feature icons (FaSave, etc.), so they are removed.
import "../styles/PublicPages.css"; // Import the light-theme wrapper CSS

function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users to their dashboard
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // Show spinner while checking auth
  if (loading) {
    return (
      <div className="public-page-wrapper">
        <Container className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </Container>
      </div>
    );
  }

  // Only show the landing page if the user is NOT authenticated
  return (
    !isAuthenticated && (
      <div className="public-page-wrapper">
        <Container className="text-center mt-5">
          {/* Hero Section */}
          <h1 className="display-3 fw-bold">NoteMaker</h1>
          <p className="lead text-muted mb-4">
            Capture, organize, and find your thoughts effortlessly.
          </p>

          {/* Single Button Action */}
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
            <LinkContainer to="/login">
              <Button
                variant="primary"
                size="lg"
                className="px-5 py-3"
                style={{ borderRadius: "0.75rem" }}
              >
                Log In
              </Button>
            </LinkContainer>
          </div>

          {/* Text link for new users */}
          <div className="mb-5">
            <small>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </small>
          </div>

          {/* 2. FEATURE CARDS REMOVED */}

          {/* 3. NEW Brief Description Section */}
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <h3 className="fw-bold mb-3">
                Your Digital Notebook, Reimagined.
              </h3>
              <p className="fs-5 text-muted">
                NoteMaker is a clean, fast, and secure place to store all your
                ideas, notes, and documents. Sign in to access your dashboard
                and start creating today.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    )
  );
}

export default Landing;
