import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from '../components/profile/SidebarMenu';
import UserIcon from '../components/icons/UserIcon';
import EmailIcon from '../components/icons/EmailIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import GenderIcon from '../components/icons/GenderIcon';
import BriefcaseIcon from '../components/icons/BriefcaseIcon';
import EllipsisIcon from '../components/icons/EllipsisIcon';
import { User } from '../types';
import { securePost } from '@/lib/securePost';
import { secureGet } from '@/lib/secureGet';
import LoadingOverlay from '@/components/LoadingOverlay';
import DropdownMobileMenu from '../components/profile/DropdownMobileMenu';


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    name: '',
    gender: '',
    occupation: '',
    });

    const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
    });

    const [changingPassword, setChangingPassword] = useState(false);


    useEffect(() => {
        if (!user) return;

        setForm({
            name: user.name || '',
            gender: user.gender || '',
            occupation: user.occupation || '',
        });
        }, [user]);

    
  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
        try {
            
            const data = await secureGet("/auth/me");

            // Adjust based on your API response shape
            setUser(data.data.user);

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

  if (loading) return <LoadingOverlay message="Memuat data Profile ..." />;

  if (!user) return null;

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saving) return;
    setSaving(true);

    try {
        const payload = {
        name: form.name,
        gender: form.gender || null,
        occupation: form.occupation || null,
        };

        const res = await securePost(
        "/auth/profile",
        "PUT",
        payload
        );

        const updatedUser = res.data.user;

        // ✅ update user
        setUser(updatedUser);

        // ✅ force sync form
        setForm({
        name: updatedUser.name || '',
        gender: updatedUser.gender || '',
        occupation: updatedUser.occupation || '',
        });

        alert("Profile berhasil diperbarui");
    } catch (err: any) {
        alert(err.message || "Update failed");
    } finally {
        setSaving(false);
    }
    };

    // Change password
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (changingPassword) return;

        if (!passwordForm.current_password || !passwordForm.new_password) {
            alert("Semua field password wajib diisi");
            return;
        }

        if (passwordForm.new_password.length < 8) {
            alert("Password baru minimal 8 karakter");
            return;
        }

        if (passwordForm.new_password !== passwordForm.confirm_password) {
            alert("Konfirmasi password tidak sama");
            return;
        }

        try {
            setChangingPassword(true);

            await securePost(
            "/auth/change-password",
            "POST",
            {
                current_password: passwordForm.current_password,
                new_password: passwordForm.new_password,
            }
            );

            alert("Password berhasil diubah. Silakan login ulang.");

            // 🔐 FORCE LOGOUT
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/login", { replace: true });

        } catch (err: any) {
            alert(err.message || "Gagal mengubah password");
        } finally {
            setChangingPassword(false);
        }
        };




  return (
    <div className="flex min-h-screen mb-12 border-t border-gray-200 container mx-auto">
      <SidebarMenu user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <DropdownMobileMenu user={user}/>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-xl md:text-3xl lg:text-3xl font-bold text-brand-dark">Profileku</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-md lg:text-md">Update foto profil dan detail tentang kamu di sini</p>
            </div>
            {/* <button className="text-gray-500 hover:text-brand-dark">
                <EllipsisIcon className="w-6 h-6" />
            </button> */}
        </div>

        <div className="bg-white md:p-6 lg:p-6 sm:p-8 rounded-2xl">
            {/* Profile Photo Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center pb-6 border-b border-gray-200">
                <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                    <h2 className="text-md font-semibold text-gray-700">Foto kamu</h2>
                    <p className="text-sm text-gray-500">Foto ini akan ditampilkan sebagai profil kamu</p>
                </div>
                <div className="w-full sm:w-2/3 flex items-center justify-start gap-6">
                    <img 
                        src="/images/icons/user.png" 
                        alt='user'
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                    {/* <div className="flex gap-4">
                        <button className="text-sm font-semibold text-red-500 hover:text-red-700">Hapus</button>
                        <button className="text-sm font-semibold text-brand-blue hover:text-blue-700">Update</button>
                    </div> */}
                </div>
            </div>

            {/* Profile Form */}
            <form className="mt-6 space-y-6" onSubmit={handleSubmitUpdate}>
                 <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="fullName" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Nama Lengkap</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        {/* <input type="text" id="fullName" defaultValue={user.name} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue capitalize" /> */}
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue capitalize"
                            />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="email" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Alamat email</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <EmailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="email" id="email" value={user.email} disabled className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="phone" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Nomor Telepon</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input type="tel" id="phone" value={user.phone} disabled className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed text-gray-500" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                    <label htmlFor="gender" className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">Jenis Kelamin</label>
                    <div className="w-full md:w-2/3 relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <GenderIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            className="w-full appearance-none pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue bg-white"
                            >
                            <option value="">Pilih Jenis Kelamin</option>
                            <option value="perempuan">Perempuan</option>
                            <option value="laki_laki">Laki-laki</option>
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
                        <input
                            type="text"
                            value={form.occupation}
                            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue"
                            />
                        {/* <input type="text" id="occupation" defaultValue={user.occupation || ''} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-blue focus:border-brand-blue" /> */}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 mt-4 border-t border-gray-200">
                    <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Batal</button>
                    {/* <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">Simpan</button> */}
                    <button
                        type="submit"
                        disabled={saving}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors
                            ${saving ? 'bg-gray-400' : 'bg-brand-dark hover:bg-gray-800'}`}
                        >
                        {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                </div>
            </form>

            {/* ================= CHANGE PASSWORD ================= */}
                <div className="mt-10 pt-6 border-t border-gray-200">
                <h2 className="text-md font-semibold text-gray-700 mb-4">
                    Ubah Password
                </h2>

                <form className="space-y-5" onSubmit={handleChangePassword}>
                    {/* CURRENT PASSWORD */}
                    <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">
                        Password Lama
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) =>
                            setPasswordForm({ ...passwordForm, current_password: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    </div>

                    {/* NEW PASSWORD */}
                    <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">
                        Password Baru
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) =>
                            setPasswordForm({ ...passwordForm, new_password: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="flex flex-col md:flex-row md:items-center">
                    <label className="w-full md:w-1/3 text-sm font-medium text-gray-700 mb-2 md:mb-0">
                        Konfirmasi Password
                    </label>
                    <div className="w-full md:w-2/3">
                        <input
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirm_password: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    </div>

                    <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={changingPassword}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white
                        ${changingPassword ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
                    >
                        {changingPassword ? "Memproses..." : "Ubah Password"}
                    </button>
                    </div>
                </form>
                </div>

        </div>
      </main>
    </div>
  );
};
export default ProfilePage;
