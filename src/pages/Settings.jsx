import { useAudio } from "../context/AudioContext";
import { motion } from "motion/react";

import "../styles/custom.css";

export default function Settings() {
  // Ambil semua state dan kontroler audio dari global context
  const { volume, isMuted, changeVolume, toggleMute, playSFX } = useAudio();
  const sliderStyle = {
    background: `linear-gradient(to right, var(--color-primary) ${volume * 100}%, var(--color-zinc-300) ${volume * 100}%)`,
  };

  return (
    <div className="rounded-lg mx-auto">
      <h2 className="text-2xl font-bold mb-10">Pengaturan Suara</h2>

      {/* 1. KONTROL SLIDER VOLUME */}
      <div className="mb-6 flex flex-col items-stretch justify-between border-b border-zinc-200 py-4 xs:flex-row">
        <label className="block mb-2 font-semibold">Volume efek suara</label>
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${isMuted ? "text-zinc-300" : "text-zinc-900"}`}
          >
            {Math.round(volume * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            disabled={isMuted}
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            style={sliderStyle}
            className="w-full xs:w-44 md:w-56 lg:w-72 h-2 rounded-lg disabled:opacity-50"
          />
        </div>
      </div>

      {/* 2. TOGGLE MUTE */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-semibold">Senapkan Audio (Mute)</span>
        <motion.button
          onClick={() => {
            toggleMute();
            // Tes bunyi klik saat un-mute untuk memberikan Juicy UI feedback
            if (isMuted) playSFX("click");
          }}
          style={{ justifyContent: isMuted ? "flex-end" : "flex-start" }}
          className={`rounded-lg text-sm font-bold flex items-center w-12 p-1 cursor-pointer ${
            isMuted ? "bg-primary" : "bg-zinc-300"
          }`}
        >
          <motion.span
            layout
            transition={{ duration: 0.2 }}
            className="inline-block size-5 bg-white rounded-md"
          ></motion.span>
        </motion.button>
      </div>
    </div>
  );
}
