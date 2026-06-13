import { createContext, useContext, useState, useEffect } from "react";
import { Howl, Howler } from "howler";

/**
 * @typedef {Object} AudioContextType
 * @property {number} volume
 * @property {boolean} isMuted
 * @property {function(number): void} changeVolume
 * @property {function(): void} toggleMute
 * @property {function(string): void} playSFX
 */

// @ts-ignore
const AudioContext = createContext(null);

const sfxCache = {
  click: new Howl({ src: ["/audio/sfx-click.mp3"] }),
  success: new Howl({ src: ["/audio/sfx-success.mp3"] }),
  wrong: new Howl({ src: ["/audio/sfx-wrong.mp3"] }),
};

/** @param {{ children: React.ReactNode }} props */
export function AudioProvider({ children }) {
  // 1. Inisialisasi state dengan mengecek localStorage
  // Jika tidak ada di storage, default ke 0.5 (volume) dan false (muted)
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("game_volume");
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });

  const [isMuted, setIsMuted] = useState(() => {
    const savedMuted = localStorage.getItem("game_muted");
    return savedMuted === "true"; // localStorage menyimpan data sebagai string
  });

  // 2. Efek simpan ke localStorage setiap ada perubahan state
  useEffect(() => {
    localStorage.setItem("game_volume", volume.toString());
    localStorage.setItem("game_muted", isMuted.toString());
  }, [volume, isMuted]);

  // 3. Efek terapkan ke Howler
  useEffect(() => {
    if (isMuted) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
      Howler.volume(volume);
    }
  }, [volume, isMuted]);

  const changeVolume = (newVolume) => setVolume(newVolume);
  const toggleMute = () => setIsMuted((prev) => !prev);
  const playSFX = (sfxName) => sfxCache[sfxName]?.play();

  return (
    <AudioContext.Provider
      value={{ volume, isMuted, changeVolume, toggleMute, playSFX }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context)
    throw new Error("useAudio harus digunakan di dalam AudioProvider");
  return context;
};
