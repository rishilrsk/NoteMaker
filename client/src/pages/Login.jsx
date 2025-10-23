import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import FormContainer from "../components/FormContainer.jsx";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { email, password } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError("Please fill in all fields");
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });

      // 1. AWAIT the login function. This pauses execution
      //    until the user is fully authenticated.
      await login(res.data.token);

      // 2. NOW that the user is authenticated, we navigate.
      //    ProtectedRoute will see isAuthenticated=true and will not redirect.
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
    setLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <FormContainer title="Login" subtitle="Login to your account">
      <Form onSubmit={onSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="email">
          <InputGroup>
            <InputGroup.Text className="input-icon-prepend">
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              className="form-control-custom"
              placeholder="Email ID"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4" controlId="password">
          <InputGroup>
            <InputGroup.Text className="input-icon-prepend">
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              className="form-control-custom"
              placeholder="Password"
            />
          </InputGroup>
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </Form>
      <div className="text-center mt-4">
        <small>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </small>
      </div>
    </FormContainer>
  );
};

export default Login;
