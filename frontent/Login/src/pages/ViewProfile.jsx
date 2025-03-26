import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import profilePhoto from "../assets/user (1).png";

const ViewProfile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Profile State
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (!user) {
      navigate("/loginpage");
    } else {
      setProfile({
        id: user.id || "",
        name: user.Name || "",
        email: user.Email || "",
      });
    }
  }, [user, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Save updated profile
  const handleSave = async () => {
    Swal.fire({
      title:" Are you sure?",
      icon:"warning",
      showCancelButton:true,
      confirmButtonColor:"#3085d6",
      cancelButtonColor:"#d33",
      confirmButtonText:"Yes, Change it!"
    }).then(async(result)=>{
      if(result.isConfirmed){
        try {
           await axios.patch(
            `http://localhost:5000/Clustertaskmanagment/${profile.id}`,
            profile
          );
          //console.log("Profile updated:", response.data);
          Swal.fire("Profile updated successfully!");
          setIsEditing(false);
        } catch (err) {
          //console.error("Error updating profile:", err);
          Swal.fire("Error!","Failed to update profile. Please try again.",err);
        }
      }

      
    });
  }

    

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full flex flex-row items-center">
        {/* Profile Image */}
        
        {/* Profile Info */}
        <div className="w-2/3 space-y-5">
          <h2 className="text-3xl font-bold text-gray-700 text-start mb-6">Profile</h2>
          <div className="flex space-x-5">
            <label className="flex items-center text-lg font-bold text-gray-700 mb-1 px-4">ID:</label>
            <input
              type="text"
              name="id"
              value={profile.id}
              className="w-full px-4 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="flex space-x-5">
            <label className="flex items-center text-lg font-bold text-gray-700 mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={!isEditing}
            />
          </div>
          <div className="flex space-x-5">
            <label className=" text-lg font-bold text-gray-700 mb-1 items-center flex">Email:</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={!isEditing}
            />
          </div>
          <div className="text-start mt-6">
            {!isEditing ? (
              <button
                className="w-32 bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition-all"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="w-32 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-500 transition-all"
                onClick={handleSave}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center w-1/3">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-40 h-40 rounded-full border-4 border-gray-300 shadow-md"
          />
        </div>
      </div>
      
    </div>
  );
};

export default ViewProfile;
