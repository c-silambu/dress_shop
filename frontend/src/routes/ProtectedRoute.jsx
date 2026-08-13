import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function UserRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export function AdminRoute({ children }) {
  return localStorage.getItem("adminToken") ? children : <Navigate to="/admin/login" />;
}
