// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "react-bootstrap"; // Or any loading spinner

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // 1. If loading, show a spinner
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // 2. If not loading and authenticated, show the page
  if (isAuthenticated) {
    return <Outlet />; // <Outlet> renders the child route (e.g., Dashboard)
  }

  // 3. If not loading and not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
