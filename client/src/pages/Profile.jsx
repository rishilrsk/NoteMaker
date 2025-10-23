import React from "react";
import { Container, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import FormContainer from "../components/FormContainer.jsx";

function Profile() {
  const { user } = useAuth();

  return (
    <FormContainer title="My Info">
      {user ? (
        <>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-muted mt-4">
            (This is where you'll be able to update your profile or change your
            password in the future.)
          </p>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </FormContainer>
  );
}

export default Profile;
