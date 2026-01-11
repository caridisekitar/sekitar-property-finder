import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';
import LoadingOverlay from '@/components/LoadingOverlay';
import KostCard from '@/components/KostCard';

import { User, Kost } from '@/types';
import { secureGet } from '@/lib/secureGet';
import { securePost } from '@/lib/securePost';

export default function Favorites() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Kost[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  /* -------------------------
   * AUTH + PROFILE
   * ------------------------- */
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await secureGet('/auth/me');
        setUser(data.user ?? data);
      } catch {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  /* -------------------------
   * FAVORITES LIST (POST)
   * ------------------------- */
  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const res = await securePost('/me/favorites',
          "POST", 
          {
            user_id: user.id,
            page: 1,
            per_page: 12,
          });

        // Laravel paginator
        setFavorites(res.data ?? []);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      } finally {
        setLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loadingProfile || loadingFavorites) {
    return <LoadingOverlay message="Memuat data Favoritmu..." />;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user} />

        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-brand-dark">Favoritku</h1>
          <p className="text-gray-500 mt-1">
            Kumpulan kost favoritmu
          </p>
        </div>

        <div className="bg-white rounded-2xl">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">
                Belum ada kost favorit
              </p>
              <p className="text-sm mt-2">
                Yuk mulai simpan kost yang kamu suka ❤️
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {favorites.map((kost) => (
                <KostCard
                  key={kost.id}
                  kost={kost}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
