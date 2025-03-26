import { Link, Outlet } from "react-router-dom";

const Connection = () => {
  return (
    <div>
      {/* Header Section with Navigation */}
      <header className="bg-white p-4 flex justify-around gap-4 border-b">
        <Link
          to="allConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          All Users
        </Link>
        
        <Link
          to="seandingConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          Seanding Requests
        </Link>
        <Link
          to="recivedConnection"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          Recivend Requests
        </Link>
        <Link
          to="friends"
          className="border border-gray-400 px-4 py-2 text-black rounded-lg hover:bg-gray-100 transition"
        >
          Friends
        </Link>
      </header>

      {/* Outlet to Load Pages */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Connection;
