// @ts-check
import React from "react";
import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void} props.onConfirm
 */
const ExitConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.6, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full border border-zinc-100 flex flex-col items-center text-center relative z-10"
      >
        {/* Warning Icon Banner */}
        <div className="size-16 rounded-full bg-rose-50 flex items-center justify-center mb-5 text-rose-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
            />
          </svg>
        </div>

        {/* Text Details */}
        <h3 className="text-xl font-extrabold text-zinc-800 mb-2">
          Keluar dari Misi?
        </h3>
        <p className="text-zinc-500 font-medium leading-relaxed mb-6">
          Yakin tidak ingin menyelesaikannya dulu dan kembali ke beranda?
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 hover:bg-zinc-50 active:scale-95 text-zinc-700 font-bold rounded-2xl cursor-pointer transition-all duration-200 border-x border-t border-b-3 border-zinc-200"
          >
            Batalkan
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-primary hover:bg-icy-400 text-white font-bold rounded-2xl cursor-pointer active:translate-y-[2px] transition-colors duration-150 border-b-4 border-icy-600 active:border-b-0"
          >
            Ke Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExitConfirmModal;
