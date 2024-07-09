import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import toast from "react-hot-toast";
import UserTaskColumn from "./UserTaskColumn";
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

function UserView() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [state, setState] = useState({
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get(
          `/tasks/user/${JSON.parse(localStorage.getItem("user"))._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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

  // Function to handle drag and drop of tasks
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
  
    // Optimistically update UI before backend update
    if (source.droppableId === destination.droppableId) {
      // Handle reordering within the same column
      const reorderedTasks = Array.from(sourceCol.taskLists);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
  
      const newColumn = {
        ...sourceCol,
        taskLists: reorderedTasks,
      };
  
      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
  
      setState(newState);
  
    } else {
      // Handle moving between different columns
      const sourceTaskLists = Array.from(sourceCol.taskLists);
      const [removedTask] = sourceTaskLists.splice(source.index, 1);
  
      const updatedSourceCol = {
        ...sourceCol,
        taskLists: sourceTaskLists,
      };
  
      const destinationTaskLists = Array.from(destinationCol.taskLists);
      destinationTaskLists.splice(destination.index, 0, removedTask);
  
      const updatedDestinationCol = {
        ...destinationCol,
        taskLists: destinationTaskLists,
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
        await updateTaskStatus(removedTask, destinationCol.title.toLowerCase());
  
        // Optional: Show success toast if needed
        toast.success("Task moved successfully");
      } catch (error) {
        // Handle backend update failure if needed
        console.error("Error updating task status:", error);
  
        // Revert UI changes on error (if needed)
        setState(state); // Reset to previous state
        toast.error("Failed to move task");
      }
    }
  };
  

  if (loading) {
    return <Spinner />;
  }
  if (!loading && tasks.length === 0)
    return <h1 className="text-center mt-5 text-2xl">No tasks found</h1>;
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="p-4 text-sky-400">
        <h1 className="w-2/4 text-center mx-auto text-4xl font-extrabold my-5">
          Task Board
        </h1>

        <div className="flex justify-center gap-4 flex-wrap px-4">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskLists;

            return (
              <UserTaskColumn key={column.id} column={column} tasks={tasks} />
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

export default UserView;
