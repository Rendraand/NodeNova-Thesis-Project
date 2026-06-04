import { createBrowserRouter, Outlet, Navigate } from "react-router";
import { RouterProvider } from "react-router";

import React from "react";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/layout/Sidebar";
import Gameplay from "./pages/Gameplay";

import "./styles/main.css";
import GetStarted from "./pages/GetStarted";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Komponen Wrapper untuk Proteksi Route
const Root = () => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-16 font-semibold text-lg">Tunggu sebentar...</p>; // Bisa diganti dengan Loading Spinner

  // Jika user belum autentikasi, tampilkan Landing Page (GetStarted)
  if (!user) {
    return <GetStarted />;
  }

  // Jika sudah autentikasi, tampilkan Layout Utama dengan Sidebar
  return (
    <React.Fragment>
      <Sidebar />
      <div className="ms-62.5 px-7.5 pt-7.5 pb-15">
        <Outlet />
      </div>
    </React.Fragment>
  );
};

// Helper Component untuk Route di luar Main Layout (seperti Gameplay)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
};

// Komponen untuk menangani redirect otomatis dari index ke dashboard bagi user login
const IndexRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/" replace />
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <IndexRedirect />,
      },
      {
        path: "dashboard",
        Component: Dashboard,
      },
    ],
  },
  {
    path: "/gameplay/:id",
    element: (
      <ProtectedRoute>
        <Gameplay />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
