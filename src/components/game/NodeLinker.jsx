import React, { useState, useRef } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { ArcherContainer, ArcherElement } from "react-archer";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { useAuth } from "../../context/AuthContext";

const AttachedLabel = ({ text, onClick, id }) => {
  return (
    <button
      onClick={(e) => onClick(e, id)}
      className={`px-3 rounded-lg font-semibold text-sm select-none whitespace-nowrap z-50 transition-all cursor-pointer bg-mauve-purple-100 flex text-mauve-purple-500 border border-mauve-purple-500 items-center h-7`}
    >
      {text}
    </button>
  );
};

const LabelZone = ({ children, enableZone, onClick, id }) => {
  return (
    <div
      onClick={(e) => {
        onClick(e, id);
      }}
      className={`h-7 mb-2 rounded-lg transition-colors w-fit mx-auto min-w-10 border ${enableZone ? "border-primary border-dashed bg-icy-100 cursor-pointer animate-pulse" : "border-transparent"}`}
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

const SLLNode = ({
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
      className="absolute group"
    >
      {/* Label Zone */}
      <LabelZone
        enableZone={
          selectedLabelId && !labels.some((l) => l.attached_to === node.id)
        }
        onClick={moveLabelTo}
        id={node.id}
      >
        {labels
          .filter((l) => l.attached_to === node.id)
          .map((l) => (
            <AttachedLabel
              key={l.id}
              text={l.text}
              onClick={handleLabelClick}
              id={l.id}
            />
          ))}
      </LabelZone>

      {/* Node + Arrow Pointer */}
      <ArcherElement
        id={node.id}
        relations={[
          ...pointers
            .filter((p) => p.from === node.id)
            .map((p) => ({
              targetId: p.to,
              targetAnchor: "left",
              sourceAnchor: "right",
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
                  sourceAnchor: "right",
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
            className={`border border-primary bg-white rounded-xl flex overflow-hidden transition-all ${node.draggable ? "cursor-grab active:cursor-grabbing border-dashed" : ""} ${linkingSource === node.id ? "ring-2 ring-primary/70 ring-offset-2" : ""} ${linkingSource && linkingSource !== node.id ? "hover:ring-2 hover:ring-primary/70 ring-offset-2" : ""}`}
            onPointerDown={startDrag}
            onClick={(e) => completeLinking(e, node.id)}
          >
            <div className="p-3 text-icy-700 font-medium">{node.label}</div>
            <div
              className={`px-2.5 bg-icy-100 border-s border-primary ${node.draggable ? "border-dashed" : ""}`}
            ></div>
          </div>

          {/* Pointer Controls */}
          {pointers.some((p) => p.from === node.id) ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setPointers(pointers.filter((p) => p.from !== node.id));
              }}
              className="w-3.5 h-3.5 rounded-full bg-icy-400 absolute bottom-0 right-0 translate-x-5 flex items-center justify-center cursor-pointer hover:bg-rose-400 transition-colors"
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
              className="p-2 absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-crosshair"
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
          className="block cursor-pointer opacity-0 group-hover:opacity-100 transition-all group/trash-zone hover:bg-red-100 p-1 mt-1 ms-1 rounded-full"
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

const StackElement = ({
  node,
  selectedLabelId,
  moveLabelTo,
  handleLabelClick,
  labels,
}) => {
  const { ref } = useDraggable({
    id: node.id,
  });

  return (
    <motion.div
      ref={ref}
      className="w-30 h-12 flex items-center justify-center relative bg-primary rounded-[10px] text-white text-lg font-semibold cursor-grab active:cursor-grabbing border-2 border-icy-600/80"
      whileDrag={{ scale: 0.95 }}
    >
      <p>{node.label}</p>
      <div className="absolute top-1 right-1.5 bg-icy-300 rounded-full w-14 h-0.75"></div>

      {/* Label Zone */}
      <div className="absolute top-1 left-0 flex w-24 h-full items-center justify-center -translate-x-full">
        <LabelZone
          enableZone={
            selectedLabelId && !labels.some((l) => l.attached_to === node.id)
          }
          onClick={moveLabelTo}
          id={node.id}
        >
          {labels
            .filter((l) => l.attached_to === node.id)
            .map((l) => (
              <AttachedLabel
                key={l.id}
                text={l.text}
                onClick={handleLabelClick}
                id={l.id}
              />
            ))}
        </LabelZone>
      </div>
    </motion.div>
  );
};

const StackTrashCan = () => {
  const { isDropTarget, ref } = useDroppable({
    id: "stack-droppable",
  });

  return (
    <motion.div
      ref={ref}
      className={`absolute bottom-4 right-8 bg-rose-50/80 flex flex-col w-24 h-24 border-2 border-rose-300 border-dashed rounded-xl items-center justify-center text-rose-400 font-semibold gap-1 transition-colors ${isDropTarget ? "bg-rose-100/60 border-rose-400 text-rose-500" : ""}`}
      animate={{ scale: isDropTarget ? 1.05 : 1 }}
      transition={{
        type: "spring",
        stiffness: 240,
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="-1 -1 32 32"
        id="Recycle-Bin-2--Streamline-Core"
        height="32"
        width="32"
        className={`stroke-rose-400 ${isDropTarget ? "stroke-rose-500" : ""}`}
        animate={{ scale: isDropTarget ? 1.1 : 1 }}
        transition={{
          type: "spring",
          stiffness: 240,
        }}
      >
        <desc>Recycle Bin 2 Streamline Icon: https://streamlinehq.com</desc>
        <g id="recycle-bin-2--remove-delete-empty-bin-trash-garbage">
          <path
            id="Vector"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.142857142857143 7.5h25.714285714285715"
            strokeWidth="2"
          ></path>
          <path
            id="Vector_2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.357142857142857 7.5h19.285714285714285v19.285714285714285c0 0.5682857142857143 -0.22585714285714284 1.1134285714285712 -0.6276428571428571 1.5152142857142856s-0.9469285714285715 0.6276428571428571 -1.5152142857142856 0.6276428571428571h-15c-0.5683285714285714 0 -1.1133642857142856 -0.22585714285714284 -1.5152357142857142 -0.6276428571428571C5.582914285714286 27.899142857142856 5.357142857142857 27.354 5.357142857142857 26.785714285714285v-19.285714285714285Z"
            strokeWidth="2"
          ></path>
          <path
            id="Vector_3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.642857142857142 7.5V6.428571428571429c0 -1.4207999999999998 0.5644071428571429 -2.7834214285714283 1.5690642857142858 -3.7880785714285716C12.21657857142857 1.63584 13.5792 1.0714285714285714 15 1.0714285714285714c1.4207999999999998 0 2.7834214285714283 0.5644114285714286 3.7880785714285716 1.5690642857142858C19.792735714285715 3.64515 20.357142857142858 5.007771428571428 20.357142857142858 6.428571428571429v1.0714285714285714"
            strokeWidth="2"
          ></path>
          <path
            id="Vector_4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.785714285714285 13.9317V22.50642857142857"
            strokeWidth="2"
          ></path>
          <path
            id="Vector_5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.214285714285715 13.9317V22.50642857142857"
            strokeWidth="2"
          ></path>
        </g>
      </motion.svg>
      <p>Buang</p>
    </motion.div>
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
      prev.map((l) => (l.attached_to === id ? { ...l, attached_to: null } : l)),
    );
    setSelectedNode(null);

    if (!hasModified) setHasModified(true);
  };

  if (layout.layout_type === "sll") {
    return (
      <React.Fragment>
        <motion.div ref={constraintRef} className="relative w-full h-full">
          {nodes.map((node) => (
            <SLLNode
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
            />
          ))}
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
  } else if (layout.layout_type === "stack") {
    return (
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          if (event.operation.target?.id === "stack-droppable") {
            const sourceId = event.operation.source.id;

            setNodes(nodes.filter((n) => n.id !== sourceId));
            setLabels((prev) =>
              prev.map((l) =>
                l.attached_to === sourceId ? { ...l, attached_to: null } : l,
              ),
            );

            if (!hasModified) {
              setHasModified(true);
            }
          }
        }}
      >
        <div ref={stackConstraintRef} className="relative w-full h-full">
          <motion.div className="absolute bottom-2 right-1/2 translate-x-1/2 flex flex-col-reverse gap-1">
            {nodes.map((node) => (
              <StackElement
                key={node.id}
                node={node}
                constraint={stackConstraintRef}
                selectedLabelId={selectedLabelId}
                moveLabelTo={moveLabelTo}
                handleLabelClick={handleLabelClick}
                labels={labels}
                nodes={nodes}
              />
            ))}
          </motion.div>

          <StackTrashCan />
        </div>
      </DragDropProvider>
    );
  }
};

const NodeLinker = ({
  showHint,
  setShowHint,
  setFeedback,
  setIsComplete,
  data,
}) => {
  const { savePuzzleProgress, updateDetailedProgress } = useAuth();
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
        l.id === selectedLabelId ? { ...l, attached_to: nodeId } : l,
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
      const currentIds = nodes.map((n) => n.id);
      const stillExists = rules.deleted_nodes.some((id) =>
        currentIds.includes(id),
      );
      if (stillExists) {
        const foundCase = casesHint.find(
          (c) => c.condition === "node_still_exist",
        );

        await updateDetailedProgress(data.id, data.topic, false);
        setShowHint(true);
        setFeedback({
          header: "Hmm, kamu belum menghapus node atau element nya nih...",
          hintMessage: foundCase
            ? foundCase.ccbh
            : "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
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
        const foundCase = casesHint.find(
          (c) => c.condition === "wrong_node_deleted",
        );

        await updateDetailedProgress(data.id, data.topic, false);
        setShowHint(true);
        setFeedback({
          header: "Sepertinya kamu salah menghapus node, coba cek lagi ya...",
          hintMessage: foundCase
            ? foundCase.ccbh
            : "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
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
        const foundCase = casesHint.find(
          (c) => c.condition === "pointer_missing",
        );
        await updateDetailedProgress(data.id, data.topic, false);
        setShowHint(true);
        setFeedback({
          header: "Wah, kamu ada yang miss di bagian pointer nih!",
          hintMessage: foundCase
            ? foundCase.ccbh
            : "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
        });
        setIsVerifying(false);
        return;
      }
    }

    if (rules.required_labels) {
      const allLabelsCorrect = rules.required_labels.every((req) =>
        labels.some(
          (l) => l.id === req.label_id && l.attached_to === req.must_attach_to,
        ),
      );
      if (!allLabelsCorrect) {
        const foundCase = casesHint.find(
          (c) => c.condition === "incorrect_label_position",
        );
        await updateDetailedProgress(data.id, data.topic, false);
        setShowHint(true);
        setFeedback({
          header: "Wah, kamu ada yang miss di bagian label nih!",
          hintMessage: foundCase
            ? foundCase.ccbh
            : "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
        });
        setIsVerifying(false);
        return;
      }
    }

    await updateDetailedProgress(data.id, data.topic, true);
    const result = await savePuzzleProgress(data.id);
    setIsComplete(true, result.isNew);
    setIsVerifying(false);
  };

  return (
    <React.Fragment>
      <h3 className="text-xl font-semibold">Topik: {data.topic}</h3>
      <p className="text-zinc-500 font-medium">{data.description}</p>
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
          <motion.div className="flex h-66 overflow-hidden select-none">
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

            {/* Ghost Node for Cursor Preview */}
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
        <div className="w-full h-24 border-t border-icy-200 flex items-center justify-between px-8 bg-icy-100/20 border-dashed">
          <div className="flex flex-col gap-2">
            <span className="text-zinc-600 text-sm font-[650]">Label Tray</span>
            <TrayArea enableZone={!!selectedLabelId} onClick={moveLabelTo}>
              {labels
                .filter((l) => !l.attached_to)
                .map((l) => (
                  <AttachedLabel
                    key={l.id}
                    onClick={handleLabelClick}
                    text={l.text}
                    id={l.id}
                  />
                ))}
              {labels.filter((l) => !l.attached_to).length === 0 && (
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
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
