import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import profileImage from "../assets/profileImage.png"
import confirmDialog from "../utils/ConfirmDialog";

const AllConnection = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || null;

  useEffect(() => {
    if (!userId) return;

    const fetchConnections = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/clustertaskmanagment/connectionmanegment/${userId}`
        );
        console.log("User Data:", response);
        setAllUsers(response.data.users);
        setSentRequests(response.data.sentRequests.map((req) => req.receiver._id));
        setReceivedRequests(response.data.receivedRequests.map((req) => ({ id: req._id, senderId: req.sender._id })));
        setFriends(response.data.friends.map((friend) => ({
          connectionId: friend._id,
          friendId: friend.receiver._id === userId ? friend.sender._id : friend.receiver._id,
        })));
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, [userId]);

  const handleSendFriendRequest = async (receiverId) => {
    try {
      await axios.post("http://localhost:5000/clustertaskmanagment/connectionmanegment/send-request", {
        senderId: userId,
        receiverId,
      });
      Swal.fire("Success!", "Friend request sent successfully!", "success");
      setSentRequests([...sentRequests, receiverId]);
    } catch (error) {
      Swal.fire("Error!", "Failed to send request.", error);
    }
  };

  const handleAcceptRequest = async (connectionId, senderId) => {
    try {
      await axios.put(`http://localhost:5000/clustertaskmanagment/connectionmanegment/update/${connectionId}`, {
        status: "accepted",
      });
      Swal.fire("Success!", "Friend request accepted!", "success");
      setFriends([...friends, { connectionId, friendId: senderId }]);
      setReceivedRequests(receivedRequests.filter((req) => req.id !== connectionId));
    } catch (error) {
      Swal.fire("Error!", "Failed to accept request.", error);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/clustertaskmanagment/connectionmanegment/update/${connectionId}`, {
          status: "rejected",
        });
        Swal.fire("Rejected", "Friend request rejected.", "info");
        setReceivedRequests(receivedRequests.filter((req) => req.id !== connectionId));
      } catch (error) {
        Swal.fire("Error!", "Failed to reject request.", error);
      }
    }
  };

  const handleRemoveFriend = async (connectionId) => {
    const result = await confirmDialog("Are you sure?", "You want to remove this friend.", "warning");
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/clustertaskmanagment/connectionmanegment/remove/${connectionId}`);
        setFriends(friends.filter((friend) => friend.connectionId !== connectionId));
        Swal.fire("Removed!", "Friend removed successfully.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to remove the friend.", error);
      }
    }
  };
  

  const filteredUsers = allUsers.filter((user) =>
    user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <input
        type="search"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-1/3 h-10 border border-gray-700 rounded-md px-3 outline-none"
      />
      <ul className="mt-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const isFriend = friends.some((friend) => friend.friendId === user._id);
            const friendData = friends.find((friend) => friend.friendId === user._id);
            const isSent = sentRequests.includes(user._id);
            const receivedRequest = receivedRequests.find((req) => req.senderId === user._id);

            return (
              <li
                key={user._id}
                className="flex justify-between items-center bg-white p-2 border border-gray-800 rounded mb-2 w-11/12 mx-auto"
              >
                <div className="flex justify-between w-1/4">
                  <img
                    src={profileImage}
                    className="w-10 h-10"></img>
                  <span>{user.Name}</span>
                </div>

                {isFriend ? (
                  <button
                    onClick={() => handleRemoveFriend(friendData.connectionId, user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                ) : receivedRequest ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(receivedRequest.id, receivedRequest.senderId)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(receivedRequest.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : isSent ? (
                  <span className="text-gray-500">Pending Request</span>
                ) : (
                  <button
                    onClick={() => handleSendFriendRequest(user._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    Add Friend
                  </button>
                )}
              </li>
            );
          })
        ) : (
          <li className="text-gray-500">No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default AllConnection;
