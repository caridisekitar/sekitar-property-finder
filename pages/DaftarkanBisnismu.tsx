import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  User,
  Store,
  Link as LinkIcon,
  Upload,
  X,
  Phone,
  Wallet
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { securePost } from '@/lib/securePost';
import SuccessModal from "@/components/business/SuccessModal";
import LoadingOverlay from "@/components/LoadingOverlay";


type ImageItem = {
  file: File;
  preview: string;
};

type FormState = {
  owner_name: string;
  business_name: string;
  website: string;
  address: string;
  price_range: string;
  phone: string;
  images: string[];

  // honeypot
  company_fax?: string;
};

export default function DaftarkanBisnismu() {
  type ValidationErrors = Record<string, string[]>;
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Submitting...");
  const [images, setImages] = useState<ImageItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
  owner_name: "",
  business_name: "",
  website: "",
  address: "",
  price_range: "",
  phone: "",
  images: [],
  company_fax: "", // honeypot
});

  // ✅ Cleanup object URLs
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview));
    };
    
  }, [images]);

  // ✅ Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).slice(0, 3);

    const mapped: ImageItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(mapped);
  };

  // ✅ Remove image
  const removeImage = (index: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  if (loading) return <LoadingOverlay message={loadingMessage} />;

  if (!isAuthenticated) {

    localStorage.setItem("post_login_redirect", '/daftar-bisnis');

    return <Navigate to="/login" replace />;
  }

  const clearError = (key: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🛑 Honeypot
        if (form.company_fax) return;
        if (submitting) return;

        setSubmitting(true);
        setLoading(true);
        setLoadingMessage("Mengirim data bisnis...");
        setErrors({});

        try {
          const formData = new FormData();

          const website =
            form.website && !form.website.startsWith("http")
              ? `https://${form.website}`
              : form.website;

          formData.append("user_id", String(user?.id));
          formData.append("owner_name", form.owner_name);
          formData.append("business_name", form.business_name);
          formData.append("website", website);
          formData.append("address", form.address);
          formData.append("price_range", form.price_range);
          formData.append("phone", form.phone);

          images.forEach(img => {
            setLoadingMessage("Mengunggah foto...");
            formData.append("images[]", img.file);
          });

          await securePost("/business/register", "POST", formData);
          setLoadingMessage("Menyelesaikan proses...");
          

          setImages([]);
          setForm({
            owner_name: "",
            business_name: "",
            website: "",
            address: "",
            price_range: "",
            phone: "",
            company_fax: "",
          });
          // show success modal
          setShowSuccess(true);
          
        } catch (err: any) {
          
          if (err?.status === 422 ) {
            setErrors(err);
          } else {
            alert("Terjadi kesalahan, silakan coba lagi.");
          }
        } finally {
          setSubmitting(false);
          setLoading(false);
        }
};




  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <SuccessModal 
      open={showSuccess}
      onClose={() => setShowSuccess(false)}
      onGoHome={() => window.location.replace("/")}
      />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-6 text-sm text-gray-500">
        <Link to="/" className="text-gray-500 hover:text-brand-blue">Home</Link>
         <span className="mx-3">/</span>
         <span className="text-gray-900 font-medium">Daftarkan Bisnismu</span>
         <div className="w-full border-b border-gray-200 py-2"></div>
        <h1 className="text-base md:text-3xl  lg:text-4xl font-bold text-brand-dark py-4">Daftarkan Bisnismu</h1>
      </div>
      

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT CONTENT */}
        <div className="">
          <img
            src="/images/daftarkan-bisnis-hero.webp"
            alt="UMKM"
            className="w-full h-[260px] md:h-[320px] object-cover rounded-xl mb-6"
          />

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Kami percaya setiap usaha layak untuk tumbuh.
          </h2>

          <p className="text-gray-600 text-sm md:text-base">
            Karena itu, kami bantu <b>#TemanSekitar</b> mempromosikan bisnis kecil/UMKM
            secara gratis di website ini 💙 Yuk, daftarkan bisnismu hari ini.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="company_fax"
              value={form.company_fax}
              onChange={(e) =>
                setForm({ ...form, company_fax: e.target.value })
              }
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
            />
            
            {/* Owner Name */}
            <FormInput
              label="Nama Pemilik Bisnis"
              name="owner_name"
              value={form.owner_name}
              onChange={(e) => {
                setForm({ ...form, owner_name: e.target.value });
                clearError("owner_name");
              }}
              error={errors.owner_name?.[0]}
              required
              icon={<User size={18} />}
              placeholder="Tulis nama pemilik bisnis"
            />

            {/* Business Name */}
            <FormInput
              label="Nama Bisnis"
              name="business_name"
              value={form.business_name}
              onChange={(e) => {
                setForm({ ...form, business_name: e.target.value });
                clearError("business_name");
              }}
              error={errors.business_name?.[0]}
              required
              icon={<Store size={18} />}
              placeholder="Tulis nama bisnismu"
            />

            {/* Website */}
            <FormInput
              label="Link website bisnismu"
              name="website"
              value={form.website}
              onChange={(e) => {
                setForm({ ...form, website: e.target.value });
                clearError("website");
              }}
              error={errors.website?.[0]}
              icon={<LinkIcon size={18} />}
              placeholder="https://"
            />

            {/* Upload */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Foto Produk (harap kirim 3 foto terbaikmu) <span className="text-red-500">*</span>
              </label>

              {/* Upload input ONLY if no images */}
              {images.length === 0 && (
              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
                <Upload className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">
                  <b>Klik untuk unggah foto</b> atau seret foto ke bagian ini
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  SVG, PNG, JPG (maks. 800×400px, 1MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              )}

              {/* Preview */}
              {images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative w-28 h-28 rounded-xl overflow-hidden border"
                    >
                      <img
                        src={img.preview}
                        className="w-full h-full object-cover"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  {images.length} foto dipilih
                </div>
              )}

              {errors["images.0"]?.map((msg, i) => (
                <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
              ))}

              {errors["images.1"]?.map((msg, i) => (
                <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
              ))}

              {errors["images.2"]?.map((msg, i) => (
                <p key={i} className="text-red-500 text-xs mt-1">{msg}</p>
              ))}

            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-medium text-gray-900">
                Alamat bisnis
              </label>
              <textarea
                rows={4}
                placeholder="Masukkan alamat kamu..."
                value={form.address}
                onChange={(e) => {
                    setForm({ ...form, address: e.target.value });
                    clearError("address");
                  }}
                  error={errors.address?.[0]}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            {/* Price Range */}
            <FormInput
              label="Range Harga"
              name="price_range"
              value={form.price_range}
              onChange={(e) => {
                setForm({ ...form, price_range: e.target.value });
                clearError("price_range");
              }}
              error={errors.price_range?.[0]}
              required
              icon={<Wallet size={18} />}
              placeholder="10000 - 20000"
              helper="Masukkan harga tanpa koma atau titik"
            />

            {/* Phone */}
            <FormInput
              label="Nomor pemesanan"
              name="phone"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                clearError("phone");
              }}
              error={errors.phone?.[0]}
              required
              icon={<Phone size={18} />}
              placeholder="08xxxxxxxxxx"
            />


            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function FormInput({
  label,
  name,
  value,
  onChange,
  required,
  icon,
  placeholder,
  helper,
  error,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  helper?: string;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="mt-2 relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-lg border py-3 text-sm
            ${icon ? "pl-10" : "pl-3"}
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
            focus:ring-2 focus:border-gray-900`}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error}
        </p>
      )}

      {!error && helper && (
        <p className="text-xs text-gray-500 mt-1">{helper}</p>
      )}
    </div>
  );
}

