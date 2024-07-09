import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import toast from "react-hot-toast";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal"); // [low, normal, high]
  const [status, setStatus] = useState("todo"); // [todo, inprogress, completed]
  const [users, setUsers] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/all-users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(data);
        console.log("data:", data);
        console.log("users:", users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const animatedComponents = makeAnimated();
  const options = users?.map((user) => ({
    value: user._id,
    label: user.name,
  }));
  const priorityOprions = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
  ];
  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "inprogress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!title || !description || selectedOptions.length === 0) {
        return toast.error("All fields are required");
      }
      const userIds = selectedOptions.map((option) => option.value);
      const { data } = await axios.post(
        "/task",
        {
          title,
          description,
          users: userIds,
          priority,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Task added successfully");
      setTitle("");
      setDescription("");
      setSelectedOptions([]);
      navigate("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <section className="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md dark:bg-gray-800 mt-14">
      <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-white">
        Add Task
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
            />
          </div>
          <div>
            <label className="text-gray-700 dark:text-gray-200" htmlFor="users">
              Selected Users
            </label>
            <Select
              id="users"
              closeMenuOnSelect={false}
              components={animatedComponents}
              defaultValue={selectedOptions}
              isMulti
              options={options}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="priority"
            >
              Priority
            </label>
            <Select
              id="priority"
              options={priorityOprions}
              onChange={(selectedOption) => setPriority(selectedOption.value)}
              defaultValue={priorityOprions[1]}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label
              className="text-gray-700 dark:text-gray-200"
              htmlFor="status"
            >
              Status
            </label>
            <Select
              id="status"
              options={statusOptions}
              onChange={(selectedOption) => setStatus(selectedOption.value)}
              defaultValue={statusOptions[0]}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>
        <div className="my-6">
          <label
            className="text-gray-700 dark:text-gray-200"
            htmlFor="description"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
          />
        </div>
        <div className="flex justify-end mt-6">
          <button className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
