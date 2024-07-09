import React from "react";
import { Link } from "react-router-dom";
function generateAvatar(name) {
  if (name) {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    return initials;
  } else {
    return "UK";
  }
}

export default function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };
  return (
    <div className="navbar bg-base-100 mx-0 px-0">
      <div className="flex-1">
        <Link to="/" className=" text-2xl font-bold">
          Taskify
        </Link>
      </div>
      <div className="flex-none gap-2">
        {localStorage.getItem("token") ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost font-bold text-white size-12 flex items-center justify-center rounded-full bg-blue-500 text-2xl"
            >
              {generateAvatar(JSON.parse(localStorage.getItem("user")).name)}
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <div className="my-2">
                {" "}
                <p className="text-sm uppercase font-bold text-center text-sky-700 ">
                  {JSON.parse(localStorage.getItem("user")).name}(
                  <span className="text-yellow-600  lowercase">
                    {JSON.parse(localStorage.getItem("user")).role}
                  </span>)
                </p>
              </div>
              <div className="flex justify-center items-center my-2">
                <button
                  className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-500 rounded-lg hover:bg-red-400 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </ul>
          </div>
        ) : (
          <Link
            to="/signin"
            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
