import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import profileImage from "../assets/profileImage.png"
import confirmDialog from "../utils/ConfirmDialog";
import Swal from "sweetalert2";

const RecivedConnection = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || null;

  useEffect(() => {
    const fetchConnections = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/clustertaskmanagment/connectionmanegment/${userId}`);
        setFriendRequests(response.data.receivedRequests || []);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    fetchConnections();
  }, [userId]);

  const handleAcceptRequest = async (connectionId) => {
    console.log("its connection id", connectionId)
    if (!userId) return;
    try {
      await axios.put(`http://localhost:5000/clustertaskmanagment/connectionmanegment/update/${connectionId}`, {
        status: "accepted",
      });

      setFriendRequests(friendRequests.filter((req) => req._id !== connectionId));
    } catch (error) {
      Swal.fire("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (connectionId) => {
    if (!userId) return;
    const result = await confirmDialog("Are you Sure?", "warning")
    if (result.isConfirmed) {
      try {
        await axios.put(`http://localhost:5000/clustertaskmanagment/connectionmanegment/update/${connectionId}`, {
          status: "rejected",
        });
        Swal.fire("Friend request rejected!", "success");
        setFriendRequests(friendRequests.filter((req) => req._id !== connectionId));
      } catch (error) {
        Swal.fire("Error rejecting friend request:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Recived Requests</h2>
      <ul>
        {friendRequests.length > 0 ? (
          friendRequests.map((request) => (
            <li key={request._id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
              <div className="flex justify-between w-1/4">
                <img
                  src={profileImage}
                  className="w-10 h-10"></img>
                <span>{request.sender?.Name}</span>
              </div>

              <div>
                <button onClick={() => handleAcceptRequest(request._id, request.sender)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">Accept</button>
                <button onClick={() => handleRejectRequest(request._id)} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </li>
          ))
        ) : (
          <li>No friend requests.</li>
        )}
      </ul>
    </div>
  );
};

export default RecivedConnection;
