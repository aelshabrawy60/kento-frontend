import { NavLink, useLocation } from "react-router-dom";
import { RiHome5Fill } from "react-icons/ri";
import { IoChatbubblesSharp } from "react-icons/io5";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { FaUser } from "react-icons/fa";

const routes = [
    { label: "home",     path: "/vendor",          icon: <RiHome5Fill /> },
    { label: "chat",     path: "/vendor/chats",     icon: <IoChatbubblesSharp /> },
    { label: "packages", path: "/vendor/packages",  icon: <HiClipboardDocumentCheck /> },
    { label: "profile",  path: "/vendor/profile",   icon: <FaUser /> },
];

function VendorNavbar() {
    const { pathname } = useLocation();

    const isActive = (path) => {
        if (path === "/vendor") return pathname === "/vendor";
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* ── Desktop Navbar ── */}
            <div className="hidden md:flex items-center justify-between mb-8 py-3">
                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2 select-none">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                        style={{ background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)' }}>
                        K
                    </div>
                    <span className="text-xl font-black tracking-tight"
                        style={{ background: 'linear-gradient(135deg, #008D87, #005f5b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        KENTO
                    </span>
                </NavLink>

                {/* Nav links */}
                <div className="flex items-center gap-1 bg-gray-100/80 rounded-2xl p-1">
                    {routes.map((route) => {
                        const active = isActive(route.path);
                        return (
                            <NavLink
                                key={route.path}
                                to={route.path}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    active
                                        ? "bg-white text-primary shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <span className={`text-base transition-transform duration-200 ${active ? "scale-110" : "scale-100"}`}>
                                    {route.icon}
                                </span>
                                <span className="capitalize">{route.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* ── Mobile Bottom Navigation ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-48 px-3 pb-3">
                <div className="rounded-[28px] shadow-xl overflow-hidden"
                    style={{ background: 'rgba(245,245,245,0.92)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.8)' }}>
                    <div className="flex justify-around items-center p-2 gap-1">
                        {routes.map((route) => {
                            const active = isActive(route.path);
                            return (
                                <NavLink
                                    key={route.path}
                                    to={route.path}
                                    className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-semibold transition-all duration-300 ${
                                        active
                                            ? "text-white flex-1"
                                            : "text-gray-500"
                                    }`}
                                    style={active
                                        ? { background: 'linear-gradient(135deg, #008D87 0%, #005f5b 100%)', transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }
                                        : { transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)' }
                                    }
                                >
                                    <span className={`text-xl transition-transform duration-300 ${active ? "scale-110" : "scale-100"}`}>
                                        {route.icon}
                                    </span>
                                    <span className={`text-sm overflow-hidden capitalize transition-all duration-300 ${active ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"}`}
                                        style={{ whiteSpace: "nowrap" }}>
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

export default VendorNavbar;