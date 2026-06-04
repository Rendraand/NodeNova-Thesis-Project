// @ts-check
import { useState } from "react";
import { useParams } from "react-router";
import { AnimatePresence, motion } from "framer-motion";

import React from "react";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { doc, collection } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

import HintSheet from "../components/game/HintSheet";
import Success from "../components/game/Success";
import CodeSnippet from "../components/game/CodeSnippet";
import NodeLinker from "../components/game/NodeLinker";
import Trees from "../components/game/Trees";

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

  let params = useParams();
  const { userData } = useAuth();

  // Fetch data soal spesifik berdasarkan ID dari parameter URL
  const puzzleRef = doc(db, "puzzles", params.id || "unknown");
  const [getData, loadingPuzzle] = useDocumentData(puzzleRef);

  // Fetch koleksi puzzles untuk menghitung total soal (keperluan progress bar)
  const puzzlesRef = collection(db, "puzzles");
  const [allPuzzles, loadingAll] = useCollectionData(puzzlesRef);

  if (loadingPuzzle || loadingAll) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-zinc-500 animate-pulse text-lg font-medium">Memuat misi...</p>
      </div>
    );
  }

  if (!getData) return <div className="p-10 text-center text-zinc-500">Misi tidak ditemukan...</div>;
  if (isComplete) return <Success isNew={isNewCompletion} totalPuzzles={allPuzzles?.length || 12} puzzleId={params.id} />;

  const progressPercentage = ((userData?.completed_puzzles?.length || 0) / (allPuzzles?.length || 1)) * 100;

  return (
    <React.Fragment>
      {/* Progress bar */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 w-3xl">
        <div className="w-full h-3.75 rounded-full overflow-hidden bg-zinc-200">
          <motion.span 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="block h-full bg-primary rounded-full"
          ></motion.span>
        </div>
      </div>

      {/* Main Box / Canvas */}
      <div className="w-3xl mx-auto mt-16">
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
      </AnimatePresence>
    </React.Fragment>
  );
};

export default Gameplay;
