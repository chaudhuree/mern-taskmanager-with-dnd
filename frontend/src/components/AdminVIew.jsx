import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminTaskColumn from "./AdminTaskColumn";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import toast from "react-hot-toast";
import Spinner from "./Spinner";

// Function to reorder tasks within the same column
const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskLists = Array.from(sourceCol.taskLists);
  const [removed] = newTaskLists.splice(startIndex, 1);
  newTaskLists.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskLists: newTaskLists,
  };

  return newColumn;
};

// Function to update the status of a task based on the destination column
const updateTaskStatus = async (task, newStatus) => {
  await axios.put(
    `/task/status/${task._id}`,
    { status: newStatus },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  toast.success("Task status updated successfully");
  return { ...task, status: newStatus };
};

function AdminView() {
  const [loading, setLoading] = useState(true); 
  const [tasks, setTasks] = useState([]);
  const [state, setState] = useState({
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get("/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(data.tasks);
        const columns = {
          "column-1": {
            id: "column-1",
            title: "TODO",
            taskLists: data.tasks.filter((task) => task.status === "todo"),
          },
          "column-2": {
            id: "column-2",
            title: "INPROGRESS",
            taskLists: data.tasks.filter(
              (task) => task.status === "inprogress"
            ),
          },
          "column-3": {
            id: "column-3",
            title: "COMPLETED",
            taskLists: data.tasks.filter((task) => task.status === "completed"),
          },
        };

        const columnOrder = ["column-1", "column-2", "column-3"];
        setState({ columns, columnOrder });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchTasks();
  }, []);

  
  const handleOnDragEnd = async (result) => {
    const { destination, source } = result;
  
    // Check if the task is dropped outside the droppable area
    if (!destination) return;
  
    // Check if the task is dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
  
    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];
    const draggedTask = sourceCol.taskLists[source.index];
  
    // Optimistically update UI before backend update
    const updatedSourceTaskLists = Array.from(sourceCol.taskLists);
    updatedSourceTaskLists.splice(source.index, 1);
    const updatedSourceCol = {
      ...sourceCol,
      taskLists: updatedSourceTaskLists,
    };
  
    const updatedDestinationTaskLists = Array.from(destinationCol.taskLists);
    updatedDestinationTaskLists.splice(destination.index, 0, draggedTask);
    const updatedDestinationCol = {
      ...destinationCol,
      taskLists: updatedDestinationTaskLists,
    };
  
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [updatedSourceCol.id]: updatedSourceCol,
        [updatedDestinationCol.id]: updatedDestinationCol,
      },
    };
  
    setState(newState);
  
    // Backend update
    try {
      await updateTaskStatus(draggedTask, destinationCol.title.toLowerCase());
  
      // Optional: Show success toast if needed
      // toast.success("Task moved successfully");
    } catch (error) {
      // Handle backend update failure if needed
      console.error("Error updating task status:", error);
  
      // Revert UI changes on error (if needed)
      setState(state); // Reset to previous state
      toast.error("Failed to move task");
    }
  };
  

  // Render different components based on loading and tasks availability
  if (loading) return <Spinner />;

  if (tasks.length === 0)
    return (
      <>
        <div className="flex justify-center items-center flex-col gap-4 my-10">
          <h1 className="text-center mt-5 text-2xl">No tasks found</h1>
          <Link
            to="/addtask"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Add Task
          </Link>
        </div>
      </>
    );

  // If tasks are available, render the main component
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="p-4 text-sky-400">
        <h1 className="w-2/4 text-center mx-auto text-4xl font-extrabold my-5">
          Task Board
        </h1>
        <div className="flex justify-center lg:justify-end my-10">
          <Link
            to="/addtask"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
          >
            Add Task
          </Link>
        </div>
        <div className="flex justify-center gap-6 flex-wrap px-4">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskLists;

            return (
              <AdminTaskColumn key={column.id} column={column} tasks={tasks} />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

export default AdminView;
