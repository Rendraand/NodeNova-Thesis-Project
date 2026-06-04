import React from "react";

import { useDraggable, useDroppable, DragDropProvider } from "@dnd-kit/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// import data from "../data/courses.json";

// Komponen Draggable untuk pilihan jawaban
const DraggableOption = ({ option, isUsed }) => {
  const { ref } = useDraggable({
    id: option.id,
  });

  return (
    <div
      ref={ref}
      className={`px-4 py-1 bg-zinc-800 border-x-2 border-t-2 border-b-4 border-zinc-600 rounded-xl cursor-grab active:cursor-grabbing hover:border-zinc-500 transition-colors select-none hover:bg-zinc-700 active:scale-95 ${
        isUsed ? "opacity-0 pointer-events-none" : ""
      }`}
    >
      <span className="text-white code-block">{option.content}</span>
    </div>
  );
};

// Komponen Droppable untuk part [HOLE]
const DroppableHole = ({ id, droppedItem, onRemove }) => {
  const { isDropTarget, ref } = useDroppable({ id });

  return (
    <motion.div
      layout
      ref={ref}
      onClick={() => droppedItem && onRemove(id)}
      className={`inline-flex items-center justify-center h-8 mx-1.5 rounded-lg border px-4 min-w-12 transition-colors hover:bg-primary-stronger/30 hover:border-primary-strong hover:text-primary ${
        isDropTarget
          ? "border-primary-strong text-primary bg-primary-stronger/30 border-dashed"
          : droppedItem
            ? "bg-zinc-700 text-white border-0 cursor-pointer shadow-sm"
            : "bg-zinc-800 border-zinc-700 border-dashed"
      }`}
      transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
    >
      <motion.span className="leading-7 code-block whitespace-nowrap">
        {droppedItem?.content}
      </motion.span>
    </motion.div>
  );
};

const SnippetCode = ({ course }) => {
  const [answers, setAnswers] = useState({});

  // let params = useParams();

  // useEffect(() => {
  //   const found = data.find((item) => item.id === params.id);
  //   if (found) {
  //     setCourse(found);
  //   }
  // }, [params.id]);

  if (!course.codeTemplate) return null;

  // Definisi token untuk syntax highlighting sederhana
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

  const removeAnswer = (holeId) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[holeId];
      return newAnswers;
    });
  };

  const highlightTokens = (text) => {
    // Tangani komentar (satu baris)
    if (text.trim().startsWith("//")) {
      return <span className="text-zinc-400 italic">{text}</span>;
    }

    // Pecah string berdasarkan word boundary untuk mewarnai keyword
    const tokens = text.split(/(\b\w+\b)/g);
    return tokens.map((token, i) => {
      if (keywords.includes(token)) {
        return (
          <span key={i} className="text-babypink-300 font-medium">
            {token}
          </span>
        );
      }
      if (types.includes(token) || /^[A-Z]/.test(token)) {
        // Tipe data atau Class/Struct (dimulai huruf kapital)
        return (
          <motion.span
            layout
            transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
            key={i}
            className="text-mauve-100"
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
            key={i}
            className="text-primary-strong"
          >
            {token}
          </motion.span>
        );
      }
      return (
        <motion.span
          layout
          key={i}
          transition={{ type: "spring", bounce: 0.4, visualDuration: 0.25 }}
        >
          {token}
        </motion.span>
      );
    });
  };

  let holeIndex = 0;

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const option = options.find(
          (opt) => opt.id === event.operation.source.id,
        );

        if (event.operation.target?.id.startsWith("hole")) {
          setAnswers((prev) => ({
            ...prev,
            [event.operation.target?.id]: option,
          }));
        }
      }}
    >
      <code className="mt-8 block bg-zinc-900 py-6 rounded-2xl leading-relaxed overflow-hidden mb-8 text-white">
        {course.codeTemplate.split("\n").map((line, lineIdx) => (
          <div
            key={lineIdx}
            className="flex group hover:bg-zinc-800 transition-colors px-6"
          >
            {/* Nomor Baris */}
            <div className="w-8 text-right pe-4 text-zinc-600 select-none border-r border-zinc-700 group-hover:text-zinc-500 shrink-0">
              {lineIdx + 1}
            </div>
            {/* Konten Kode */}
            <div className="pl-4 whitespace-pre flex items-center">
              {line.split(/(\[HOLE\])/g).map((part, partIdx) => {
                if (part === "[HOLE]") {
                  const currentHoleId = `hole-${holeIndex++}`;
                  return (
                    <DroppableHole
                      key={currentHoleId}
                      id={currentHoleId}
                      droppedItem={answers[currentHoleId]}
                      onRemove={removeAnswer}
                    />
                  );
                }
                return (
                  <React.Fragment key={partIdx}>
                    {highlightTokens(part)}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </code>

      {/* Area Pilihan Jawaban */}
      <div className="flex gap-4">
        {options.map((option) => {
          const isUsed = Object.values(answers).some((a) => a.id === option.id);
          return (
            <div className="rounded-xl bg-zinc-300">
              <DraggableOption
                key={option.id}
                option={option}
                isUsed={isUsed}
              />
            </div>
          );
        })}
      </div>
    </DragDropProvider>
  );
};

export default SnippetCode;
