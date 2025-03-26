import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"

const Signup = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    cnfmPassword: ""
  })
  const navigate = useNavigate()
  const signHandler = async (e) => {
    e.preventDefault();
    if (profile.password !== profile.cnfmPassword) {
      Swal.fire({
        icon: "error",
        text: "password not  match",
      })
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/Clustertaskmanagment", {
        Name: profile.name,
        Email: profile.email,
        Password: profile.password,
      })
      console.log("Response data for signup:", response.data);
      localStorage.setItem("token", response.data.token);
      Swal.fire({
        icon: "suceess",
        text: " Congratulation signup Successfully!"
      })
      navigate('/');
    }
    catch (err) {
      if (err.response && err.response.status === 400) {
        Swal.fire({
          icon: "warning",
          text: "User is Already Resisited. please login",
        })
      } else {
        console.log("Signup error", err)
        Swal.fire({
          icon: "error",
          text: "Something went wrong. Please try again later.",
        })
      }
    }
  }
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}

              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}

              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={profile.cnfmPassword}
              onChange={(e) => setProfile({ ...profile, cnfmPassword: e.target.value })}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-3 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-bold text-center"
              onClick={signHandler}
            >
              Submit
            </button>
            <p className=" text-center flex">Already a User?<p className="font-bold text-center cursor-pointer" onClick={()=>navigate("/")}>Login</p></p>
            
          </div>

        </form>
      </div>
    </div>
  );
};
export default Signup;

