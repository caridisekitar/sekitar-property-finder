
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { securePost } from '@/lib/securePost';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: { name: string; path: string }[];
}



const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen, navLinks, isAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');

            const data = await securePost(
                            "/auth/logout",
                            "POST",
                            {}
                          );

            // await fetch(process.env.API_URL + '/auth/logout', {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Content-Type': 'application/json',
            //     },
            // });
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
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Menu */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 text-4xl">&times;</button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-700 hover:text-brand-blue py-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        {/* <div className="mt-6 pt-3 border-t border-gray-200 flex flex-col space-y-3"> */}
          <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 text-brand-dark border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                Profil
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 text-brand-dark border border-gray-300 rounded-md hover:bg-gray-100 transition-colors text-sm"
              >
                Masuk
              </Link>
            )}

            {isAuthenticated ? (
              <button
                    onClick={handleLogout}
                    className="w-full text-center px-4 py-3 text-white bg-brand-dark rounded-md hover:bg-gray-800 transition-colors text-sm"
                >
                    <span>Log out</span>
                </button>
            ) : (
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-4 py-3 text-white bg-brand-dark rounded-md hover:bg-gray-800 transition-colors text-sm"
              >
                Daftar
              </Link>
            )}
             
              
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
