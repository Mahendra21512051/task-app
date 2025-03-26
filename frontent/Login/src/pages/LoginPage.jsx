import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
import Swal from "sweetalert2";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginHandler =  async() => {
    if (!email || !password) {
      Swal.fire({
        icon:"error",
        title:"oops..",
        text:"please fill Both Filled",  
      })
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/Clustertaskmanagment/loginuser", {
        Email: email,
        Password: password,
      });
      console.log("responcse",response); 
      const user =  await response.data?.user;
      dispatch(loginSuccess(user));
      // Navigate to home
      navigate("/dashboard");
    } catch (err) {
      console.error("Error during login:", err);
      Swal.fire({
        icon:"error",
        title:"error",
        text:"Invalid User!"
      })
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-96 h-auto bg-white border  rounded-lg flex flex-col justify-around items-center shadow-lg p-6">
        <div className="w-full mb-4">
          <label className="font-bold block mb-2" htmlFor="Email">
            Email:
          </label>
          <input
            id="Email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full mb-6">
          <label className="font-bold block mb-2" htmlFor="Password">
            Password:
          </label>
          <input
            id="Password"
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password here"
          />
        </div>
        <button
          className="w-full py-2 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          onClick={loginHandler}
        > Login
        </button>
        <div className="mt-5">
          <p className=" flex">New user? <p className="font-bold cursor-pointer" onClick={() => navigate("/signup")}>Signup</p></p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

