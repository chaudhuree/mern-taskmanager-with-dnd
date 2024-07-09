import { useState, useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function SignUp() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.name === "" || user.email === "" || user.password === "") {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const data = await axios.post("/register", user);
      
      if(data.data.token){
        toast.success('Signup successful')
      }
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      window.location.href = "/";
    } catch (error) {
      
      toast.error(error.response.data.msg);
    }
  };
  return (
    <div className="container h-screen flex flex-col justify-center">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <Link to="/">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Taskify
          </h3>
          </Link>

          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
            Create account to continue
          </p>

          <form onSubmit={handleSubmit}>
          <div className="w-full mt-4">
              <input
                name="name"
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="Your Name"
                aria-label="Your Name"
              />
            </div>

            <div className="w-full mt-4">
              <input
                name="email"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="email"
                placeholder="Email Address"
                aria-label="Email Address"
              />
            </div>

            <div className="w-full mt-4">
              <input
                name="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                type="password"
                placeholder="Password"
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <button className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
          <span className="text-sm text-gray-600 dark:text-gray-200">
            Already have an account?{" "}
          </span>

          <Link
            to={"/signin"}
            className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
