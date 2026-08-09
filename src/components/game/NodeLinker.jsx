import React, { useState, useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArcherContainer, ArcherElement } from "react-archer";
import { useGameProgress } from "../../context/GameProgressContext";

import audioManager from "../../utils/audio";

import "../../styles/custom.css";

const TargetLabel = ({ text, onClick, id }) => {
  return (
    <button
      onClick={(e) => onClick(e, id)}
      className={`px-3 rounded-lg font-semibold text-sm select-none whitespace-nowrap z-50 transition-all cursor-pointer bg-mauve-purple-100 flex text-mauve-purple-600 items-center h-7`}
    >
      {text}
    </button>
  );
};

const LabelWrapper = ({ children, enableZone, onClick, id, layout_type }) => {
  return (
    <div
      onClick={(e) => {
        onClick(e, id);
      }}
      className={`h-7 rounded-lg transition-colors w-fit mx-auto min-w-10 border ${enableZone ? "border-primary border-dashed bg-icy-100 cursor-pointer animate-pulse" : "border-transparent"} ${layout_type === "linear-v" ? "top-1/2 -left-2 -translate-y-1/2 -translate-x-full" : "top-0 left-1/2 -translate-x-1/2 -translate-y-8"} z-10 absolute`}
    >
      {children}
    </div>
  );
};

const TrayArea = ({ children, enableZone, onClick }) => {
  return (
    <div
      onClick={(e) => onClick(e, null)}
      className={`flex gap-3 py-2 rounded-xl border transition-all min-w-40 px-3 border-dashed ${enableZone ? "border-primary animate-pulse bg-icy-100/70 text-icy-700 cursor-pointer" : "border-zinc-200 bg-white text-zinc-700"}`}
    >
      {children}
    </div>
  );
};

