// @ts-check
import { motion } from "framer-motion";

/**
 * @param {Object} props 
 * @param {import("../../pages/Gameplay").Feedback} props.feedback 
 * @param {() => void} props.onClose
 */
const HintSheet = ({ feedback, onClose }) => {
  return (
    <motion.div
      initial={{ y: "20%", opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: "20%", opacity: 0, scale: 0.3 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
      className="text-rose-700 font-medium bg-rose-100 rounded-3xl fixed bottom-4 right-2 w-5xl p-7 flex items-center gap-20 left-1/2 z-50 -translate-x-1/2 justify-between"
    >
      <div className="max-w-188">
        <div className="flex items-center gap-3 mb-2">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 30 30"
            id="Browser-Delete--Streamline-Core"
            height="24"
            width="24"
          >
            <desc>
              Browser Delete Streamline Icon: https://streamlinehq.com
            </desc>
            <g id="browser-delete--app-code-apps-fail-delete-window-remove-cross">
              <path
                id="Union"
                fill="#be123c"
                fill-rule="evenodd"
                d="M3.313157142857143 26.248714285714286V7.10415H26.686714285714285v19.144564285714285c0 0.2419285714285714 -0.19607142857142856 0.438 -0.438 0.438H3.751242857142857c-0.24195 0 -0.4380857142857143 -0.19607142857142856 -0.4380857142857143 -0.438ZM3.751242857142857 0.09887699999999999C1.7340942857142856 0.09887699999999999 0.09887699999999999 1.7340942857142856 0.09887699999999999 3.751242857142857V26.248714285714286c0 2.0170714285714286 1.6352172857142857 3.652285714285714 3.652365857142857 3.652285714285714H26.248714285714286c2.0170714285714286 0 3.652285714285714 -1.6352142857142857 3.652285714285714 -3.652285714285714V3.751242857142857c0 -2.0171485714285713 -1.6352142857142857 -3.652365857142857 -3.652285714285714 -3.652365857142857H3.751242857142857ZM9.577864285714284 11.35817142857143c0.6276214285714286 -0.6276214285714286 1.6452214285714284 -0.6276214285714286 2.272842857142857 0L15 14.507464285714285l3.149292857142857 -3.149292857142857c0.6276214285714286 -0.6276214285714286 1.6452214285714284 -0.6276214285714286 2.272842857142857 0s0.6276214285714286 1.6452214285714284 0 2.272842857142857L17.27284285714286 16.78030714285714l3.149292857142857 3.149292857142857c0.6276214285714286 0.6276214285714286 0.6276214285714286 1.6451142857142855 0 2.2727571428571425 -0.6276214285714286 0.6276428571428571 -1.6452214285714284 0.6276428571428571 -2.272842857142857 0L15 19.05315 11.850707142857143 22.202357142857142c-0.6276214285714286 0.6276428571428571 -1.6452214285714284 0.6276428571428571 -2.272842857142857 0s-0.6276214285714286 -1.6451357142857144 0 -2.2727571428571425l3.149292857142857 -3.149292857142857 -3.149292857142857 -3.149292857142857c-0.6276214285714286 -0.6276214285714286 -0.6276214285714286 -1.6452214285714284 0 -2.272842857142857Z"
                clip-rule="evenodd"
                stroke-width="2.1429"
              ></path>
            </g>
          </svg> */}
          <p className="text-lg font-[650]">{feedback.header}</p>
        </div>
        <p className="font-bold text-lg">Hint:</p>
        <p>{feedback.hintMessage}</p>
      </div>

      <button
        onClick={onClose}
        className="text-white bg-rose-600 border-b-4 border-rose-800 rounded-xl px-7.5 py-2.5 font-bold cursor-pointer active:border-b-0 active:translate-y-1 transition-colors duration-100"
      >
        Ulangi
      </button>
    </motion.div>
  );
};

export default HintSheet;
