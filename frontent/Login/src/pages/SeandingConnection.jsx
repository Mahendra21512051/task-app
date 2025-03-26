import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import profileImage from "../assets/profileImage.png";
import confirmDialog from "../utils/ConfirmDialog";
import Swal from "sweetalert2";

const SendingConnection = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id || null;

  useEffect(() => {
    const fetchSentRequests = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/clustertaskmanagment/connectionmanegment/getsentRequests/${userId}`);
        console.log("Sent friend requests:", response.data.sentRequests);

        // Update state with only pending sent requests
        setSentRequests(response.data.sentRequests || []);
      } catch (error) {
        console.error("Error fetching sent friend requests:", error);
      }
    };

    fetchSentRequests();
  }, [userId]);

  // Cancel Friend Request
  const handleCancelRequest = async (connectionId) => {
    if (!userId) return;
    const result = await confirmDialog("Are you sure?", "You want to cancel this friend request.", "warning");

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/clustertaskmanagment/connectionmanegment/remove/${connectionId}`);

        // Remove the canceled request from the list
        setSentRequests(sentRequests.filter((req) => req._id !== connectionId));

        Swal.fire("Cancelled!", "Friend request has been canceled.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to cancel the request.", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sent Friend Requests</h2>
      <ul>
        {sentRequests.length > 0 ? (
          sentRequests.map((request) => (
            <li key={request._id} className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2">
              <div className="flex items-center w-1/3">
                <img src={profileImage} className="w-10 h-10 mr-2 rounded-full" alt="Profile" />
                <span>{request.receiver?.Name}</span>
              </div>

              <button 
                onClick={() => handleCancelRequest(request._id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Cancel Request
              </button>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No pending friend requests sent.</li>
        )}
      </ul>
    </div>
  );
};

export default SendingConnection;