const Node = ({
  node,
  canvasRef,
  archerRef,
  constraintRef,
  pointers,
  setPointers,
  labels,
  setMousePos,
  selectedLabelId,
  linkingSource,
  setLinkingSource,
  handleLabelClick,
  moveLabelTo,
  hasModified,
  setHasModified,
  hasTrash,
  setSelectedNode,
  layout,
}) => {
  const controls = useDragControls();

  const startDrag = (event) => {
    controls.start(event);
  };

  const handleNodeDrag = () => {
    if (archerRef.current) {
      archerRef.current.refreshScreen();
    }
  };

  const startLinking = (e, sourceId) => {
    e.stopPropagation();
    setLinkingSource(sourceId);

    // Set posisi awal kursor agar panah muncul tepat di titik klik
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const completeLinking = (e, targetId) => {
    e.stopPropagation();
    if (linkingSource && linkingSource !== targetId) {
      // Singly Linked List behavior
      const filteredPointers = pointers.filter(
        (p) => p.from !== targetId || p.to !== linkingSource,
      );
      setPointers([
        ...filteredPointers,
        { id: `p-${Date.now()}`, from: linkingSource, to: targetId },
      ]);
      setLinkingSource(null);

      if (!hasModified) {
        setHasModified(true);
      }
    }
  };

  return (
    <motion.div
      drag={node.draggable}
      dragMomentum={false}
      dragConstraints={constraintRef}
      dragElastic={0}
      dragListener={false}
      dragControls={controls}
      onDrag={handleNodeDrag}
      style={{ left: node.initial_x, top: node.initial_y }}
      className={`${layout.layout_type === "flex" ? "absolute" : "relative"} group`}
    >
      {/* Label Zone */}
      <LabelWrapper
        enableZone={
          selectedLabelId && !labels.some((l) => l.target_node === node.id)
        }
        onClick={moveLabelTo}
        id={node.id}
        layout_type={layout.layout_type}
      >
        {labels
          .filter((l) => l.target_node === node.id)
          .map((l) => (
            <TargetLabel
              key={l.id}
              text={l.text}
              onClick={handleLabelClick}
              id={l.id}
            />
          ))}
      </LabelWrapper>

      {/* Node + Arrow Pointer */}
      <ArcherElement
        id={node.id}
        relations={[
          ...pointers
            .filter((p) => p.from === node.id)
            .map((p) => ({
              targetId: p.to,
              targetAnchor: layout.layout_type === "linear-v" ? "top" : "left",
              sourceAnchor:
                layout.layout_type === "linear-v" ? "bottom" : "right",
              style: {
                strokeColor: "hsl(200, 87%, 52%)",
                strokeWidth: 2,
              },
            })),
          ...(linkingSource === node.id
            ? [
                {
                  targetId: "cursor-node",
                  targetAnchor: "middle",
                  sourceAnchor:
                    layout.layout_type === "linear-v" ? "bottom" : "right",
                  style: {
                    strokeColor: "rgba(169, 222, 249, 0.5)",
                    strokeDasharray: "5,5",
                    strokeWidth: 2,
                  },
                },
              ]
            : []),
        ]}
      >
        <div className="relative">
          <div
            className={`border rounded-xl flex overflow-hidden transition-all ${node.draggable ? "cursor-grab active:cursor-grabbing" : ""} ${linkingSource === node.id ? "ring-2 ring-primary/70 ring-offset-2" : ""} ${linkingSource && linkingSource !== node.id ? "hover:ring-2 hover:ring-primary/70 ring-offset-2" : ""} ${layout.layout_type === "linear-h" ? "border-primary bg-icy-300/80" : ""} ${layout.layout_type === "linear-v" ? "border-icy-300 bg-icy-100" : ""} ${layout.layout_type === "flex" ? "bg-white border-primary" : ""}`}
            onPointerDown={startDrag}
            onClick={(e) => completeLinking(e, node.id)}
          >
            <div
              className={`font-medium text-center flex items-center justify-center ${
                layout.layout_type === "flex"
                  ? "w-16 h-10 text-icy-700"
                  : layout.layout_type === "linear-h"
                    ? "h-16 w-10 text-icy-800"
                    : "w-20 h-8 text-icy-600"
              }`}
            >
              {node.label}
            </div>
            {layout.layout_type === "flex" && (
              <div
                className={`px-2.5 bg-icy-100 border-s border-primary ${node.draggable ? "border-dashed" : ""}`}
              ></div>
            )}
          </div>

          {/* Pointer Controls */}
          {pointers.some((p) => p.from === node.id) ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setPointers(pointers.filter((p) => p.from !== node.id));
              }}
              className={`w-3.5 h-3.5 rounded-full bg-icy-400 absolute flex items-center justify-center cursor-pointer hover:bg-rose-400 transition-colors ${layout.layout_type === "linear-v" ? "left-0 bottom-0 translate-y-4" : "bottom-0 right-0 translate-x-5"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 4 4"
                id="Delete-1--Streamline-Core"
                height="6"
                width="6"
                className="fill-white"
              >
                <desc>Delete 1 Streamline Icon: https://streamlinehq.com</desc>
                <g id="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
                  <path
                    id="Union"
                    fill="currentFill"
                    fillRule="evenodd"
                    d="M0.4877457142857142 0.08368371428571429c-0.11157999999999998 -0.11157831428571427 -0.29248371428571424 -0.11157831428571427 -0.404062 0 -0.11157831428571427 0.1115782857142857 -0.11157831428571427 0.29248199999999996 0 0.404062L1.59594 2 0.08368371428571429 3.5122571428571425c-0.11157831428571427 0.11157142857142857 -0.11157831428571427 0.2924857142857143 0 0.4040571428571428 0.1115782857142857 0.11157142857142857 0.29248199999999996 0.11157142857142857 0.404062 0L2 2.40406l1.512257142857143 1.5122542857142856c0.11157142857142857 0.11157142857142857 0.2924857142857143 0.11157142857142857 0.4040571428571428 0 0.11157142857142857 -0.11157142857142857 0.11157142857142857 -0.2924857142857143 0 -0.4040571428571428L2.40406 2l1.5122542857142856 -1.5122542857142856c0.11157142857142857 -0.11157999999999998 0.11157142857142857 -0.29248371428571424 0 -0.404062 -0.11157142857142857 -0.11157831428571427 -0.2924857142857143 -0.11157831428571427 -0.4040571428571428 0L2 1.59594 0.4877457142857142 0.08368371428571429Z"
                    clipRule="evenodd"
                    strokeWidth="0.2857"
                  ></path>
                </g>
              </svg>
            </div>
          ) : (
            <div
              onClick={(e) => startLinking(e, node.id)}
              className={`p-2 absolute  cursor-crosshair ${layout.layout_type === "linear-v" ? "bottom-0 -translate-x-1/2 left-1/2 translate-y-1/2" : "right-0 top-1/2 translate-x-1/2 -translate-y-1/2"}`}
            >
              <div className="p-1 bg-primary rounded-full"></div>
            </div>
          )}
        </div>
      </ArcherElement>

      {/* Trash can for each node */}
      {hasTrash && (
        <button
          onClick={() => setSelectedNode(node)}
          className={`block cursor-pointer transition-all group/trash-zone hover:bg-red-100 p-1 rounded-full absolute ${layout.layout_type === "linear-v" ? "-right-2 top-1/2 -translate-y-1/2 translate-x-full" : "bottom-0 left-0 translate-y-6"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            id="Recycle-Bin-2--Streamline-Core"
            height="14"
            width="14"
            className="fill-rose-500 group-hover/trash-zone:fill-rose-600"
          >
            <desc>Recycle Bin 2 Streamline Icon: https://streamlinehq.com</desc>
            <g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage">
              <path
                id="Subtract"
                fill="currentFill"
                fillRule="evenodd"
                d="M5.76256 2.01256C6.09075 1.68437 6.53587 1.5 7 1.5c0.46413 0 0.90925 0.18437 1.23744 0.51256 0.20736 0.20737 0.35731 0.46141 0.43961 0.73744h-3.3541c0.0823 -0.27603 0.23225 -0.53007 0.43961 -0.73744ZM3.78868 2.75c0.10537 -0.67679 0.42285 -1.30773 0.91322 -1.798097C5.3114 0.34241 6.13805 0 7 0c0.86195 0 1.6886 0.34241 2.2981 0.951903 0.49037 0.490367 0.8079 1.121307 0.9132 1.798097H13c0.4142 0 0.75 0.33579 0.75 0.75 0 0.41422 -0.3358 0.75 -0.75 0.75h-1v8.25c0 0.3978 -0.158 0.7794 -0.4393 1.0607S10.8978 14 10.5 14h-7c-0.39783 0 -0.77936 -0.158 -1.06066 -0.4393C2.15804 13.2794 2 12.8978 2 12.5V4.25H1c-0.414214 0 -0.75 -0.33578 -0.75 -0.75 0 -0.41421 0.335786 -0.75 0.75 -0.75h2.78868ZM5 5.87646c0.34518 0 0.625 0.27983 0.625 0.625V10.503c0 0.3451 -0.27982 0.625 -0.625 0.625s-0.625 -0.2799 -0.625 -0.625V6.50146c0 -0.34517 0.27982 -0.625 0.625 -0.625Zm4.625 0.625c0 -0.34517 -0.27982 -0.625 -0.625 -0.625s-0.625 0.27983 -0.625 0.625V10.503c0 0.3451 0.27982 0.625 0.625 0.625s0.625 -0.2799 0.625 -0.625V6.50146Z"
                clipRule="evenodd"
                strokeWidth="1"
              ></path>
            </g>
          </svg>
        </button>
      )}
    </motion.div>
  );
};

