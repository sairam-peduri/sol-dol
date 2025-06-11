import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-center space-x-6 text-indigo-800 font-medium">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-indigo-600 underline" : "hover:text-indigo-600"
        }
      >
        🏠 Home
      </NavLink>
      <NavLink
        to="/goals"
        className={({ isActive }) =>
          isActive ? "text-indigo-600 underline" : "hover:text-indigo-600"
        }
      >
        🎯 Goals
      </NavLink>
      <NavLink
        to="/tips"
        className={({ isActive }) =>
          isActive ? "text-indigo-600 underline" : "hover:text-indigo-600"
        }
      >
        🌾 Farm Tips
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive ? "text-indigo-600 underline" : "hover:text-indigo-600"
        }
      >
        📘 About
      </NavLink>
    </nav>
  );
}
