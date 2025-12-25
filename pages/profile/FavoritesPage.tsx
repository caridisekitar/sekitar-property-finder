import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import LoadingOverlay from '@/components/LoadingOverlay';
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';
  
export default function Favorites() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const fetchProfile = async () => {
            try {
              const data = await secureGet("/auth/me");
    
                // Adjust based on your API response shape
                setUser(data.user ?? data);
    
            } catch (err) {
                // Token invalid / expired / unauthorized
                localStorage.removeItem("token");
                localStorage.removeItem("user");
    
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

      fetchProfile();
    }, [token, navigate]);

    if (loading) return <LoadingOverlay message="Memuat data Favoritmu..." />;

    if (!user) return null;

  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user}/>
        <div className="flex justify-between items-center mb-8">
            <div className="w-full border-b border-gray-200 py-2">
                <h1 className="text-3xl font-bold text-brand-dark">Favoritku</h1>
                <p className="text-gray-500 mt-1">Kumpulan kost favoritmu</p>
            </div>
            
            
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl">
            

        </div>
      </main>
    </div>
  );
}
