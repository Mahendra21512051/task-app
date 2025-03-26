
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      
      <h1 className="text-6xl md:text-9xl font-extrabold text-blue-600 text-center md:text-left md:ml-10">
        Welcome
      </h1>
      <h1 className="text-4xl md:text-6xl font-extrabold text-purple-500 text-center md:text-left md:ml-72">
        To...
      </h1>
      <h2 className="text-3xl md:text-5xl font-bold text-blue-900 text-center md:text-left md:ml-96">
        Task Management
      </h2>

      
      <div className="w-full md:w-2/3 overflow-hidden whitespace-nowrap bg-white mt-6 py-2 md:ml-60 font-semibold">
        <p className="inline-block text-4xl md:text-4xl font-semibold text-blue-500 animate-marquee">
          A place where you can manage your tasks in the best way possible. &nbsp;
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
