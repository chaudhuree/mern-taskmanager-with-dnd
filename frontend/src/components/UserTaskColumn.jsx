import { Draggable, Droppable } from "react-beautiful-dnd";
import UserList from "./UserList";
import { useState, useEffect } from "react";
import { IoMdDoneAll } from "react-icons/io";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function UserTaskColumn({ column, tasks }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      setUserRole(JSON.parse(localStorage.getItem("user")).role);
    }
  }, []);

  return (
    <div className="flex flex-col w-[350px] min-h-[400px] bg-white shadow-lg font-bold rounded-md border  ">
      {/* Heading */}
      <div className="flex rounded-t-md items-center text-xl justify-center h-16 px-1 py-1 mb-2 bg-gray-300 text-sky-600">
        <h1>{column.title}</h1>
      </div>
      {/* Tasks container */}
      <Droppable droppableId={column.id}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="flex flex-1 px-1 flex-col mb-6"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {/* Task content container */}
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    className={`mb-1 border bg-white shadow-xl text-black rounded-md  px-4 py-4 ${
                      draggableSnapshot.isDragging
                        ? "bg-gray-100 border border-gray-200 shadow-2xl"
                        : ""
                    } ${
                      task.priority === "high"
                        ? "bg-red-100"
                        : task.priority === "normal"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                    }`}
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                  >
                    {/* Task content */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <p className={`text-base font-medium`}>{task.title}</p>
                        <p className="text-sm font-normal text-gray-500 mb-2">
                          {task.description}
                        </p>
                        <UserList users={task.users} />
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
