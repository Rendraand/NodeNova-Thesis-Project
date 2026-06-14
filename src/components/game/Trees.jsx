import React, { useRef, useState } from "react";
import audioManager from "../../utils/audio";

import { motion } from "framer-motion";
import { ArcherContainer, ArcherElement } from "react-archer";
import { useGameProgress } from "../../context/GameProgressContext";

// Sub-komponen untuk Node Pohon dengan UI yang responsif terhadap klik
const TreeNode = ({
  node,
  isSelected,
  isHole,
  onClick,
  subCategory,
  holeValue,
}) => {
  const isClickable =
    subCategory === "tree-clicker" || subCategory === "tree-sequence";

  const getStyles = () => {
    if (subCategory === "tree-click-options" && isHole) {
      return holeValue
        ? "bg-primary text-white border-primary"
        : "border-dashed border border-primary bg-icy-100 text-primary animate-pulse";
    }
    if (isSelected) {
      return "bg-primary text-white border-primary ring-4 ring-primary/20";
    }
    return `bg-white text-icy-700 border-primary ${isClickable && "hover:ring-4 hover:ring-primary/20"}`;
  };

  return (
    <motion.div
      whileHover={
        isClickable
          ? {
              scale: 1.05,
              transition: {
                type: "spring",
                stiffness: 245,
                damping: 20,
              },
            }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 245,
        damping: 20,
      }}
      onClick={() => onClick(node.id)}
      className={`size-13.5 rounded-full border flex items-center justify-center font-[550] z-10 duration-300 select-none transition-[background-color,box-shadow,color] ${getStyles()} ${isClickable && "cursor-pointer"}`}
    >
      {isHole && holeValue ? holeValue : node.label}
    </motion.div>
  );
};

