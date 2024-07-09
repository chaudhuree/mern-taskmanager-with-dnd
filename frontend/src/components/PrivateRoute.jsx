import { Outlet, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
export default function PrivateRoute() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoggedIn(true);
    }
  }, []);

  return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
}
