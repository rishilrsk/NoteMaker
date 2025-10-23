import React from "react";
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa"; // Import icons

/**
 * A reusable component to wrap forms in a centered, light card,
 * with integrated icons for input fields.
 * @param {string} title - The title to display at the top of the form.
 * @param {string} subtitle - Optional subtitle (e.g., "Login to your account").
 * @param {React.ReactNode} children - The form elements to render inside the card.
 */
const FormContainer = ({ title, subtitle, children }) => {
  // This helper function creates an InputGroup with an icon prefix
  const renderInputField = (
    id,
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    required,
    icon,
    minLength
  ) => (
    <Form.Group className="mb-3" controlId={id}>
      {/* <Form.Label>{label}</Form.Label> Removing explicit label to match screenshot style */}
      <InputGroup>
        <InputGroup.Text className="input-icon-prepend">
          {icon === "email" && <FaEnvelope />}
          {icon === "password" && <FaLock />}
          {icon === "user" && <FaUser />}
        </InputGroup.Text>
        <Form.Control
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="form-control-custom" // Use our new custom class
        />
      </InputGroup>
    </Form.Group>
  );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-1">{title}</h2>
              {subtitle && (
                <p className="text-center text-muted mb-4">{subtitle}</p>
              )}
              {/* Pass the renderInputField function to children if needed, or modify specific pages */}
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === Form) {
                  return React.cloneElement(child, { renderInputField });
                }
                return child;
              })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormContainer;
