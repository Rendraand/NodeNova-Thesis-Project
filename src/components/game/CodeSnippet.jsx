import React from "react";

import { useDraggable, useDroppable, DragDropProvider } from "@dnd-kit/react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useGameProgress } from "../../context/GameProgressContext";

import audioManager from "../../utils/audio";

import "../../styles/custom.css";

const CodeBlock = ({ option, isUsed, type, handleOptionClick }) => {
  const { ref } = useDraggable({
    id: option.id,
  });

  if (type === "single-drag") {
    return (
      <div className="bg-zinc-200 rounded-xl">
        <div
          ref={ref}
          className={`px-4 py-1 bg-white border-x-2 border-t-2 border-b-4 border-zinc-200 rounded-xl hover:border-zinc-300 hover:text-zinc-600 transition-colors select-none active:scale-95 cursor-grab active:cursor-grabbing ${
            isUsed ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <span className="text-zinc-700 code">{option.content}</span>
        </div>
      </div>
    );
  } else if (type === "bundle-click") {
    return (
      <div className="bg-zinc-200 rounded-xl">
        <div
          onClick={() => handleOptionClick(option)}
          className={`px-4 py-1 bg-white border-x-2 border-t-2 border-b-4 border-zinc-200 rounded-xl transition-colors select-none hover:bg-zinc-100 cursor-pointer active:border-b-2 active:translate-y-0.5 ${
            isUsed ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <span className="text-zinc-700 code">{option.content}</span>
        </div>
      </div>
    );
  }
};

const CodeBlockOptions = ({ data, answers, setAnswers }) => {
  const shuffledOptions = useMemo(() => {
    if (!data?.options) return [];
    return [...data.options].sort(() => Math.random() - 0.5);
  }, [data.options]);

  const handleOptionClick = (option) => {
    const blankStructureMatches = data.code_template.match(/\[blank\]/g);
    const blankFound = blankStructureMatches ? blankStructureMatches.length : 0;

    const newAnswers = {};
    for (let i = 0; i < blankFound; i++) {
      let parts = option.content.split(" & ");
      newAnswers[`blank-${i}`] = { ...option, content: parts[i] };
    }
    setAnswers(newAnswers);
  };

  return (
    <React.Fragment>
      {shuffledOptions.map((option) => {
        const isUsed = Object.values(answers).some((a) => a.id === option.id);
        return (
          <CodeBlock
            key={option.id}
            option={option}
            isUsed={isUsed}
            type={data.option_type}
            handleOptionClick={handleOptionClick}
          />
        );
      })}
    </React.Fragment>
  );
};

// Komponen Droppable untuk part [blank]
const BlankArea = ({ id, fill, onRemove }) => {
  const { isDropTarget, ref } = useDroppable({ id });

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
      ref={ref}
      onClick={onRemove}
      className={`inline-flex items-center justify-center h-7.5 rounded-lg px-4 transition-colors border-2 border-dashed ${
        isDropTarget
          ? "border-primary text-primary bg-icy-100"
          : "bg-white border-zinc-300 hover:border-primary hover:bg-icy-100"
      } ${fill ? "cursor-pointer hover:text-icy-700" : "min-w-15"}`}
    >
      <motion.span className="leading-7 whitespace-nowrap code">
        {fill?.content || ""}
      </motion.span>
    </motion.div>
  );
};

const CodeSnippet = ({
  showHint,
  setShowHint,
  setFeedback,
  setIsComplete,
  data,
}) => {
  const { completedPuzzles, updateDetailedProgress } = useGameProgress();
  const [answers, setAnswers] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);

  let blankIndex = 0;

  const keywords = [
    "return",
    "struct",
    "void",
    "if",
    "else",
    "while",
    "for",
    "public",
    "private",
    "protected",
  ];
  const types = ["int", "float", "double", "char", "bool", "long", "short"];

  const handleCheck = async () => {
    if (!data) return;
    setIsVerifying(true); // Mulai loading pada button

    if (data.option_type === "single-drag") {
      const userPicked = answers["blank-0"];
      if (!userPicked) return setIsVerifying(false);

      if (userPicked.content === data.correct_answer) {
        audioManager.playSFX("correct");
        const isNew = !completedPuzzles.includes(data.id);
        setIsComplete(true, isNew);
      } else {
        await updateDetailedProgress(data.id, data.topic, false, data.level);
        setFeedback({
          header: `Jawaban ${userPicked.content} kurang tepat nih!`,
          hintMessage:
            userPicked.ccbh ||
            "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
        });
        setShowHint(true);
        setIsVerifying(false);
      }
    } else if (data.option_type === "bundle-click") {
      const blankStructureMatches = data.code_template.match(/\[blank\]/g);
      const blankFound = blankStructureMatches
        ? blankStructureMatches.length
        : 0;
      const answerParts = data.correct_answer.split(" & ");

      if (!answers["blank-0"]) return setIsVerifying(false);

      const options = data.options;
      const matchOption = options.find(
        (opt) => opt.id === answers["blank-0"].id,
      );

      for (let i = 0; i < blankFound; i++) {
        const userPicked = answers[`blank-${i}`];
        if (userPicked.content !== answerParts[i]) {
          await updateDetailedProgress(data.id, data.topic, false, data.level);
          setFeedback({
            header: `Wah, ${matchOption.content} masih kurang tepat!`,
            hintMessage:
              answers["blank-0"].ccbh ||
              "Tidak menemukan case-based hint yang cocok. Silahkan cek kembali.",
          });
          setShowHint(true);
          setIsVerifying(false);
          return;
        }
      }

      audioManager.playSFX("correct");
      const isNew = !completedPuzzles.includes(data.id);
      setIsComplete(true, isNew);
    }
    setIsVerifying(false);
  };

  const removeAnswer = () => {
    setAnswers({});
  };

  const highlightTokens = (text) => {
    if (text.trim().startsWith("//")) {
      return <span className="text-zinc-400 italic">{text}</span>;
    }

    const tokens = text.split(/(\b\w+\b|[(){}])/g);
    return tokens.map((token, i) => {
      if (token === "(" || token === ")") {
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={`${i + 1}`}
            className="text-zinc-400 font-medium"
          >
            {token}
          </motion.span>
        );
      }

      if (token === "{" || token === "}") {
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={`${i + 1}`}
            className="text-zinc-400 font-medium"
          >
            {token}
          </motion.span>
        );
      }

      if (keywords.includes(token)) {
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={`${i + 1}`}
            className="text-babypink-600 font-medium"
          >
            {token}
          </motion.span>
        );
      }
      if (types.includes(token)) {
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={`${i + 1}`}
            className="text-mint-700"
          >
            {token}
          </motion.span>
        );
      }
      if (token === "NULL" || token === "nullptr") {
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={`${i + 1}`}
            className="text-mauve-purple-600"
          >
            {token}
          </motion.span>
        );
      }
      return (
        <motion.span
          layout
          key={`${i + 1}`}
          transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
        >
          {token}
        </motion.span>
      );
    });
  };

  if (!data) return null;

  return (
    <React.Fragment>
      <h3 className="text-xl font-extrabold text-center">
        Topik: {data.topic}
      </h3>
      <p className="text-zinc-500 font-medium text-center max-w-xl mx-auto">
        {data.question}
      </p>
      <DragDropProvider
        onDragEnd={(event) => {
          if (event.canceled) return;

          const option = data.options.find(
            (opt) => opt.id === event.operation.source?.id,
          );

          if (event.operation.target?.id.startsWith("blank")) {
            setAnswers((prev) => ({
              ...prev,
              [event.operation.target?.id]: option,
            }));
          }
        }}
      >
        <div className="mt-8 block bg-zinc-50 rounded-2xl leading-relaxed">
          <code className="py-6 text-zinc-600 overflow-x-auto clean-scrollbar clean-scrollbar-zinc mb-2 mx-2">
            {data.code_template.split("\n").map((line, lineIdx) => (
              <div
                key={`lineIdx-${lineIdx + 1}`}
                className="flex group hover:bg-zinc-200/70 transition-colors px-6"
              >
                <div className="w-8 text-right pe-4 text-zinc-400 select-none border-e border-zinc-200 group-hover:text-zinc-500 shrink-0 py-0.5">
                  {lineIdx + 1}
                </div>
                <div className="whitespace-pre flex items-center relative ps-4 pe-6">
                  {line.split(/(\[blank\])/g).map((part, partIdx) => {
                    if (part === "[blank]") {
                      const currentHoleId = `blank-${blankIndex++}`;
                      return (
                        <BlankArea
                          key={currentHoleId}
                          id={currentHoleId}
                          fill={answers[currentHoleId]}
                          onRemove={removeAnswer}
                        />
                      );
                    } else {
                      return (
                        <React.Fragment key={`partIdx-${partIdx + 1}`}>
                          {highlightTokens(part)}
                        </React.Fragment>
                      );
                    }
                  })}
                </div>
              </div>
            ))}
          </code>

          {/* Bottom Controls */}
          <div className="border-t-2 border-zinc-200 flex px-3 py-3 gap-4 flex-col items-center sm:flex-row sm:items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center justify-center sm:justify-start">
              <CodeBlockOptions
                data={data}
                answers={answers}
                setAnswers={setAnswers}
              />
            </div>
            <div className="flex items-center shrink-0 h-16">
              <button
                onClick={handleCheck}
                className={`px-6 py-3 font-semibold text-white bg-primary border-b-3 border-icy-600 rounded-xl active:bg-primary-strong transition-colors cursor-pointer duration-100 disabled:bg-zinc-700 disabled:cursor-not-allowed disabled:border-zinc-600 disabled:text-zinc-400 flex items-center gap-2 ${showHint ? "" : "active:border-b-0 active:translate-y-0.75"}`}
                disabled={showHint || isVerifying}
              >
                {isVerifying ? (
                  <React.Fragment>
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
                  </React.Fragment>
                ) : (
                  "Cek Logika!"
                )}
              </button>
            </div>
          </div>
        </div>
      </DragDropProvider>
    </React.Fragment>
  );
};

export default CodeSnippet;
