import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import UserImage from "../assets/user.png";
import { Menu, X } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>Task Management</div>
        <div className="flex items-center gap-4">
          {/* Menu Button for Mobile */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <div className="relative">
            <img
              src={UserImage}
              alt="User Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            />
            {isProfileOpen && (
              <div
                onMouseLeave={() => setIsProfileOpen(false)}
                className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg py-4 px-6 z-10"
              >
                <button className="w-full text-black font-bold px-4 py-2 rounded-lg" onClick={() => navigate("/viewprofile")}>
                  View Profile
                </button>
                <button className="w-full text-black font-bold px-4 py-2 rounded-lg" onClick={() => navigate("/changepassword")}>
                  Change Password
                </button>
                <button
                  className="w-full mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Layout */}
      <div className="flex flex-1">

        <aside
          className={`lg:w-64 bg-white text-gray-800 h-screen p-4 shadow-lg fixed lg:relative transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <ul className="space-y-2">
            <li>
              <Link to="dashboard" className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="categorylist" className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Category List
              </Link>
            </li>
            <li>
              <Link to="tasklist" className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                Task List
              </Link>
            </li>
            <li>
              <Link to="connection" className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg">
                connection
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-cover bg-center min-h-screen ">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Home;
