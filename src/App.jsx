import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";

import Dashboard from "./pages/Dashboard";
import Gameplay from "./pages/Gameplay";
import Root from "./components/layout/Root";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";
import Achievements from "./pages/Achievements";

import "./styles/main.css";
import { AudioProvider } from "./context/AudioContext";
import { useParams } from "react-router";
import { doc } from "firebase/firestore";
import { db } from "./services/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

const ProtectedRoute = ({ children }) => {
  const { id } = useParams();
  const { user, userData, loading } = useAuth();

  const puzzleRef = doc(db, "puzzles", id || "unknown");

  const [puzzleData, loadingPuzzle] = useDocumentData(puzzleRef);

  if (loading || loadingPuzzle) return null;

  return user &&
    (!puzzleData?.prerequisite_id ||
      userData?.completed_puzzles.includes(puzzleData?.prerequisite_id)) ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
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
