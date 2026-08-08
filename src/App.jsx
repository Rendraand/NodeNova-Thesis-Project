import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProgressProvider } from "./context/GameProgressContext";

import Dashboard from "./pages/Dashboard";
import Gameplay from "./pages/Gameplay";
import Root from "./components/layout/Root";
import Journey from "./pages/Journey";
import Settings from "./pages/Settings";
import Leaderboard from "./pages/Leaderboard";

import "./styles/main.css";
import { AudioProvider } from "./context/AudioContext";
import Achievements from "./pages/Achievements";

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
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "achievements", element: <Achievements /> },
    ],
  },
  {
    // path: "/puzzles/:id",
    // element: (
    //   <ProtectedRoute>
    //     <Gameplay />
    //   </ProtectedRoute>
    // ),
    // path: "puzzles/:topic/:id",
    element: (
      // <ProtectedRoute>
      // <Gameplay />
      // </ProtectedRoute>
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      { path: ":topic/puzzles/:id", element: <Gameplay /> },
      // { path: "stack-and-queue/puzzles/:id", element: <Gameplay /> },
      // { path: "binary-tree/puzzles/:id", element: <Gameplay /> },
    ],
  },
  {
    path: "dev-testing",
    // element: <NoRewardSuccess />,
    // element: (
    //   <div className="w-full h-screen flex justify-center items-center">
    //     <img src={badges} alt="Badges" className="size-24 object-contain" />
    //   </div>
    // ),
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
