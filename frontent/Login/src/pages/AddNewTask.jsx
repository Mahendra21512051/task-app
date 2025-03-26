import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

const AddNewTask = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [pendingFriend, setPendingFriend] = useState(null);
  const [selectedResponsibility, setSelectedResponsibility] = useState("edit");


  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/Clustertaskmanagment/Categorymanegment/getstatus?UserId=${user.id}`
      );
      console.log("user category",response);
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, [user]);

  // Fetch task data if editing
  const fetchTask = useCallback(async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/Clustertaskmanagment/Taskmanegment/${id}`
      );

      const taskData = response.data;
      setTask(taskData.Task || "");
      setStatus(taskData.Status || "");
      setCategory(taskData.CategoryId?._id || taskData.CategoryId || taskData.Category || "");
    } catch (err) {
      console.error("Error fetching task:", err);
    }
  }, [id]);



  const saveDataHandler = async () => {
    if (!task.trim() || !status || !category) {
      alert("Please fill out all fields.");
      return;
    }
    if (!user?.id) {
      alert("Error: User ID is missing. Please log in again.");
      navigate("/");
      return;
    }
    try {
      const taskData = {
        UserId: user.id,
        Task: task.trim(),
        Status: status,
        CategoryId: category,
      };

      if (id) {
        await axios.patch(
          `http://localhost:5000/Clustertaskmanagment/Taskmanegment/single/${id}`,
          taskData
        );
      } else {
        await axios.post(
          "http://localhost:5000/Clustertaskmanagment/Taskmanegment",
          taskData
        );
      }

      navigate("/tasklist");
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task. Please try again.");
    }
  };
  const fetchFriends = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/clustertaskmanagment/connectionmanegment/getFriends/${user.id}`
      );
       console.log("its get friends data", response)
      if (response.data && response.data.friends) {
        const allFriends = response.data.friends.map((f) => ({
          value: f.friend._id,
          label: `${f.friend.Name} (${f.friend.Email})`, 
        }));

        // Fetch shared friends and exclude them from the friends list
        const sharedResponse = await axios.get(
          `http://localhost:5000/Clustertaskmanagment/shareTaskmanegment/getShareTask?taskId=${id}`
        );

        const sharedFriendIds = new Set(sharedResponse.data.map((f) => f.receiverId._id));

        // Filter out already shared friends from suggestions
        const filteredFriends = allFriends.filter((friend) => !sharedFriendIds.has(friend.value));

        setFriends(filteredFriends);
        setSelectedFriends(sharedResponse.data);
      }
    } catch (err) {
      console.error("Error fetching friends data:", err);
    }
  }, [user, id]);


  useEffect(() => {
    if (user?.id) {
      fetchCategories();
    }
    if (id) {
      fetchFriends();
      fetchTask();
      getSharedFriends();
    }
  }, [user, id]);
  
  

  /* share TAsk controller function */





  // Fetch Shared Friends
  const getSharedFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/Clustertaskmanagment/shareTaskmanegment/getShareTask?taskId=${id}`
      );
      console.log("Shared friends data:", response);
      setSelectedFriends(response.data);
    } catch (err) {
      console.error("Error fetching shared friends:", err);
    }
  };


  useEffect(() => {
    getSharedFriends();
  }, [user]);

  // Add Friend to List
  const addFriendToList = async () => {
    if (!pendingFriend) return;
  
    const newFriendData = {
      senderId: user.id,
      receiverId: pendingFriend.value,
      taskId: id,
      Permission: selectedResponsibility,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:5000/Clustertaskmanagment/shareTaskmanegment/shareTask",
        newFriendData
      );
  
      if (response.status === 200) {
        // Refetch shared friends immediately
        getSharedFriends();
        fetchFriends(); // Optional: Update available friend list
  
        // Reset pending friend selection
        setPendingFriend(null);
      }
    } catch (err) {
      console.error("Error sharing task:", err);
    }
  };
  
  // Remove Friend
  const removeFriend = async (shareId) => {
  if (!shareId) {
    console.error("Error: Missing shareId. Please refresh and try again.");
    return;
  }

  try {
    await axios.delete(
      `http://localhost:5000/Clustertaskmanagment/shareTaskmanegment/removeSharedTask/${shareId}`
    );

    // Refetch shared friends immediately
    getSharedFriends();
    fetchFriends(); // Optional: Update available friend list

  } catch (err) {
    console.error("Error removing friend:", err);
  }
};


  // Update Responsibility
  const updateResponsibility = async (friendId, newPermission) => {
    try {
      await axios.patch(`http://localhost:5000/Clustertaskmanagment/shareTaskmanegment/updateSharedTaskPermission/${friendId}`, { newPermission });
      setSelectedFriends((prev) =>
        prev.map((friend) =>
          friend._id === friendId ? { ...friend, Permission: newPermission } : friend
        )
      );
    } catch (err) {
      console.error("Error updating responsibility:", err);
    }
  };

  // Save Task



  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        <div className="flex justify-between">
          <h1 className="text-2xl font-extrabold text-start text-gray-700 mb-4">
            {id ? "Edit Task" : "Add New Task"}
          </h1>
          <button
            className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-blue-600 border border-blue-700 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            onClick={() => navigate("/tasklist")}
          >
            📋 Task List
          </button>
        </div>

        <div className="flex">
          <div className="flex flex-col space-y-4 w-1/2">
            <label className="text-gray-600 font-medium">Task:</label>
            <textarea
              placeholder="Enter your task..."
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 resize-none"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />

            <div className="flex space-x-4">
              <div>
                <label className="text-gray-600 font-medium">Status:</label>
                <select
                  className="w-fit px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-gray-600 font-medium">Category:</label>
                <select
                  className="w-fit px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.Category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="w-36 bg-blue-600 text-white font-bold py-2 rounded-md shadow-md hover:bg-blue-700"
              onClick={saveDataHandler}
            >
              {id ? "Update Task" : "Save Task"}
            </button>
          </div>

          {
            id && (
              <div className="w-1/2 bg-gray-50 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-2">Share With</h2>
                <div className="flex space-x-2 mb-4">
                  <Select
                    options={friends}
                    //getOptionLabel={(e) => `${e.label}`} // Customize label display
                    onChange={setPendingFriend}
                    placeholder="Search and select friends..."
                    className="flex-1"
                  />
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedResponsibility}
                    onChange={(e) => setSelectedResponsibility(e.target.value)}
                  >
                    <option value="edit">Edit</option>
                    <option value="View">View</option>
                    <option value="comment">Comment</option>
                  </select>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={addFriendToList}
                    disabled={!pendingFriend}
                  >
                    Add
                  </button>
                </div>
                {selectedFriends.length > 0 && (
                  <div className="space-y-2">
                    {selectedFriends.map((friend) => (
                      <div key={friend._id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                        <div className="w-1/3">
                        <span>{friend.receiverId.Name}</span>
                        </div>
                         <div className="w-1/2">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={friend.Permission}
                          onChange={(e) => updateResponsibility(friend._id, e.target.value)}
                        >
                          <option value="edit">Edit</option>
                          <option value="View">View</option>
                          <option value="comment">Comment</option>
                        </select>
                        </div>
                          <div className="w-1/3">
                        <button
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => removeFriend(friend._id, friend.receiverId._id, friend.receiverId.Name)}
                        >
                          Remove
                        </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )

          }
        </div>
      </div>
    </div>
  );
};

export default AddNewTask;



