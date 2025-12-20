import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserIcon from '../icons/UserIcon';
import HeartIcon from '../icons/HeartIcon';
import DiamondIcon from '../icons/DiamondIcon';
import HandshakeIcon from '../icons/HandshakeIcon';
import SparklesIcon from '../icons/SparklesIcon';
import LogoutIcon from '../icons/LogoutIcon';

const SidebarMenu: React.FC = ({ user }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');

            await fetch(process.env.API_URL + '/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (e) {
            // ignore backend failure
        } finally {
            // always clear client
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.clear();

            navigate('/', { replace: true });
        }
    };

    const menuItems = [
        { name: 'Profilku', path: '/profile', icon: <UserIcon className="w-5 h-5" /> },
        { name: 'Favorit', path: '/profile/favorites', icon: <HeartIcon className="w-5 h-5" /> },
        { name: 'Langgananku', path: '/profile/subscriptions', icon: <DiamondIcon className="w-5 h-5" /> },
        { name: 'Kontribusiku', path: '/profile/contributions', icon: <HandshakeIcon className="w-5 h-5" /> },
        { name: 'Yang terbaru', path: '/profile/latest', icon: <SparklesIcon className="w-5 h-5" /> },
    ];
    
    const isActive = (path: string) => {
        if (path === '/profile') {
            return location.pathname === '/profile';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside className="hidden lg:flex w-72 bg-white flex-col justify-between border-r">
            <div>
                <div className="px-8 py-6">
                    <div className="p-4 border border-gray-200 rounded-2xl flex flex-col items-center text-center">
                        <img 
                            src="https://picsum.photos/seed/t1/200/200" 
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover mb-4"
                        />
                        <h3 className="font-bold text-lg text-brand-dark capitalize">{user.name}</h3>
                    </div>
                </div>
                <nav className="px-6 py-4">
                    <ul>
                        {menuItems.map(item => (
                             <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-sm font-semibold transition-colors ${
                                        isActive(item.path)
                                        ? 'bg-[#DCF4FF]'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="px-6 py-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
};

export default SidebarMenu;
