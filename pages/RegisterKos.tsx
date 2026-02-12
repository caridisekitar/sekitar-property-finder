import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import HomeIcon from '../components/icons/HomeIcon';
import LinkIcon from '../components/icons/LinkIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import { useAuth } from "../hooks/useAuth";
import { securePost } from '@/lib/securePost';
import SuccessModal from "@/components/register-kos/SuccessModal";
import ErrorModal from "@/components/register-kos/ErrorModal";

const RegisterKos: React.FC = () => {
  const [kosName, setKosName] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [error, setError] = useState("");
  const { isAuthenticated, token } = useAuth();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!isAuthenticated) {
    localStorage.setItem("post_login_redirect", '/daftar-kos');
    
    return <Navigate to="/login" replace />;
  }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    // Handle form submission logic here
      try {
          const data = await securePost(
          "/daftar-kos",
          "POST",
            {
              kos_name: kosName,
              google_maps_url: mapsUrl,
              phone_number: phoneNumber,
              uid: user.id
            }
          );
          if (data.status === "success") {
            setShowSuccess(true);
            } else {
            setShowFailed(true);
            }

      } catch (err: any) {
        setShowFailed(true);
          console.log(err.message || "Submit data kos failed");
      }

      
      setKosName("");
      setMapsUrl("");
      setPhoneNumber("");
      setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <SuccessModal 
            open={showSuccess}
            onClose={() => setShowSuccess(false)}
            onGoHome={() => window.location.replace("/")}
            />
        <ErrorModal 
            open={showFailed}
            onClose={() => setShowFailed(false)}
            onGoHome={() => window.location.replace("/")}
            />
       <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                    <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
                    <span className="mx-3">/</span>
                </li>
                <li>
                    <span className="text-gray-700 font-medium">Daftarkan Kosmu</span>
                </li>
            </ol>
        </nav>
      <div className="w-full border-b border-gray-200 py-2"></div>
      <h1 className="text-base md:text-3xl  lg:text-4xl font-bold text-brand-dark py-4">Daftarkan Kosmu</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

    {/* LEFT SECTION */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src="/images/bisnis-kost.webp" // replace with your image
              alt="Owner"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />

            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Kamu pemilik kos dan mau jadi salah satunya?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Sudah lebih dari ratusan Kos kita bantu dengan memasarkan di Sekitar secara gratis.  Dengan senang hati, kami akan membantu. Yuk isi data diri dibawah ini!
              </p>
            </div>
          </div>
            {/* RIGHT SECTION */}
            <div className="bg-white overflow-hidden">
                <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="nama-kos" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kos<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <HomeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        required
                        value={kosName}
                        onChange={(e) => setKosName(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 pl-10 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                        placeholder="Tulis Nama Kos"
                    />

                    </div>
                </div>

                <div>
                    <label htmlFor="google-maps-link" className="block text-sm font-medium text-gray-700 mb-1">
                    Link google maps kos mu<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        required
                        type="url"
                        value={mapsUrl}
                        onChange={(e) => setMapsUrl(e.target.value)}
                        placeholder="Link Google Maps"
                        pattern="https://(www\.)?(google\.com/maps|maps\.app\.goo\.gl)/.*"
                        className="block w-full rounded-md border border-gray-300 pl-10 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                    />
                    </div>
                </div>

                <div>
                    <label htmlFor="nomor-telepon" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 pl-10 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm py-3"
                        placeholder="Masukkan No Telepon Penanggungjawab kos"
                    />

                    </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <button disabled={loading} className="inline-flex justify-center rounded-md border border-transparent bg-brand-dark py-3 px-8 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 transition-colors">
                    {loading ? "Mengirim..." : "Daftar"}
                </button>
                </div>
                </form>
            </div>
    </div>


    </div>
  );
};

export default RegisterKos;
