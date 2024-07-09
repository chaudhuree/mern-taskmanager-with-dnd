import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddTask from "./pages/AddTask";
import UpdateTask from "./pages/UpdateTask";
import Tasks from "./pages/Tasks";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

axios.defaults.baseURL = "http://localhost:5000/api/v1";

function App() {
  return (
    <div className="container mx-auto px-5 min-h-screen flex flex-col">
      <div className="flex-1">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Tasks />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/addtask" element={<AddTask />} />
            <Route path="/updatetask/:id" element={<UpdateTask />} />
          </Routes>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
