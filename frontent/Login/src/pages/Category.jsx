import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import deleteImage from "../assets/bin.png";
import editImage from "../assets/1057097.png";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";
import confirmDialog from "../utils/ConfirmDialog";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchCategories = async () => {

      try {
        const response = await axios.get(
          `http://localhost:5000/Clustertaskmanagment/Categorymanegment?UserId=${user.id}`
        );
        console.log("testing data", response)
        setCategories(response.data);
      } catch (err) {
        console.log("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);
  const addCategory = () => {
    navigate("/addnewcategory");
  };
  const editCategory = (category) => {
    navigate(`/editcategory/${category._id}`)
  };

  const deleteCategory = async (categoryId) => {
    const result = await confirmDialog("Are you sure?", "warning");

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/Clustertaskmanagment/Categorymanegment/${categoryId}`
        );

        // Remove category from state if deletion was successful
        setCategories((prevCategories) =>
          prevCategories.filter((item) => item._id !== categoryId)
        );

        Swal.fire("Deleted!", response.data.message, "success");

      } catch (err) {
        console.error("Delete Error:", err.response ? err.response.data : err.message);

        // Show popup if tasks exist
        if (err.response && err.response.status === 400) {
          Swal.fire("Cannot Delete!", err.response.data.message, "warning");
        } else {
          Swal.fire("Error!", "Failed to delete category.", "error");
        }
      }
    }
  };
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="md:text-2xl  font-extrabold text-gray-700">Category List</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={addCategory}
          >
            + Add Category
          </button>
        </div>
        {loading ? (
          <p className="text-gray-500 text-center">Loading categories...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">SN</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Date</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Category</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">No.of Tasks</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((item, index) => (
                    <tr key={item._id || index} className="hover:bg-gray-100 text-gray-700">
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                        {item.createdAt ? `${formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}` : "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{item.Category}</td>
                      <td
                        className={`border border-gray-500 px-2 md:px-4 py-2 text-center ${(item.Status?.toLowerCase() === "active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800")
                          }`}
                      >
                        {item.Status || "Unknown"}
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center ">{item.totalTasks}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                        <div className="flex items-center justify-center space-x-2 md:space-x-4">
                          <img
                            className="w-5 md:w-6 h-5 md:h-6 object-contain cursor-pointer hover:scale-110"
                            src={editImage}
                            alt="Edit"
                            onClick={() => editCategory(item)}
                            title="edit"

                          />
                          <img
                            className="w-5 md:w-6 h-5 md:h-6 object-contain cursor-pointer hover:scale-110"
                            src={deleteImage}
                            alt="Delete"
                            onClick={() => deleteCategory(item._id)}
                            title="delete"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                      No categories added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;

