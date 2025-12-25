import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '../icons/UserIcon';
import HeartIcon from '../icons/HeartIcon';
import DiamondIcon from '../icons/DiamondIcon';
import HandshakeIcon from '../icons/HandshakeIcon';
import SparklesIcon from '../icons/SparklesIcon';
import LogoutIcon from '../icons/LogoutIcon';
import { securePost } from '@/lib/securePost';

const DropdownMobileMenu: React.FC = ({ user }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
      const navigate = useNavigate();

      const menuItems = [
        { name: 'Profilku', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
        { name: 'Favorit', path: '/profile/favorites', icon: <HeartIcon className="w-5 h-5" /> },
        { name: 'Langgananku', path: '/profile/subscriptions', icon: <DiamondIcon className="w-5 h-5" /> },
        { name: 'Kontribusiku', path: '/profile/contributions', icon: <HandshakeIcon className="w-5 h-5" /> },
        { name: 'Yang terbaru', path: '/profile/latest', icon: <SparklesIcon className="w-5 h-5" /> },
    ];

    const activeItem =
        [...menuItems]
            .sort((a, b) => b.path.length - a.path.length)
            .find(item =>
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/")
            ) ?? menuItems[0];


  
      const handleLogout = async () => {
          try {
              const token = localStorage.getItem('token');
  
              const data = await securePost(
                              "/auth/logout",
                              "POST",
                              {}
                            );
  
              
          } catch (e) {
              // ignore backend failure
          } finally {
              // always clear client
              localStorage.removeItem('device_id');
              localStorage.removeItem('post_login_redirect');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              sessionStorage.clear();
  
              navigate('/', { replace: true });
          }
      };

  return (
    <div className="block md:hidden p-4">
      {/* DROPDOWN HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border-2 border-gray-300 rounded-xl px-4 py-3 bg-white"
      >
        <div className="flex items-center gap-3">
          {activeItem.icon}
          <span className="text-lg font-semibold">{activeItem.name}</span>
        </div>

        <svg
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="mt-3 border rounded-xl bg-white shadow overflow-hidden">
          {menuItems
            .slice()
            .sort((a, b) => b.path.length - a.path.length)
            .map(item => (
                <DropdownLink
                key={item.path}
                item={item}
                active={
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/")
                }
                onClick={() => setOpen(false)}
                />
            ))}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-100"
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

function DropdownLink({ item, active, onClick }) {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 transition
        ${active ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-gray-100"}
      `}
    >
      {item.icon}
      {item.name}
    </Link>
  );
}

export default DropdownMobileMenu;