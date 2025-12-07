import React from 'react';
import SidebarMenu from '../components/profile/SidebarMenu';
import UserIcon from '../components/icons/UserIcon';
import EmailIcon from '../components/icons/EmailIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import GenderIcon from '../components/icons/GenderIcon';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';
import EllipsisIcon from '../components/icons/EllipsisIcon';

const ProfilePage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarMenu />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-brand-dark">Profileku</h1>
                <p className="text-gray-500 mt-1">Update foto profile dan detail tentang kamu di sini</p>
            </div>
            <button className="text-gray-500 hover:text-brand-dark">
                <EllipsisIcon className="w-6 h-6" />
            </button>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center pb-6 border-b border-gray-200">
                <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                    <h2 className="text-md font-semibold text-gray-700">Foto kamu</h2>
                    <p className="text-sm text-gray-500">Foto ini akan didisplay sebagai profile kamu</p>
                </div>
                <div className="w-full sm:w-2/3 flex items-center justify-start gap-6">
                    <img 
                        src="https://picsum.photos/seed/t1/200/200" 
                        alt="Sylvia Putri Maharani" 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                    <div className="flex gap-4">
                        <button className="text-sm font-semibold text-red-500 hover:text-red-700">Hapus</button>
                        <button className="text-sm font-semibold text-brand-blue hover:text-blue-700">Update</button>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <form className="mt-6 space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="fullName" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Nama Lengkap</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" id="fullName" defaultValue="Silvia Putri" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="email" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Alamat email</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <EmailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email" value="silviapuri0909@gmail.com" disabled className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="phone" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Nomor Telepon</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" id="phone" value="089019818272" disabled className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="gender" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Jenis Kelamin</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <GenderIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select id="gender" className="w-full appearance-none pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue bg-white">
                            <option>Perempuan</option>
                            <option>Laki-laki</option>
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="occupation" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Pekerjaan</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="text" id="occupation" defaultValue="Karyawan" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-gray-200">
                    <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Batal</button>
                    <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Simpan</button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
};
export default ProfilePage;