const NodesWrapper = ({ children, layout_type }) => {
  if (layout_type === "flex") return children;

  return (
    <div
      className={`${layout_type === "linear-h" ? "gap-10" : "flex-col gap-6"} flex items-center justify-center w-full h-full`}
    >
      {children}
    </div>
  );
};

const NodesLayout = ({
  layout,
  canvasRef,
  archerRef,
  nodes,
  setNodes,
  pointers,
  setPointers,
  labels,
  setLabels,
  setMousePos,
  selectedLabelId,
  linkingSource,
  setLinkingSource,
  handleLabelClick,
  moveLabelTo,
  hasModified,
  setHasModified,
}) => {
  const constraintRef = useRef(null);
  const stackConstraintRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const deleteSLLNode = (id) => {
    setNodes(nodes.filter((n) => n.id !== id));
    setPointers(pointers.filter((p) => p.from !== id && p.to !== id));
    setLabels((prev) =>
      prev.map((l) => (l.target_node === id ? { ...l, target_node: null } : l)),
    );
    setSelectedNode(null);

    if (!hasModified) setHasModified(true);
  };

  return (
    <React.Fragment>
      <motion.div
        ref={constraintRef}
        className="relative w-full h-full min-w-2xl"
      >
        <NodesWrapper layout_type={layout.layout_type}>
          {nodes.map((node) => (
            <Node
              key={node.id}
              node={node}
              canvasRef={canvasRef}
              archerRef={archerRef}
              constraintRef={constraintRef}
              pointers={pointers}
              setPointers={setPointers}
              labels={labels}
              setMousePos={setMousePos}
              selectedLabelId={selectedLabelId}
              linkingSource={linkingSource}
              setLinkingSource={setLinkingSource}
              handleLabelClick={handleLabelClick}
              moveLabelTo={moveLabelTo}
              hasModified={hasModified}
              setHasModified={setHasModified}
              hasTrash={layout.has_trash}
              setSelectedNode={setSelectedNode}
              layout={layout}
            />
          ))}
        </NodesWrapper>
      </motion.div>

      {/* Delete Node Confirmation Popup */}
      <AnimatePresence>
        {selectedNode ? (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0, scale: 0.25 }}
            transition={{
              type: "spring",
              bounce: 0.4,
              duration: 0.8,
            }}
            className="bg-white rounded-[10px] absolute bottom-4 right-4 flex items-center gap-5 px-3 py-1.5 shadow-md border border-zinc-100"
          >
            <p className="text-zinc-700 font-[550]">
              Hapus {selectedNode.label}?
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => deleteSLLNode(selectedNode.id)}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 12"
                  id="Check--Streamline-Core"
                  height="12"
                  width="12"
                  className="fill-primary"
                >
                  <desc>Check Streamline Icon: https://streamlinehq.com</desc>
                  <g id="check--check-form-validation-checkmark-success-add-addition-tick">
                    <path
                      id="Vector (Stroke)"
                      fill="currentFill"
                      fillRule="evenodd"
                      d="M11.688857142857142 1.0268571428571427a0.8571428571428571 0.8571428571428571 0 0 1 0.11485714285714285 1.2068571428571426l-6.891428571428571 8.34 -0.0025714285714285713 0.0017142857142857142a1.6474285714285712 1.6474285714285712 0 0 1 -1.2857142857142856 0.594 1.6482857142857141 1.6482857142857141 0 0 1 -1.284857142857143 -0.6411428571428571l-0.0008571428571428571 -0.0017142857142857142L0.18 7.752857142857143a0.8571428571428571 0.8571428571428571 0 1 1 1.3525714285714285 -1.0525714285714285l2.1119999999999997 2.7145714285714284 6.836571428571428 -8.273142857142856a0.8571428571428571 0.8571428571428571 0 0 1 1.2068571428571426 -0.11485714285714285Z"
                      clipRule="evenodd"
                      strokeWidth="0.8571"
                    ></path>
                  </g>
                </svg>
              </button>
              <button
                onClick={() => setSelectedNode(null)}
                className="cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 12"
                  id="Delete-1--Streamline-Core"
                  height="12"
                  width="12"
                  className="fill-rose-500"
                >
                  <desc>
                    Delete 1 Streamline Icon: https://streamlinehq.com
                  </desc>
                  <g id="delete-1--remove-add-button-buttons-delete-cross-x-mathematics-multiply-math">
                    <path
                      id="Union"
                      fill="currentFill"
                      fillRule="evenodd"
                      d="M1.4632371428571427 0.25105114285714286c-0.33474 -0.33473494285714284 -0.8774511428571428 -0.33473494285714284 -1.212186 0 -0.33473494285714284 0.3347348571428571 -0.33473494285714284 0.877446 0 1.212186L4.78782 6 0.25105114285714286 10.536771428571427c-0.33473494285714284 0.3347142857142857 -0.33473494285714284 0.8774571428571428 0 1.2121714285714285 0.3347348571428571 0.3347142857142857 0.877446 0.3347142857142857 1.212186 0L6 7.21218l4.536771428571429 4.536762857142857c0.3347142857142857 0.3347142857142857 0.8774571428571428 0.3347142857142857 1.2121714285714285 0 0.3347142857142857 -0.3347142857142857 0.3347142857142857 -0.8774571428571428 0 -1.2121714285714285L7.21218 6l4.536762857142857 -4.536762857142857c0.3347142857142857 -0.33474 0.3347142857142857 -0.8774511428571428 0 -1.212186 -0.3347142857142857 -0.33473494285714284 -0.8774571428571428 -0.33473494285714284 -1.2121714285714285 0L6 4.78782 1.4632371428571427 0.25105114285714286Z"
                      clipRule="evenodd"
                      strokeWidth="0.8571"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </React.Fragment>
  );
};

