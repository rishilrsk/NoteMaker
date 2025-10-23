import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import FormContainer from '../components/FormContainer.jsx';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { name, email, password, confirmPassword } = formData;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password }); 
      
      // 1. AWAIT the login function.
      await login(res.data.token);
      
      // 2. NOW navigate to the dashboard.
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again.');
    }
    setLoading(false);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <FormContainer title="Sign Up" subtitle="Create your account">
      <Form onSubmit={onSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="name">
          <InputGroup>
            <InputGroup.Text className="input-icon-prepend">
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="form-control-custom"
              placeholder="Full Name" 
            />
          </InputGroup>
        </Form.Group>

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

        <Form.Group className="mb-3" controlId="password">
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
              minLength={6}
              className="form-control-custom"
              placeholder="Password"
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-4" controlId="confirmPassword">
          <InputGroup>
            <InputGroup.Text className="input-icon-prepend">
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              minLength={6}
              className="form-control-custom"
              placeholder="Confirm Password"
            />
          </InputGroup>
        </Form.Group>

        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Sign Up'}
          </Button>
        </div>
      </Form>
      <div className="text-center mt-4">
        <small>
          Already have an account? <Link to="/login">Login here</Link>
        </small>
      </div>
    </FormContainer>
  );
};

export default Signup;