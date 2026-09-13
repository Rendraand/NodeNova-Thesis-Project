import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";
import { AudioProvider } from "./context/AudioContext";

import Dashboard from "./pages/Dashboard";
import Gameplay from "./pages/Gameplay";
import Root from "./components/layout/Root";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";

import "./styles/main.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "journey", element: <Journey /> },
      { path: "settings", element: <Settings /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "achievements", element: <Achievements /> },
    ],
  },
  {
    path: ":topic/puzzles/:id",
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
      <GameProgressProvider>
        <AudioProvider>
          <RouterProvider router={router} />
        </AudioProvider>
      </GameProgressProvider>
    </AuthProvider>
  );
}

export default App;
