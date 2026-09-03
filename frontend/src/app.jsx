import { useState } from "react";
import { hasToken } from "./api.js";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import TaskBoard from "./components/TaskBoard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // "login" | "register"
  const [loggedIn, setLoggedIn] = useState(hasToken());

  function handleLoggedIn(u) {
    setUser(u);
    setLoggedIn(true);
  }

  function handleLogout() {
    setUser(null);
    setLoggedIn(false);
  }

  if (loggedIn) {
    return <TaskBoard user={user ?? { name: "" }} onLogout={handleLogout} />;
  }

  return (
    <div className="auth-page">
      {view === "login" ? (
        <Login onLoggedIn={handleLoggedIn} goToRegister={() => setView("register")} />
      ) : (
        <Register onLoggedIn={handleLoggedIn} goToLogin={() => setView("login")} />
      )}
    </div>
  );
}