const Trees = ({ setFeedback, setShowHint, setIsComplete, data }) => {
  const { completedPuzzles, updateDetailedProgress } = useGameProgress();
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const archerRef = useRef(null);

  const nodes = data.initial_layout.nodes;
  const edges = data.initial_layout.edges;
  const sub_category = data.sub_category;
  const validation_rules = data.validation_rules;
  const cases_ccbh = data.cases_ccbh;
  const options = data.options;

  const handleNodeClick = (id) => {
    if (sub_category === "tree-clicker") {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    } else if (sub_category === "tree-sequence") {
      if (!selectedIds.includes(id)) {
        setSelectedIds((prev) => [...prev, id]);
      }
    }
  };

  // LOGIKA EVALUASI & PENGECEKAN CCBH (Case-Based Hint)
  const handleCheck = async () => {
    setIsVerifying(true);

    if (sub_category === "tree-clicker") {
      if (!selectedIds.length) return setIsVerifying(false);

      const { correct_selected_ids } = validation_rules;
      const isCorrect =
        selectedIds.length === correct_selected_ids.length &&
        selectedIds.every((id) => correct_selected_ids.includes(id));

      if (isCorrect) {
        const isNew = !completedPuzzles.includes(data.id);
        audioManager.playSFX("correct");
        setIsComplete(true, isNew);
        return setIsVerifying(false);
      }

      // Penjelasan CCBH: Memeriksa kondisi spesifik dari input user
      let condition = "";
      if (selectedIds.includes("node-A")) condition = "root_selected";
      else if (selectedIds.includes("node-D") || selectedIds.includes("node-E"))
        condition = "incomplete_leaves";

      await updateDetailedProgress(data.id, data.topic, false);
      const hint = cases_ccbh?.find((c) => c.condition === condition);
      setFeedback({
        header: "Oops! Masih ada yang keliru...",
        hintMessage: hint ? hint.ccbh : data.manual_hint,
      });
      setShowHint(true);
      setIsVerifying(false);
    } else if (sub_category === "tree-sequence") {
      if (!selectedIds.length) return setIsVerifying(false);

      const { correct_sequence_ids } = validation_rules;
      const isCorrect =
        JSON.stringify(selectedIds) === JSON.stringify(correct_sequence_ids);

      if (isCorrect) {
        const isNew = !completedPuzzles.includes(data.id);
        audioManager.playSFX("correct");
        setIsComplete(true, isNew);
        return setIsVerifying(false);
      }

      let condition = "";
      if (selectedIds.length > 0) {
        const firstNodeId = selectedIds[0];
        const isLeaf = !edges.some((e) => e.from === firstNodeId);
        if (isLeaf && data.id === "tr-02") condition = "started_from_bottom";
        if (selectedIds.includes("node-C") && !selectedIds.includes("node-B"))
          condition = "skipped_left_subtree";
      }

      await updateDetailedProgress(data.id, data.topic, false);
      const hint = cases_ccbh?.find((c) => c.condition === condition);
      setFeedback({
        header: "Urutannya masih kurang tepat nih!",
        hintMessage: hint ? hint.ccbh : data.manual_hint,
      });
      setShowHint(true);
      setIsVerifying(false);
    } else if (sub_category === "tree-click-options") {
      if (!selectedOption) return setIsVerifying(false);

      if (selectedOption.isCorrect) {
        const isNew = !completedPuzzles.includes(data.id);
        audioManager.playSFX("correct");
        setIsComplete(true, isNew);
        return setIsVerifying(false);
      }

      await updateDetailedProgress(data.id, data.topic, false);
      setFeedback({
        header: "Pasangan angka ini kurang tepat.",
        hintMessage:
          selectedOption.ccbh ||
          "Coba ingat kembali prinsip dasar Binary Search Tree.",
      });
      setShowHint(true);
      setIsVerifying(false);
    }
  };

  const optionValues = selectedOption
    ? selectedOption.content.split(" & ")
    : [];

  return (
    <React.Fragment>
      <h3 className="text-xl font-extrabold text-center">
        Topik: {data.topic}
      </h3>
      <p className="text-zinc-500 font-medium text-center max-w-xl mx-auto">
        {data.question}
      </p>

      {/* Tree Canvas */}
      <div className="border border-icy-300 rounded-2xl overflow-hidden border-dashed mt-4 relative">
        <ArcherContainer
          strokeColor="hsl(200, 87%, 52%)"
          strokeWidth={3}
          endShape={{ arrow: { arrowLength: 4, arrowThickness: 4 } }}
          lineStyle="straight"
          ref={archerRef}
        >
          {/* Canvas Pattern */}
          <div className="canvas-pattern w-full h-full absolute left-0 top-0 -z-10"></div>
          {/* Canvas Area */}
          <div
            onScroll={() => {
              if (archerRef.current) {
                archerRef.current.refreshScreen();
              }
            }}
            className="h-88 border-dashed rounded-2xl relative w-full overflow-x-auto clean-scrollbar clean-scrollbar-icy"
          >
            <div className="min-w-2xl">
              {nodes.map((node) => {
                return (
                  <ArcherElement
                    key={node.id}
                    id={node.id}
                    relations={[
                      ...edges
                        .filter((e) => e.from === node.id)
                        .map((e) => ({
                          targetId: e.to,
                          targetAnchor: "top",
                          sourceAnchor: "middle",
                          style: {
                            strokeColor: "hsl(200, 87%, 52%)",
                            strokeWidth: 3,
                          },
                        })),
                    ]}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: node.initial_x,
                        top: node.initial_y,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 1, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 190,
                          damping: 20,
                        }}
                      >
                        <TreeNode
                          node={node}
                          subCategory={sub_category}
                          isSelected={selectedIds.includes(node.id)}
                          isHole={node.label === "[ ? ]"}
                          holeValue={
                            node.id === "node-hole-left"
                              ? optionValues[0]
                              : node.id === "node-hole-right"
                                ? optionValues[1]
                                : null
                          }
                          onClick={handleNodeClick}
                        />
                      </motion.div>
                    </div>
                  </ArcherElement>
                );
              })}
            </div>
          </div>

          {/* Bottom Control */}
          <div className="bg-white">
            <div className="bg-icy-100/20 p-4 border-t border-icy-200 border-dashed">
              <div className="flex justify-center items-center gap-8 flex-col md:flex-row">
                {sub_category === "tree-sequence" && (
                  <div className="flex flex-col gap-2 w-full md:w-fit md:grow">
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-600 font-[650]">
                        Urutan Traversal-mu:
                      </p>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-sm text-rose-500 font-semibold cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                    <div className="flex gap-2 h-15 px-3 rounded-2xl bg-white border border-icy-300 border-dashed items-center overflow-x-auto">
                      {selectedIds.map((id, idx) => (
                        <motion.div
                          key={`${id}-${idx + 1}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="size-11 shrink-0 rounded-full bg-primary text-white flex items-center justify-center font-semibold"
                        >
                          {nodes.find((n) => n.id === id).label}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {sub_category === "tree-click-options" && (
                  <div className="flex gap-4 grow flex-wrap justify-center">
                    {options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(opt)}
                        className={`px-6 py-3 rounded-2xl border font-medium transition-colors border-primary border-dashed ${selectedOption?.id === opt.id ? "bg-icy-100 text-icy-700" : "bg-white text-zinc-700 hover:border-primary"}`}
                      >
                        {opt.content}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center h-14">
                  <button
                    onClick={handleCheck}
                    className="px-7 py-2 bg-primary text-white font-semibold rounded-xl border-b-3 border-icy-600 active:border-b-0 active:translate-y-0.75 transition-colors disabled:opacity-30 cursor-pointer flex items-center gap-2"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
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
                        <span>Memproses...</span>
                      </>
                    ) : (
                      "Cek Logika!"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ArcherContainer>
      </div>
    </React.Fragment>
  );
};

export default Trees;
