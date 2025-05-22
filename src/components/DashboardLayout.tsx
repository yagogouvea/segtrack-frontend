import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut } from "lucide-react";

interface Button {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface Props {
  sidebarButtons: Button[];
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ sidebarButtons, children }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">SEGTRACK</h1>
        <nav className="space-y-2">
          {sidebarButtons.map((btn, i) =>
            btn.href ? (
              <Link
                key={btn.href}
                to={btn.href}
                className={`flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition ${
                  location.pathname === btn.href ? "bg-gray-800" : ""
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </Link>
            ) : (
              <button
                key={i}
                onClick={btn.onClick}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left"
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            )
          )}
        </nav>

        <hr className="border-gray-700 my-4" />
        <button
          onClick={logout}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition w-full text-left text-red-400"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
