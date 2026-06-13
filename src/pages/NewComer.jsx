import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import appLogo from "../assets/vector/App-Logo.svg";

const NewComer = () => {
  const { user, registerNewUser, logout } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = displayName.trim();
    if (!trimmed) {
      setError("Nama tampilan tidak boleh kosong.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Nama tampilan minimal 2 karakter.");
      return;
    }
    if (trimmed.length > 25) {
      setError("Nama tampilan maksimal 25 karakter.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await registerNewUser(trimmed);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Gagal menyimpan nama. Silakan coba lagi.", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Card container */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 flex flex-col gap-6 relative z-10 items-center">
        {/* App Logo Top Left */}
        <div className="flex items-center gap-2 select-none">
          <img src={appLogo} alt="Logo" width={32} />
          <h1 className="text-xl font-bold">NodeNova</h1>
        </div>

        {/* User Google Avatar */}
        {user?.photoURL && (
          <div className="flex justify-center select-none">
            <div className="relative">
              <img
                src={user.photoURL}
                alt="Avatar"
                className="rounded-full border-3 border-icy-200 shadow-md object-cover size-16"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full"></span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-zinc-950">Selamat datang!</h2>
          <p className="text-zinc-500 font-medium">
            Sebelum mulai, tentuin dulu yuk nama tampilan kamu!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-2">
            {/* <label htmlFor="displayName" className="text-sm font-semibold">
              Nama Tampilan Anda
            </label> */}
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Contoh: Budi Prasetyo"
              maxLength={25}
              disabled={isSubmitting}
              className="w-full rounded-2xl focus:outline-none focus:border-primary transition-all placeholder-zinc-400 font-semibold bg-zinc-100 px-4 py-3"
            />
            {error && (
              <p className="text-xs text-rose-600 font-semibold flex items-center gap-1 ms-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center h-16 gap-4">
            <button
              onClick={() => logout()}
              className="text-zinc-600 transition-colors font-bold cursor-pointer grow border-x-2 border-t-2 border-b-4 rounded-2xl py-3 border-zinc-200 hover:bg-zinc-50 active:translate-y-0.5 active:border-b-2"
            >
              Batal & Keluar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary border-b-4 border-icy-600 rounded-2xl text-white font-bold hover:bg-icy-400 cursor-pointer duration-300 active:border-b-0 active:translate-y-1 transition-colors flex items-center justify-center py-3 w-40 shrink-0 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memulai...
                </span>
              ) : (
                "Mulai"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComer;
