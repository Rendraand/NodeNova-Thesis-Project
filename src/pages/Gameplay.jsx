import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { doc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useGameProgress } from "../context/GameProgressContext";

import HintSheet from "../components/game/HintSheet";
import Success from "../components/game/Success";
import CodeSnippet from "../components/game/CodeSnippet";
import NodeLinker from "../components/game/NodeLinker";
import Trees from "../components/game/Trees";
import ExitConfirmModal from "../components/game/ExitConfirmModal";
import audioManager from "../utils/audio";
import NoRewardSuccess from "../components/game/NoRewardSuccess";
import VideoTutorialModal from "../components/common/VideoTutorialModal";

/**
 * @typedef {Object} Feedback
 * @property {string} header - Judul feedback (misal: "Oops!", "Hampir Benar").
 * @property {string} hintMessage - Pesan bantuan atau CCBH yang ditampilkan.
 */

/**
 * @typedef {Object} CourseData
 * @property {string} id - ID unik misi.
 * @property {string} topic - Nama topik struktur data.
 * @property {string} category - Kategori gameplay (code-snippet, node-linker, binary-tree, trees).
 */

/**
 * Komponen untuk menentukan variant gameplay mana yang akan di-render.
 * @param {Object} props
 * @param {string} props.variant - Kategori dari data JSON.
 * @param {import("react").Dispatch<import("react").SetStateAction<Feedback>>} props.setFeedback - Fungsi setter untuk state feedback.
 * @param {boolean} props.showHint - State visibilitas hint.
 * @param {import("react").Dispatch<import("react").SetStateAction<boolean>>} props.setShowHint - Fungsi setter visibilitas hint.
 * @param {import("react").Dispatch<import("react").SetStateAction<boolean>>} props.setIsComplete - Fungsi setter status selesai.
 * @param {any} props.data - Data detail misi dari JSON (Typed as any for now due to complexity, but props are tracked).
 * @returns {import("react").JSX.Element|null}
 */
const Variants = ({
  variant,
  setFeedback,
  showHint,
  setShowHint,
  setIsComplete,
  data,
}) => {
  switch (variant) {
    case "code-snippet":
      return (
        <CodeSnippet
          showHint={showHint}
          setShowHint={setShowHint}
          setFeedback={setFeedback}
          setIsComplete={setIsComplete}
          data={data}
        />
      );
    case "node-linker":
      return (
        <NodeLinker
          showHint={showHint}
          setShowHint={setShowHint}
          setFeedback={setFeedback}
          setIsComplete={setIsComplete}
          data={data}
        />
      );
    case "binary-tree":
      return (
        <Trees
          setShowHint={setShowHint}
          setFeedback={setFeedback}
          setIsComplete={setIsComplete}
          data={data}
        />
      );
    default:
      return null;
  }
};

