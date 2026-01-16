type LockedOverlayProps = {
  message?: string;
  onClose: () => void;
  onSubscribe: () => void;
};

export default function LockedOverlay({
  message = "Loading...",
  onClose,
  onSubscribe,
}: LockedOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 pointer-events-auto"
      onClick={() => {
        onClose();
      }}
    >
        <div className="absolute inset-0 flex items-start justify-center mt-[100px] md:mt-[200px] lg:mt-[200px]">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full mx-4">
              <div className="flex justify-center mb-4">
                <img
                  src="/images/icons/icon-locked.png"
                  alt="Lock Icon"
                  className="w-16 h-16"
                />
              </div>

              <h3 className="text-xl font-bold mb-2">Yah terkunci nih!</h3>

              <p className="text-gray-600 mb-6">
                Tenang, ratusan informasi kost sudah siap kamu akses. Langganan sekarang, biar cari kost jadi lebih gampang! Sssst, bikin akun nya gratis!🤫
              </p>

              <button
                onClick={() => {
                  onClose();      // close overlay
                  onSubscribe();  // open subscription modal
                }}
                className="px-6 py-3 rounded-xl bg-[#96C8E2] text-white font-semibold hover:bg-blue-600 transition"
              >
                Mulai langganan
              </button>
            </div>
          </div>
    </div>
  );
}
