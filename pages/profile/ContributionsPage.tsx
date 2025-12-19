import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';


export default function SubscriptionsPage() {
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
          const res = await fetch(
            process.env.API_URL + '/auth/me',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Me on Contributions");

          if (res.status === 401) {
            localStorage.removeItem('access_token');
            navigate('/login', { replace: true });
            return;
          }

          const data = await res.json();
          setUser(data.user);
        } catch {
          navigate('/login', { replace: true });
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [token, navigate]);

    if (loading) return <div>Loading profile...</div>;

    if (!user) return null;


  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user}/>
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <div className="w-full border-b border-gray-200 py-2">
                <h1 className="text-3xl font-bold text-brand-dark">Kontribusi</h1>
                <p className="text-gray-500 mt-1">Kumpulan kost kontribusimu</p>
            </div>
            
            
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl">
            

        </div>
      </main>
    </div>
  );
}
