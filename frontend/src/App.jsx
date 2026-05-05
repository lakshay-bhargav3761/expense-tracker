
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Profile from "./pages/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";

import { AppProvider, useApp } from "./context/AppContext";

// =========================
// PRIVATE ROUTE
// =========================
const PrivateRoute = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// =========================
// PUBLIC ROUTE
// =========================
const PublicRoute = ({ children }) => {
  const { user } = useApp();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// =========================
// APP ROUTES
// =========================
const AppRoutes = () => {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="expense" element={<Expense />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// =========================
// MAIN EXPORT
// =========================
export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

