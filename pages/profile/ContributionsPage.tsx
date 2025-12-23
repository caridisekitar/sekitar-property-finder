import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SidebarMenu from '@/components/profile/SidebarMenu';
import { User } from '@/types';
import { secureGet } from '@/lib/secureGet';
import LoadingOverlay from '@/components/LoadingOverlay';

export default function ContributionsPage() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [listings, setListing] = useState(null);

  useEffect(() => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const fetchProfile = async () => {
            try {
              const data = await secureGet("/auth/me");
              const dataListings = await secureGet("/business/listing/" + data.user.id);
    
                // Adjust based on your API response shape
                setUser(data.user ?? data);

                setListing(dataListings.data ?? dataListings);
    
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

    if (loading) return <LoadingOverlay message="Memuat data Kontribusimu..." />;

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

        <div className="flex items-center justify-between gap-8 mb-8">
          <div>
            <h5
              className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
              Daftar bisnisku
            </h5>
          </div>
          <div className="flex flex-col gap-2 shrink-0 sm:flex-row">
            <Link to="/daftar-bisnis" className="border border-gray-800 px-4 py-2 rounded-lg text-xs lg:text-sm font-medium">
            <span className="mr-2 text-lg">+ </span>
            Tambah Bisnis</Link>
          </div>
        </div>
        
            {/* start */}
            <div className="relative flex flex-col w-full overflow-scroll bg-white border rounded-lg bg-clip-border">
              <table className="w-full text-left table-auto min-w-max">
                <thead>
                    <tr>
                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            No
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                            </svg>
                            </p>
                        </th>
                        
                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            Nama Pemilik Bisnis
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                            </svg>
                            </p>
                        </th>
                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            Nama Bisnis
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                            </svg>
                            </p>
                        </th>
                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800 truncate w-64">
                            Link website
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                            </svg>
                            </p>
                        </th>

                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            Range harga
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                            </svg>
                            </p>
                        </th>
                        <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            Status
                            </p>
                        </th>
                        {/* <th
                        className="p-4 transition-colors cursor-pointer border-b border-slate-300 bg-slate-50 hover:bg-slate-100">
                            <p
                            className="flex items-center justify-between gap-2 text-sm font-normal leading-none text-slate-800">
                            Aksi
                            </p>
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    
                      { listings?.map((listing: any, index) => (
                        <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200">
                            <p className="block text-sm text-slate-800">
                                {index + 1}
                            </p>
                        </td>
                        <td className="p-4 border-b border-slate-200">
                            <p className="block text-sm text-slate-800">
                                {listing.owner_name}
                            </p>
                        </td>
                        <td className="p-4 border-b border-slate-200">
                            <p className="block text-sm text-slate-800">
                                {listing.business_name}
                            </p>
                        </td>
                        <td className="p-4 border-b border-slate-200">
                          {listing.status === "APPROVED" ? ( 
                          <a href={`${listing.website}`} target="_blank" rel="noopener noreferrer">
                            <p className="block text-sm text-slate-800 truncate w-64">
                                {listing.website}
                            </p>
                          </a>
                          ) : (
                            <p className="block text-sm text-slate-800 truncate w-64">
                                {listing.website}
                            </p>
                          )}
                        </td>
                        <td className="p-4 border-b border-slate-200">
                            <p className="block text-sm text-slate-800">
                                {listing.price_range}
                            </p>
                        </td>
                        <td className="p-4 border-b border-slate-200">
                            <p className="block text-sm text-slate-800">
                              { listing.status === "PENDING" && (
                              <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium border-yellow-800 bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">Menunggu persetujuan</span>
                              )}
                              { listing.status === "APPROVED" && (
                              <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Disetujui</span>
                              )}
                              { listing.status === "REJECTED" && (
                              <span class="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                              )}
                            </p>
                        </td>
                        {/* <td className="p-4 border-b border-slate-200">
                          <a href="#" className="text-blue-600 hover:underline">
                            <p className="block text-sm text-slate-800">
                                Lihat Detail
                            </p>
                            </a>
                        </td> */}
                        </tr>
                      ))}
                        
                    
                   
                </tbody>
              </table>
            </div>
 
            {/* end */}
        
      </main>
    </div>
  );
}
