
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
export default function UserList({ users }) {
  return (
    <div className="flex items-center">
      {users.map((user, index) => (
        <div
          title={user.name}
          key={user._id}
          className={`flex cursor-pointer items-center justify-center h-6 w-6  hover:ring-1 hover: ring-sky-300 text-white rounded-full ${
            index === 0
              ? "bg-blue-500"
              : index === 1
              ? "bg-green-500"
              : "bg-yellow-500"
          }`}
        >
          {generateAvatar(user.name)}
        </div>
      ))}
    </div>
  );
}
