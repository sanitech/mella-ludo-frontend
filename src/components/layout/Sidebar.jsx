import React from "react";
import { NavLink } from "react-router-dom";
import {
  X,
  Home,
  Users,
  CreditCard,
  DollarSign,
  BarChart3,
  Shield,
  UserCog,
  Settings,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { admin } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "User Management", href: "/users", icon: Users },
    { name: "Ban Management", href: "/bans", icon: Shield },
    { name: "Top-up Management", href: "/topup", icon: CreditCard },
    { name: "Finance Management", href: "/finance", icon: DollarSign },
    { name: "Game Transactions", href: "/transactions", icon: Gamepad2 },
    { name: "Settings", href: "/settings", icon: Settings },
    // Only show admin management for super_admin users
    // ...(admin?.role === "super_admin"
    //   ? [{ name: "Admin Management", href: "/admins", icon: UserCog }]
    //   : []),
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${open ? "block" : "hidden"}`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Mella Ludo</h1>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Mella Ludo</h1>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Admin info at bottom */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {admin?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {admin?.username}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {admin?.role?.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
