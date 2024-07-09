import {useEffect,useState} from "react";
import AdminView from "../components/AdminVIew";
import UserView from "../components/UserView";

export default function Tasks() {
  const [userStatus, setUserStatus] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserStatus(JSON.parse(localStorage.getItem("user")).role);
    }
  }, []);
  if (userStatus === "admin") {
    return <AdminView />;
  }
  return <UserView />;
}
