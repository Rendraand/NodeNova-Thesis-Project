import { motion, AnimatePresence } from "framer-motion";

import codeSnippetVideoSrc from "../../videos/code-snippet-guide.mp4";
import nodeLinkerVideoSrc from "../../videos/node-linker-guide.mp4";
import binaryTreeVideoSrc from "../../videos/tree-guide.mp4";

/**
 * @typedef {Object} VideoTutorialProps
 * @property {boolean} isOpen - State untuk membuka/tutup modal video
 * @property {function(): void} onClose - Fungsi untuk menutup modal
 * @property {string} category - Judul panduan gameplay
 */

/**
 * Komponen Modal Video Tutorial Premium untuk Skripsi
 * @param {VideoTutorialProps} props
 */
export default function VideoTutorialModal({ isOpen, onClose, category }) {
  const guideMap = {
    "code-snippet": codeSnippetVideoSrc,
    "node-linker": nodeLinkerVideoSrc,
    "binary-tree": binaryTreeVideoSrc,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // 1. Overlay Latar Belakang (Fade In)
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        >
          {/* 2. Kotak Video dengan Efek Pop-up Spring (Membal) */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat video diklik
            className="bg-zinc-100 rounded-2xl overflow-hidden max-w-xl w-full"
          >
            {/* Header Modal */}
            <div className="p-4 bg-zinc-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Panduan {category}</h3>
              <button
                onClick={onClose}
                className="text-zinc-500 hover:text-zinc-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Konten Video HTML5 */}
            <div className="relative aspect-video bg-black">
              <video
                src={guideMap[category]}
                autoPlay
                loop
                muted
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {/* Footer / Keterangan Tambahan */}
            <div className="p-4 bg-zinc-100 text-sm text-center font-medium">
              <p>
                Tonton cuplikan di atas jika kamu bingung dengan mekanik
                permainan ini.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
