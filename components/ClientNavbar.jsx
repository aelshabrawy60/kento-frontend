import { NavLink, useLocation } from "react-router-dom";
import { RiHome5Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoPerson } from "react-icons/io5";

const routes = [
  { label: "home",    path: "/client",        icon: <RiHome5Fill /> },
  { label: "saved",   path: "/client/saved",   icon: <FaHeart /> },
  { label: "chat",    path: "/client/chat",    icon: <IoChatbubblesSharp /> },
  { label: "profile", path: "/client/profile", icon: <IoPerson /> },
];

function ClientNavbar() {
  const { pathname } = useLocation();

  const isActive = (path) => {
  if (path === "/client") {
    return pathname === "/client"; // exact match only
  }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <div className="w-full justify-center hidden md:flex mb-6">
        <div className="p-6 bg-[#FBFCFF] shadow-md rounded-md flex items-center justify-between w-full">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold text-primary">
            KENTO
          </NavLink>

          {/* Nav links */}
          <div className="flex gap-6">
            {routes.map((route) => {
              const active = isActive(route.path);
              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={`
                    relative flex items-center font-medium gap-2 cursor-pointer justify-center
                    transition-colors duration-300 ease-in-out
                    ${active ? "text-primary" : "text-gray-400 hover:text-gray-600"}
                  `}
                >
                  {/* Icon */}
                  <span
                    className={`
                      text-lg transition-transform duration-300 ease-in-out
                      ${active ? "scale-110" : "scale-100"}
                    `}
                  >
                    {route.icon}
                  </span>

                  {/* Label */}
                  <span className="capitalize">{route.label}</span>

                  {/* Animated underline indicator */}
                  <span
                    className={`
                      absolute -bottom-1 left-0 h-[2px] bg-primary rounded-full
                      transition-all duration-300 ease-in-out
                      ${active ? "w-full opacity-100" : "w-0 opacity-0"}
                    `}
                  />
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4">
        <div className="bg-[#ECECEC]/90 backdrop-blur-sm rounded-[50px] shadow-md p-3">
          <div className="flex justify-around gap-4">
            {routes.map((route) => {
              const active = isActive(route.path);
              return (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={`
                    flex justify-center items-center py-4 rounded-4xl font-medium gap-2 cursor-pointer
                    ${active
                      ? "bg-primary text-white px-5 flex-1"
                      : "text-gray-500 px-2 hover:text-gray-700"
                    }
                  `}
                  style={{ transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                  {/* Icon — scales up when active */}
                  <span
                    className={`
                      text-xl transition-transform duration-300
                      ${active ? "scale-110" : "scale-100"}
                    `}
                  >
                    {route.icon}
                  </span>

                  {/* Label — slides in when active */}
                  <span
                    className={`
                      text-white text-sm font-semibold capitalize overflow-hidden
                      transition-all duration-300 ease-in-out
                      ${active ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"}
                    `}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {route.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientNavbar;