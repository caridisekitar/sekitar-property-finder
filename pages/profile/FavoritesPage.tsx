import React from 'react';
import SidebarMenu from '@/components/profile/SidebarMenu';

export default function Favorites() {
  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200">
      <SidebarMenu />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-dark">Favoritku</h1>
                <p className="text-gray-500 mt-1">Update foto profile dan detail tentang kamu di sini</p>
            </div>
            
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl">
            

        </div>
      </main>
    </div>
  );
}
