// @ts-check
import { motion } from "framer-motion";
import { useEffect } from "react";
import audioManager from "../../utils/audio";

/**
 * @param {Object} props
 * @param {import("../../pages/Gameplay").Feedback} props.feedback
 * @param {() => void} props.onClose
 */
const HintSheet = ({ feedback, onClose }) => {
  useEffect(() => {
    audioManager.playSFX("wrong");
  }, []);

  return (
    <motion.div
      initial={{ y: "20%", opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: "20%", opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", bounce: 0.6, stiffness: 100 }}
      className="text-rose-700 font-medium bg-rose-100 rounded-3xl fixed bottom-4 right-2 w-5xl p-7 flex items-center gap-20 left-1/2 z-50 -translate-x-1/2 justify-between"
    >
      <div className="max-w-188">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-lg font-[650]">{feedback.header}</p>
        </div>
        <p className="font-bold text-lg">Hint:</p>
        <p>{feedback.hintMessage}</p>
      </div>

      <button
        onClick={() => {
          audioManager.playSFX("pop");
          onClose();
        }}
        className="text-white bg-rose-600 border-b-4 border-rose-800 rounded-xl px-7.5 py-2.5 font-bold cursor-pointer active:border-b-0 active:translate-y-1 transition-colors duration-100"
      >
        Ulangi
      </button>
    </motion.div>
  );
};

export default HintSheet;
