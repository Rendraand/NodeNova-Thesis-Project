import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";

import Dashboard from "./pages/Dashboard";
import Gameplay from "./pages/Gameplay";
import Root from "./components/layout/Root";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import NoRewardSuccess from "./components/game/NoRewardSuccess";

import "./styles/main.css";
import { AudioProvider } from "./context/AudioContext";

// Helper Component untuk Route di luar Main Layout (seperti Gameplay)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "journey", element: <Journey /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/puzzles/:id",
    element: (
      <ProtectedRoute>
        <Gameplay />
      </ProtectedRoute>
    ),
  },
  {
    path: "dev-testing",
    element: <NoRewardSuccess />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <GameProgressProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </GameProgressProvider>
    </AuthProvider>
  );
}

export default App;
