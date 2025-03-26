import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import EditPage from "./pages/EditPage";
import AddNewTask from "./pages/AddNewTask";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import Category from "./pages/Category";
import AddNewCategory from "./pages/AddNewCategory";
import ViewProfile from "./pages/ViewProfile";
import Connection from "./pages/Connection";
import AllConnection from "./pages/AllConnection";
import RecivedConnection from "./pages/RecivedConnection"
import SeandingConnection from "./pages/SeandingConnection"
import Friends from "./pages/Friends"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 // Import your Header component

const App = () => {
  return (
    
      <div>
        <ToastContainer />
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginPage />} />

          {/* Main Home Section */}
          <Route path="/" element={<Home />}>
            <Route path="addnewtask" element={<AddNewTask />} />
            <Route path="edittask/:id" element={<AddNewTask />} />
            <Route path="tasklist" element={<TaskList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="viewprofile" element={<ViewProfile />} />
            <Route path="changepassword" element={<EditPage />} />
            <Route path="categorylist" element={<Category />} />
            <Route path="addnewcategory" element={<AddNewCategory />} />
            <Route path="editcategory/:id" element={<AddNewCategory />} />

            {/* Connection Section with Header and Outlet */}
            <Route path="connection" element={<Connection />}>
              <Route path="allConnection" element={<AllConnection />} />
              <Route path="seandingConnection" element={<SeandingConnection/>}/>
              <Route path="recivedConnection" element={<RecivedConnection />} />
              <Route path="friends" element={<Friends/>} />
            </Route>
          </Route>

          {/* Signup Page */}
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    
  );
};

export default App;