const Gameplay = () => {
  let params = useParams();
  const { completedPuzzles } = useGameProgress();

  const navigate = useNavigate();
  // Fetch data soal spesifik berdasarkan ID dari parameter URL
  const puzzleRef = doc(db, "puzzles", params.id || "unknown");
  // Fetch koleksi puzzles untuk menghitung total soal (keperluan progress bar)
  const puzzlesRef = collection(db, "puzzles");

  /** @type {[Feedback, import("react").Dispatch<import("react").SetStateAction<Feedback>>]} */
  const [feedback, setFeedback] = useState({
    header: "",
    hintMessage: "",
  });
  const [showHint, setShowHint] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isNewCompletion, setIsNewCompletion] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [getData, loadingPuzzle] = useDocumentData(puzzleRef);
  const [allPuzzles, loadingAll] = useCollectionData(puzzlesRef);

  const progressPercentage =
    ((completedPuzzles?.length || 0) / (allPuzzles?.length || 1)) * 100;

  if (loadingPuzzle || loadingAll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500 animate-pulse text-lg font-medium">
          Tunggu sebentar...
        </p>
      </div>
    );
  }
  if (!getData)
    return (
      <div className="p-10 text-center text-zinc-500">
        Misi tidak ditemukan...
      </div>
    );
  if (isComplete && isNewCompletion)
    return (
      <Success
        isNew={isNewCompletion}
        totalPuzzles={allPuzzles?.length || 11}
        puzzleId={params.id}
        topic={getData.topic}
        level={getData.level}
      />
    );
  if (isComplete && !isNewCompletion)
    return <NoRewardSuccess percentage={progressPercentage.toFixed(0)} />;

  return (
    <React.Fragment>
      {/* Progress bar */}
      <div className="fixed top-0 w-full bg-white flex items-center py-4 z-20 justify-center">
        <div className="w-3/4 relative lg:w-3xl">
          <div className="w-full h-2 rounded-full overflow-hidden bg-zinc-200">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="block h-full bg-primary rounded-full"
            ></motion.span>
          </div>

          {/* Back button */}
          <button
            onClick={() => {
              audioManager.playSFX("pop");
              setShowExitModal(true);
            }}
            className="absolute top-1/2 -left-8 rounded-full cursor-pointer p-1.5 hover:bg-zinc-100 transition-colors duration-200 -translate-y-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.75 -0.75 14 14"
              id="Delete-1--Streamline-Core"
              height="14"
              width="14"
            >
              <desc>Delete 1 Streamline Icon: https://streamlinehq.com</desc>
              <g
                id="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math"
                className="stroke-zinc-500"
              >
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m12.053571428571429 0.44642857142857145 -11.607142857142858 11.607142857142858"
                  strokeWidth="1.5"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m0.44642857142857145 0.44642857142857145 11.607142857142858 11.607142857142858"
                  strokeWidth="1.5"
                ></path>
              </g>
            </svg>
          </button>

          <span className="text-zinc-800 font-semibold text-sm absolute -right-10 top-1/2 -translate-y-1/2">
            {progressPercentage.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Main Box / Canvas */}
      <div className="mx-auto mt-17 lg:w-3xl px-6 lg:px-0">
        <Variants
          key={`gameplay-${resetCounter}`}
          variant={getData.variation}
          setFeedback={setFeedback}
          showHint={showHint}
          setShowHint={setShowHint}
          setIsComplete={(val, isNew = false) => {
            setIsNewCompletion(isNew);
            setIsComplete(val);
          }}
          data={getData}
        />
      </div>

      {/* Guide Button */}
      <motion.button
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", bounce: 0.25, damping: 14 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowGuide(true)}
        className="bg-icy-100/60 font-semibold px-4 py-2 rounded-full fixed right-0 bottom-0 m-8 cursor-pointer flex items-center gap-2 text-icy-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
          id="Button-Play--Streamline-Core"
          height="14"
          width="14"
          className="fill-icy-600"
        >
          <desc>Button Play Streamline Icon: https://streamlinehq.com</desc>
          <g id="button-play--button-television-buttons-movies-play-tv-video-controls">
            <path
              id="Union"
              fill="currentFill"
              fillRule="evenodd"
              d="M2.67593 0.019165c-0.29576 0 -0.58657 0.0753875 -0.84499 0.218948 -0.26314 0.134139 -0.48525 0.336896 -0.64277 0.58693 -0.15979 0.253627 -0.247004 0.546207 -0.252169 0.845927l-0.000075 0V12.3396H0.935852l0.000149 0.0086c0.005165 0.2997 0.092379 0.5923 0.252169 0.8459 0.15752 0.2501 0.37963 0.4528 0.64277 0.587 0.25842 0.1435 0.54923 0.2189 0.84499 0.2189 0.29995 0 0.59481 -0.0775 0.85596 -0.2251 0.00575 -0.0032 0.01143 -0.0066 0.01704 -0.0101l8.62977 -5.33745c0.2617 -0.13189 0.4826 -0.33282 0.6388 -0.5813 0.1611 -0.25659 0.2467 -0.55345 0.2467 -0.85647 0 -0.30301 -0.0856 -0.59988 -0.2467 -0.85646 -0.1563 -0.24874 -0.3776 -0.44984 -0.6396 -0.58172L3.54751 0.253465c-0.00515 -0.00316 -0.01036 -0.006227 -0.01562 -0.009199 -0.26115 -0.1475588 -0.55601 -0.225101 -0.85596 -0.225101Z"
              clipRule="evenodd"
              strokeWidth="1"
            ></path>
          </g>
        </svg>
        <p>Butuh Bantuan?</p>
      </motion.button>

      <VideoTutorialModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        category={getData.variation}
      />

      <AnimatePresence>
        {showHint && (
          <HintSheet
            feedback={feedback}
            onClose={() => {
              setShowHint(false);
              setResetCounter((prev) => prev + 1);
            }}
          />
        )}
        {showExitModal && (
          <ExitConfirmModal
            isOpen={showExitModal}
            onClose={() => {
              audioManager.playSFX("pop");
              setShowExitModal(false);
            }}
            onConfirm={() => {
              audioManager.playSFX("pop");
              navigate("/dashboard");
            }}
          />
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Gameplay;
