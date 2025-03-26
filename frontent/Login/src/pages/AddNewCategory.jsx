import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddNewCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get category ID from URL params
  const { user } = useSelector((state) => state.auth);
  
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch category details if editing an existing category
  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/Clustertaskmanagment/Categorymanegment/getById/${id}`
          );
          setCategory(data.Category);
          setStatus(data.Status);
        } catch (err) {
          console.error("Error fetching category:", err);
        }
      };
      fetchCategory();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!category || !status) {
      alert("Please fill in all fields.");
      return;
    }
    if (!user?.id) {
      alert("User session expired. Please log in again.");
      navigate("/");
      return;
    }

    try {
      if (id) {
        // Update existing category
        await axios.patch(
          `http://localhost:5000/Clustertaskmanagment/Categorymanegment/${id}`,
          {
            Category: category,
            Status: status,
          }
        );
      } else {
        // Create new category
        await axios.post(
          "http://localhost:5000/Clustertaskmanagment/Categorymanegment",
          {
            UserId: user.id,
            Category: category,
            Status: status,
          }
        );
      }
      navigate("/categorylist");
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center w-full flex-nowrap gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-700">
            {id ? "Edit Category" : "Add New Category"}
          </h1>
          <button
            className="flex items-center gap-2 px-4 sm:px-6 py-2 text-white bg-blue-600 border border-blue-700 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95"
            onClick={() => navigate("/categorylist")}
          >
            📂 Category List
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col space-y-4">
          {/* Category Name */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Category Name:</label>
            <input
              type="text"
              placeholder="Enter category name..."
              className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex flex-col">
            <label className="text-gray-600 font-medium">Status:</label>
            <select
              className="w-1/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            className="w-36 bg-blue-600 text-white font-bold py-2 rounded-md shadow-md hover:bg-blue-700 transition-all"
            onClick={handleSubmit}
          >
            {id ? "Update Category" : "Save Category"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
