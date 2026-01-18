import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import DropdownMobileMenu from '@/components/profile/DropdownMobileMenu';
import LoadingOverlay from '@/components/LoadingOverlay';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';

export default function ContributionsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [user, setUser] = useState<User | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        /* ===============================
         * PROFILE
         * =============================== */
        const profileRes = await secureGet('/auth/me');
        const currentUser = profileRes.data?.user;

        if (!currentUser) {
          throw new Error('Invalid profile response');
        }

        setUser(currentUser);

        /* ===============================
         * LISTINGS
         * =============================== */
        const listingRes = await secureGet(
          `/business/listing/${currentUser.id}`
        );

        setListings(Array.isArray(listingRes.data) ? listingRes.data : []);
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  if (loading) {
    return <LoadingOverlay message="Memuat data Kontribusimu..." />;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user} />

        <div className="border-b border-gray-200 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-brand-dark">Kontribusi</h1>
          <p className="text-gray-500 mt-1">Kumpulan kost kontribusimu</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h5 className="text-xl font-semibold">Daftar bisnisku</h5>
          <Link
            to="/daftar-bisnis"
            className="border border-gray-800 px-4 py-2 rounded-lg text-xs lg:text-sm font-medium"
          >
            <span className="mr-2 text-lg">+</span> Tambah Bisnis
          </Link>
        </div>

        <div className="relative w-full overflow-x-auto bg-white border rounded-lg">
          <table className="w-full text-left table-auto min-w-max">
            <thead>
              <tr className="bg-slate-50">
                {[
                  'No',
                  'Nama Pemilik Bisnis',
                  'Nama Bisnis',
                  'Link Website',
                  'Range Harga',
                  'Status',
                ].map((h) => (
                  <th
                    key={h}
                    className="p-4 border-b border-slate-300 text-sm font-medium text-slate-800"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {listings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center text-gray-500"
                  >
                    Belum ada kontribusi bisnis
                  </td>
                </tr>
              ) : (
                listings.map((listing, index) => (
                  <tr key={listing.id ?? index} className="hover:bg-slate-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{listing.owner_name}</td>
                    <td className="p-4 border-b">{listing.business_name}</td>

                    <td className="p-4 border-b truncate max-w-xs">
                      {listing.status === 'APPROVED' ? (
                        <a
                          href={listing.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {listing.website}
                        </a>
                      ) : (
                        listing.website
                      )}
                    </td>

                    <td className="p-4 border-b">
                      {listing.price_range}
                    </td>

                    <td className="p-4 border-b">
                      {listing.status === 'PENDING' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          Menunggu persetujuan
                        </span>
                      )}
                      {listing.status === 'APPROVED' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Disetujui
                        </span>
                      )}
                      {listing.status === 'REJECTED' && (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          Ditolak
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
