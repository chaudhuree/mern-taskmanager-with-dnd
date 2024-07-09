import axios from "axios";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const { data } = await axios.get("/login-check", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLogin(data.login);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return login ? children : <Navigate to="/signin" />;
};

export const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: loginData } = await axios.get("/login-check", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (loginData.login) {
          setLogin(true);

          const { data: adminData } = await axios.get("/admin-check", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setAdmin(adminData.admin);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkAdminStatus();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!login) {
    return <Navigate to="/signin" />;
  }

  return admin ? children : <Navigate to="/" />;
};
