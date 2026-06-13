// @ts-check
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

  let params = useParams();
  const navigate = useNavigate();
  const { completedPuzzles } = useGameProgress();

  // Fetch data soal spesifik berdasarkan ID dari parameter URL
  const puzzleRef = doc(db, "puzzles", params.id || "unknown");
  const [getData, loadingPuzzle] = useDocumentData(puzzleRef);

  // Fetch koleksi puzzles untuk menghitung total soal (keperluan progress bar)
  const puzzlesRef = collection(db, "puzzles");
  const [allPuzzles, loadingAll] = useCollectionData(puzzlesRef);

  const progressPercentage =
    ((completedPuzzles?.length || 0) / (allPuzzles?.length || 1)) * 100;

  if (loadingPuzzle || loadingAll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500 animate-pulse text-lg font-medium">
          Memuat misi...
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
      />
    );
  if (isComplete && !isNewCompletion)
    return <NoRewardSuccess percentage={progressPercentage.toFixed(0)} />;

  return (
    <React.Fragment>
      {/* Progress bar */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 w-3xl">
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
          className="absolute top-1/2 -left-10 rounded-full cursor-pointer p-1.5 hover:bg-zinc-100 transition-colors duration-200 -translate-y-1/2"
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

      {/* Main Box / Canvas */}
      <div className="w-3xl mx-auto mt-17">
        <Variants
          key={`gameplay-${resetCounter}`}
          variant={getData.category}
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
