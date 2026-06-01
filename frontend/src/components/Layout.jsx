import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  );
}