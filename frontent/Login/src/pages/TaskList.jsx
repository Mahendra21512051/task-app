
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import editImage from "../assets/1057097.png";
import deleteImage from "../assets/bin.png";
import sharedwithother from "../assets/next.png"
import recevied from "../assets/inbox.png"
import axios from "axios";
import confirmDialog from "../utils/ConfirmDialog";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setTasks, setTaskToEdit, deleteTask } from "../store/taskSlice";
import Swal from "sweetalert2";

const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.task);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(setTasks([]));
      return;
    }
    if (!user.id) {
      navigate("/");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Clustertaskmanagment/Taskmanegment/alldata?UserId=${user.id}`
        );
        console.log("its respose data", response);
        dispatch(setTasks(response.data.tasks));
      } catch {
        Swal.fire("Your Task List is Empty!");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, dispatch, navigate]);

  const DeleteTask = async (task) => {
    const result = await confirmDialog("Are you sure?", "warning");
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/Clustertaskmanagment/Taskmanegment/${task._id}`
        );
        dispatch(deleteTask(task._id));
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the task.", err);
      }
    }
  };

  const editTask = (task) => {
    navigate(`/edittask/${task._id}`);
  };

  const addNewTask = () => {
    dispatch(setTaskToEdit(null));
    navigate("/addnewtask");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-extrabold text-gray-700">Task List</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={addNewTask}>
            + Add Task
          </button>
        </div>
        {loading ? (
          <p className="text-gray-500 text-center">Loading tasks...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">SN</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Date</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Owner</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Category</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Task</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Status</th>
                  <th className="border border-gray-400 px-2 md:px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((t, index) => (
                    <tr key={t._id || index} className="hover:bg-gray-100 text-gray-700">
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                        {t.createdAt ? `${formatDistanceToNow(new Date(t.createdAt), { addSuffix: true })}` : "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{t.CreatedBy || "Unknown"}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{t.Category || "Unknown"}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-left">{t.Task}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">{t.Status}</td>
                      <td className="border border-gray-300 px-2 md:px-4 py-2 text-center">
                        <div className="flex items-center justify-center space-x-2 md:space-x-4">
                          <img className="w-5 md:w-6 h-5 md:h-6 cursor-pointer hover:scale-110" onClick={() => editTask(t)} src={editImage} alt="Edit" />
                          {!t.isShared && (
                             <img className="w-5 md:w-6 h-5 md:h-6 cursor-pointer hover:scale-110" onClick={() => DeleteTask(t)} src={deleteImage} alt="Delete" />

                          )}
                         
                          {t.sharedWithOthers && (
                            <img
                              className="w-5 md:w-6 h-5 md:h-6 cursor-pointer hover:scale-110"
                              src={sharedwithother}
                            />
                          )}
                          {t.isShared && (
                            <img
                              className="w-5 md:w-6 h-5 md:h-6 cursor-pointer hover:scale-110"
                              src={recevied}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center text-gray-500">No tasks added yet.</td>
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

export default TaskList;
