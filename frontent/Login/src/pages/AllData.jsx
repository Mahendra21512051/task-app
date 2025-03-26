import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Homeimage from "../assets/download.png";
const AllData = () => {
  const [users, setUsers] = useState([]);
  const [editingUser,] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const Navigate = useNavigate();
  const getHandler = async () => {
    try {
      const response = await axios.get("http://localhost:5000/testlogin");
      console.log("API Response:", response.data);
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  // Delete User Handler
  const deleteUser = async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }
      const response = await axios.delete(`http://localhost:5000/testlogin/${userId}`);
      console.log("Delete Response:", response.data);

      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };
  // Update User Handler
  const updateUser = async (userId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/testlogin/${userId}`, {
        Name: editedName,
        Email: editedEmail
      });
      console.log("Update Response:", response.data);
      setUsers(users.map((user) =>
        user._id === userId ? { ...user, Name: editedName, Email: editedEmail } : user
      ));
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };
  useEffect(() => {
    getHandler();
  }, []);
  return (
    <div className="w-9/12 mx-auto h-full bg-slate-400 border border-gray-500 rounded-md p-4">
      <div className="flex items-start p-5 justify-around">
        <img
          src={Homeimage}
          alt="Home icon"
          className="w-12 h-12 object-contain bg-slate-500 hover:cursor-pointer"
          onClick={() => (Navigate("/"))}
        />
        <h2 className="text-center font-bold text-2xl mb-4">All Users Data</h2>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="flex flex-row items-center justify-between mb-4 bg-white p-2 rounded-md shadow-md">
            <div className="w-1/3">
              <label htmlFor={`Name-${user._id}`} className="font-bold">Name:</label>
              {editingUser === user._id ? (
                <input
                  id={`Name-${user._id}`}
                  type="text"
                  className="w-full h-10 p-2 border rounded-md"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                <input
                  id={`Name-${user._id}`}
                  type="text"
                  className="w-full h-10 p-2 border rounded-md"
                  value={user.Name}
                  readOnly
                />
              )}
            </div>

            <div className="w-1/3">
              <label htmlFor={`Email-${user._id}`} className="font-bold">Email:</label>
              {editingUser === user._id ? (
                <input
                  id={`Email-${user._id}`}
                  type="email"
                  className="w-full h-10 p-2 border rounded-md"
                  value={editedEmail}
                  onChange={(e) => setEditedEmail(e.target.value)}
                />
              ) : (
                <input
                  id={`Email-${user._id}`}
                  type="email"
                  className="w-full h-10 p-2 border rounded-md"
                  value={user.Email}
                  readOnly
                />
              )}
            </div>

            <div className="flex flex-row justify-around items-center w-1/3">
              <button
                onClick={() => deleteUser(user._id)}
                className="border border-gray-300 bg-red-500 rounded-md text-white w-16 h-8">
                Delete
              </button>
              {editingUser === user._id ? (
                <button
                  onClick={() => updateUser(user._id)}
                  className="border border-gray-300 bg-blue-500 rounded-md text-white w-16 h-8"
                >
                  Save
                </button>
              ) : (
                <Link
                  to="/data"
                  state={{
                    id: user._id,
                    name: user.Name,
                    email: user.Email,
                  }}
                  className="border border-gray-300 bg-yellow-500 rounded-md text-white w-16 h-8"
                >
                  Edit
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllData;
