import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import confirmDialog from "../utils/ConfirmDialog";
import profileImage from "../assets/profileImage.png"
import Swal from "sweetalert2";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || null;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/clustertaskmanagment/connectionmanegment/${userId}`);
        console.log("Friends Response:", response.data);

        const formattedFriends = response.data.friends.map((connection) => ({
          connectionId: connection._id,
          friendId: connection.receiver._id === userId ? connection.sender._id : connection.receiver._id,
          Name: connection.receiver._id === userId ? connection.sender.Name : connection.receiver.Name,
        }));

        setFriends(formattedFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchConnections();
  }, [userId]);

  // ✅ Show confirmation before removing a friend
  const handleRemoveFriend = async (connectionId, friendName) => {
    if (!userId || !connectionId) return;
    // Show SweetAlert2 confirmation
    const result = await confirmDialog("Are you sure?", `you want remove ${friendName}`, "warning")

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/clustertaskmanagment/connectionmanegment/remove/${connectionId}`);
        setFriends(friends.filter((friend) => friend.connectionId !== connectionId));

        Swal.fire("Removed!", `${friendName} has been removed successfully.`, "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to remove the friend.", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Friends</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.connectionId} className="flex justify-between items-center bg-green-100 p-2 rounded mb-2">
              <div className="flex justify-between w-1/4">
                <img
                  src={profileImage}
                  className="w-10 h-10"></img>
                <span>{friend.Name}</span>
              </div>

              <button
                onClick={() => handleRemoveFriend(friend.connectionId, friend.Name)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Remove
              </button>
            </li>
          ))
        ) : (
          <li>No friends found.</li>
        )}
      </ul>
    </div>
  );
};

export default Friends;


