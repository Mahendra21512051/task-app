import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import confirmDialog from "../utils/ConfirmDialog"; 
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    oldPassword: "",
    NewPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (!user) {
      navigate("/loginPage");
    }
  }, [user, navigate]);

  const updateHandler = async () => {
    const result = await confirmDialog("Are you sure you want to change your password?", "warning");
    if (result.isConfirmed) {
      if (profile.NewPassword !== profile.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "New Password and Confirm Password do not match!",
        });
        return;
      }
      try {
        await axios.patch(
          `http://localhost:5000/Clustertaskmanagment/resetPassword/${user.id}`,
          {
            Id: user.id,
            oldPassword: profile.oldPassword,
            newPassword: profile.NewPassword,
          }
        );
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Password updated successfully!",
        });
        navigate("/dashboard");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Failed to update password!",
          text: error.response?.data?.message || "Please try again.",
        });
      }
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <div className="w-full bg-white border rounded-lg p-6 space-y-6 shadow-lg flex flex-col">
        <h2 className="text-2xl font-extrabold text-gray-600 text-start">
          Change Password
        </h2>
        <div className="flex flex-col space-y-4">
    <input
    type="password"
    className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
    value={profile.oldPassword}
    onChange={(e) => setProfile({ ...profile, oldPassword: e.target.value })}
    placeholder="Enter Old Password"
  />
  <input
    type="password"
    className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
    value={profile.NewPassword}
    onChange={(e) => setProfile({ ...profile, NewPassword: e.target.value })}
    placeholder="Enter New Password"
  />
  <input
    type="password"
    className="w-full md:w-1/2 border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
    value={profile.confirmPassword}
    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
    placeholder="Confirm Password"
  />
</div>
<button
  className="w-56 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all"
  onClick={updateHandler}>
  Change Password
</button>
    </div>
    </div>
  );
};
export default EditPage;
