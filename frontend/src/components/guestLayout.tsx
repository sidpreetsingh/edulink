
import { Outlet } from "react-router-dom";

const GuestLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 text-center bg-gray-100">
        <h1 className="text-2xl font-bold">EduLink-Course Selling Platform</h1>
      </header>

      <main >
        <Outlet />
      </main>

      <footer className="p-4 text-center text-gray-500">
        &copy; Just For Practice Purposes
      </footer>
    </div>
  );
};

export default GuestLayout;