const NodeLinker = ({
  showHint,
  setShowHint,
  setFeedback,
  setIsComplete,
  data,
}) => {
  const { completedPuzzles, updateDetailedProgress } = useGameProgress();
  const [nodes, setNodes] = useState(data.initial_layout.nodes);
  const [pointers, setPointers] = useState(data.initial_layout.pointers || []);
  const [labels, setLabels] = useState(data.initial_layout.labels || []);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedLabelId, setSelectedLabelId] = useState(null);
  const [linkingSource, setLinkingSource] = useState(null);
  const [hasModified, setHasModified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const canvasRef = useRef(null);
  const archerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!linkingSource || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (archerRef.current) {
      archerRef.current.refreshScreen();
    }
  };

  const cancelEvents = () => {
    setLinkingSource(null);
    setSelectedLabelId(null);
  };

  // Handler untuk klik label (tray atau node)
  const handleLabelClick = (e, labelId) => {
    e.stopPropagation();
    setSelectedLabelId((prev) => (prev === labelId ? null : labelId));
  };

  // Handler untuk memindahkan label ke target (node atau tray)
  const moveLabelTo = (e, nodeId) => {
    e.stopPropagation();
    if (!selectedLabelId) return;

    setLabels((prev) =>
      prev.map((l) =>
        l.id === selectedLabelId ? { ...l, target_node: nodeId } : l,
      ),
    );
    setSelectedLabelId(null);

    if (!hasModified) {
      setHasModified(true);
    }
  };

  const handleCheck = async () => {
    if (!hasModified) return;
    setIsVerifying(true);

    const rules = data.validation_rules;
    const casesHint = data.cases_ccbh;

    if (rules.deleted_nodes) {
      // check for stack topic specifically if the initial (top) node is still exists
      const currentIds = nodes.map((n) => n.id);
      if (
        data.topic === "Stack" &&
        rules.deleted_nodes.some((id) => id === data.initial_layout.nodes[0].id)
      ) {
        const topNotMoved = nodes.some(
          (n) => n.id === data.initial_layout.nodes[0].id,
        );
        if (topNotMoved) {
          const foundCase = casesHint.find(
            (c) => c.condition === "top_not_moved",
          );

          await updateDetailedProgress(data.id, data.topic, false, data.level);
          setShowHint(true);
          setFeedback({
            header: "Sepertinya kamu belum menghapus node nya!",
            hintMessage: foundCase
              ? foundCase.ccbh
              : "Coba cek kembali node yang harus dihapus ya...",
          });
          setIsVerifying(false);
          return;
        }
      }

      const stillExists = rules.deleted_nodes.some((id) =>
        currentIds.includes(id),
      );
      if (stillExists) {
        await updateDetailedProgress(data.id, data.topic, false, data.level);
        setShowHint(true);
        setFeedback({
          header: "Sepertinya kamu belum menghapus node nya!",
          hintMessage: "Coba cek kembali node yang harus dihapus ya...",
        });
        setIsVerifying(false);
        return;
      }
    }

    if (rules.required_nodes) {
      const allRequiredNodes = rules.required_nodes.every((req) =>
        nodes.some((n) => n.id === req),
      );
      if (!allRequiredNodes) {
        await updateDetailedProgress(data.id, data.topic, false, data.level);
        setShowHint(true);
        setFeedback({
          header: "Ada susunan yang kurang nih!",
          hintMessage:
            "Pasti ada node yang terlewati. Coba periksa kembali node yang harus dihapus.",
        });
        setIsVerifying(false);
        return;
      }
    }

    if (rules.required_pointers) {
      const allPointersCorrect = rules.required_pointers.every((req) =>
        pointers.some((p) => p.from === req.from && p.to === req.to),
      );
      if (!allPointersCorrect) {
        // check if some pointer (link) reversed
        const someReversed = rules.required_pointers.some((req) =>
          pointers.some((p) => p.from === req.to && p.to === req.from),
        );

        if (someReversed) {
          const foundCase = casesHint.find(
            (c) => c.condition === "reversed_link",
          );
          await updateDetailedProgress(data.id, data.topic, false, data.level);
          setShowHint(true);
          setFeedback({
            header: "Pointer-nya ada yang salah arah nih!",
            hintMessage: foundCase
              ? foundCase.ccbh
              : "Coba cek kembali arah pointer nya ya!",
          });
          setIsVerifying(false);
          return;
        }

        // check if front (node) pointer skip directly to C (rear) node
        if (data.topic === "Queue" && rules.required_pointers.length === 2) {
          const frontToC = pointers.find(
            (p) =>
              p.from === rules.required_pointers[0].from &&
              p.to === rules.required_pointers[1].to,
          );
          if (frontToC) {
            const foundCase = casesHint.find(
              (c) => c.condition === "front_to_C",
            );
            await updateDetailedProgress(
              data.id,
              data.topic,
              false,
              data.level,
            );
            setShowHint(true);
            setFeedback({
              header: "Kamu ada yang miss di bagian pointer nih!",
              hintMessage: foundCase
                ? foundCase.ccbh
                : "Periksa kembali pointer pada elemen front dan pastikan tidak melompati elemen lain!",
            });
            setIsVerifying(false);
            return;
          }
        }

        // lost data: if new node inserted in the middle but skip connecting to the old node
        if (data.topic === "Singly Linked List" && !rules.deleted_nodes) {
          const foundCase = casesHint.find((c) => c.condition === "lost_data");
          await updateDetailedProgress(data.id, data.topic, false, data.level);
          setShowHint(true);
          setFeedback({
            header: "Kamu ada yang miss di bagian pointer nih!",
            hintMessage: foundCase
              ? foundCase.ccbh
              : "Periksa kembali pointer sudah terhubung pada node yang benar!",
          });
          setIsVerifying(false);
          return;
        }

        await updateDetailedProgress(data.id, data.topic, false, data.level);
        setShowHint(true);
        setFeedback({
          header: "Ada pointer yang kurang nih!",
          hintMessage:
            "Pastikan semua pointer terhubung sesuai dengan petunjuk soal!",
        });
        setIsVerifying(false);
        return;
      }
    }

    if (rules.required_labels) {
      const allLabelsCorrect = rules.required_labels.every((req) =>
        labels.some(
          (l) => l.id === req.id && l.target_node === req.target_node,
        ),
      );
      if (!allLabelsCorrect) {
        const foundCase = casesHint.find(
          (c) => c.condition === "incorrect_label_position",
        );
        await updateDetailedProgress(data.id, data.topic, false, data.level);
        setShowHint(true);
        setFeedback({
          header: "Ada label yang salah posisi nih!",
          hintMessage: foundCase
            ? foundCase.ccbh
            : "Pastikan setiap label menunjuk pada node yang sesuai dengan struktur!",
        });
        setIsVerifying(false);
        return;
      }
    }

    const isNew = !completedPuzzles.includes(data.id);
    audioManager.playSFX("correct");
    setIsComplete(true, isNew);
    setIsVerifying(false);
  };

  return (
    <React.Fragment>
      <h3 className="text-xl font-semibold text-center">Topik: {data.topic}</h3>
      <p className="text-zinc-500 font-medium text-center max-w-xl mx-auto">
        {data.question}
      </p>
      <div
        className="rounded-2xl mt-4 overflow-hidden border border-icy-300 border-dashed"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onClick={cancelEvents}
      >
        {/* Canvas Area */}
        <ArcherContainer
          strokeColor="hsl(200, 87%, 52%)"
          strokeWidth={3}
          endShape={{ arrow: { arrowLength: 4, arrowThickness: 4 } }}
          ref={archerRef}
        >
          <motion.div
            className="flex h-66 select-none overflow-x-auto lg:overflow-hidden clean-scrollbar mx-2 clean-scrollbar-icy"
            onScroll={() => {
              if (archerRef.current) archerRef.current.refreshScreen();
            }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 canvas-pattern"></div>

            {/* Nodes Rendering */}
            <NodesLayout
              layout={data.initial_layout}
              canvasRef={canvasRef}
              archerRef={archerRef}
              nodes={nodes}
              setNodes={setNodes}
              pointers={pointers}
              setPointers={setPointers}
              labels={labels}
              setLabels={setLabels}
              setMousePos={setMousePos}
              selectedLabelId={selectedLabelId}
              linkingSource={linkingSource}
              setLinkingSource={setLinkingSource}
              handleLabelClick={handleLabelClick}
              moveLabelTo={moveLabelTo}
              hasModified={hasModified}
              setHasModified={setHasModified}
            />

            {/* Cursor Preview */}
            {linkingSource && (
              <ArcherElement id="cursor-node">
                <div
                  className="absolute pointer-events-none w-1 h-1"
                  style={{
                    left: mousePos.x,
                    top: mousePos.y,
                  }}
                />
              </ArcherElement>
            )}
          </motion.div>
        </ArcherContainer>

        {/* Bottom Control */}
        <div className="w-full border-t border-icy-200 flex items-center justify-between px-8 bg-icy-100/20 border-dashed flex-col gap-4 py-4 sm:flex-row mt-2">
          <div className="flex flex-col gap-2">
            <span className="text-zinc-600 text-sm font-[650]">Label Tray</span>
            <TrayArea enableZone={!!selectedLabelId} onClick={moveLabelTo}>
              {labels
                .filter((l) => !l.target_node)
                .map((l) => (
                  <TargetLabel
                    key={l.id}
                    onClick={handleLabelClick}
                    text={l.text}
                    id={l.id}
                  />
                ))}
              {labels.filter((l) => !l.target_node).length === 0 && (
                <span className="text-sm font-medium">
                  Klik di sini untuk lepas label
                </span>
              )}
            </TrayArea>
          </div>
          <button
            onClick={handleCheck}
            className={`px-6 py-2.5 bg-primary text-white font-semibold rounded-xl border-b-3 border-icy-600 hover:bg-primary-strong transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 flex items-center gap-2 ${showHint ? "" : "active:border-b-0 active:translate-y-1"}`}
            disabled={showHint || isVerifying}
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
              "Cek struktur"
            )}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NodeLinker;
