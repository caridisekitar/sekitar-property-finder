type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />

        {/* Text */}
        <p className="text-sm text-white">
          {message}
        </p>
      </div>
    </div>
  );
}
