import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, stagger, AnimatePresence } from "motion/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../services/firebase"; // Pastikan file config firebase kamu sudah benar
import CourseIcon from "../components/common/CourseIcon";
import { useAuth } from "../context/AuthContext";
import { useGameProgress } from "../context/GameProgressContext";

/**
 * @typedef {Object} CourseData
 * @property {string} id - ID unik untuk setiap level/misi.
 * @property {string} topic - Topik utama (contoh: "Binary Tree", "Stack").
 * @property {"Basic" | "Intermediate" | "Advanced"} level - Tingkat kesulitan.
 * @property {"code-snippet" | "node-linker" | "binary-tree"} category - Kategori interaksi gameplay.
 * @property {string} description - Deskripsi singkat misi.
 * @property {string} [question] - Pertanyaan teknis di dalam game.
 */

/**
 * Komponen untuk menampilkan tag kategori berdasarkan tipe data.
 * @param {Object} props
 * @param {string} props.category
 * @returns {import("react").JSX.Element|null}
 */
const CategoryTag = ({ category, isCompleted }) => {
  switch (category) {
    case "code-snippet":
      return (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] ${isCompleted ? "text-mint-700 bg-mint-100/60" : "text-icy-600 bg-icy-100/40"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="-0.75 -0.75 18 18"
            id="Bracket--Streamline-Core"
            height="18"
            width="18"
          >
            <desc>Bracket Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="bracket--code-angle-programming-file-bracket"
              className={isCompleted ? "stroke-mint-700" : "stroke-icy-600"}
            >
              <path
                id="Vector"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.714285714285714 12.375 0.5892857142857143 8.25 4.714285714285714 4.125"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector_2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.785714285714286 12.375 15.910714285714286 8.25 11.785714285714286 4.125"
                strokeWidth="1.5"
              ></path>
            </g>
          </svg>
          <p className="font-medium text-sm">Code Snippet</p>
        </div>
      );
    case "node-linker":
      return (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] ${isCompleted ? "text-mint-700 bg-mint-100/60" : "text-icy-600 bg-icy-100/40"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="-0.75 -0.75 18 18"
            id="Hierarchy-13--Streamline-Core"
            height="18"
            width="18"
          >
            <desc>Hierarchy 13 Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="hierarchy-13--node-organization-links-structure-link-nodes-network-hierarchy"
              className={isCompleted ? "stroke-mint-700" : "stroke-icy-600"}
            >
              <path
                id="Vector 190"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.161830357142858 8.281939285714286 3.3999075000000003 11.196428571428571"
                stroke-width="1.5"
              ></path>
              <path
                id="Vector 191"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.09239642857143 5.303571428571429 12.191614285714286 8.25"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector 192"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.366071428571429 7.3746985714285715 8.839285714285715 8.839285714285715"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector 2259"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.732142857142858 5.303571428571429 -2.357142857142857 0c-0.6509014285714286 0 -1.1785714285714286 -0.52767 -1.1785714285714286 -1.1785714285714286l0 -2.357142857142857c0 -0.6509073214285714 0.52767 -1.1785714285714286 1.1785714285714286 -1.1785714285714286l2.357142857142857 0c0.6509250000000001 0 1.1785714285714286 0.5276641071428572 1.1785714285714286 1.1785714285714286l0 2.357142857142857c0 0.6509014285714286 -0.5276464285714285 1.1785714285714286 -1.1785714285714286 1.1785714285714286Z"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector 2260"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m12.375 12.964285714285715 -2.357142857142857 0c-0.6509014285714286 0 -1.1785714285714286 -0.5276464285714285 -1.1785714285714286 -1.1785714285714286l0 -2.357142857142857c0 -0.6509014285714286 0.52767 -1.1785714285714286 1.1785714285714286 -1.1785714285714286l2.357142857142857 0c0.6509250000000001 0 1.1785714285714286 0.5276582142857142 1.1785714285714286 1.1785714285714286l0 2.357142857142857c0 0.6509250000000001 -0.5276464285714285 1.1785714285714286 -1.1785714285714286 1.1785714285714286Z"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector 2261"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6.1875 8.281939285714286 -2.357142857142857 0c-0.6509014285714286 0 -1.1785714285714286 -0.52767 -1.1785714285714286 -1.1785714285714286l0 -2.357142857142857c0 -0.6509132142857142 0.52767 -1.1785714285714286 1.1785714285714286 -1.1785714285714286l2.357142857142857 0c0.6509014285714286 0 1.1785714285714286 0.5276582142857142 1.1785714285714286 1.1785714285714286l0 2.357142857142857c0 0.6509014285714286 -0.52767 1.1785714285714286 -1.1785714285714286 1.1785714285714286Z"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector 2262"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.125 15.910714285714286 -2.357142857142857 0c-0.6509073214285714 0 -1.1785714285714286 -0.5276464285714285 -1.1785714285714286 -1.1785714285714286l0 -2.357142857142857c0 -0.6509014285714286 0.5276641071428572 -1.1785714285714286 1.1785714285714286 -1.1785714285714286l2.357142857142857 0c0.6509014285714286 0 1.1785714285714286 0.5276582142857142 1.1785714285714286 1.1785714285714286l0 2.357142857142857c0 0.6509250000000001 -0.52767 1.1785714285714286 -1.1785714285714286 1.1785714285714286Z"
                strokeWidth="1.5"
              ></path>
            </g>
          </svg>
          <p className="font-medium text-sm">Node Linker</p>
        </div>
      );
    case "binary-tree":
    case "trees":
      return (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] ${isCompleted ? "text-mint-700 bg-mint-100/60" : "text-icy-600 bg-icy-100/40"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="-0.75 -0.75 18 18"
            id="Module-Three--Streamline-Core"
            height="18"
            width="18"
          >
            <desc>Module Three Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="module-three--code-three-module-programming-plugin"
              className={isCompleted ? "stroke-mint-700" : "stroke-icy-600"}
            >
              <path
                id="Vector"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.1875 9.723214285714286H1.1785714285714286c-0.32545307142857144 0 -0.5892857142857143 0.263835 -0.5892857142857143 0.5892857142857143V15.321428571428571c0 0.32540357142857146 0.26383264285714286 0.5892857142857143 0.5892857142857143 0.5892857142857143h5.008928571428571c0.3254507142857143 0 0.5892857142857143 -0.26388214285714284 0.5892857142857143 -0.5892857142857143V10.3125c0 -0.3254507142857143 -0.263835 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector_2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.321428571428571 9.723214285714286H10.3125c-0.3254507142857143 0 -0.5892857142857143 0.263835 -0.5892857142857143 0.5892857142857143V15.321428571428571c0 0.32540357142857146 0.263835 0.5892857142857143 0.5892857142857143 0.5892857142857143H15.321428571428571c0.32540357142857146 0 0.5892857142857143 -0.26388214285714284 0.5892857142857143 -0.5892857142857143V10.3125c0 -0.3254507142857143 -0.26388214285714284 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                strokeWidth="1.5"
              ></path>
              <path
                id="Vector_3"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.760357142857144 0.5892857142857143H5.751428571428572c-0.3254507142857143 0 -0.5892857142857143 0.26383264285714286 -0.5892857142857143 0.5892857142857143v5.008928571428571c0 0.3254507142857143 0.263835 0.5892857142857143 0.5892857142857143 0.5892857142857143h5.008928571428571c0.32546250000000004 0 0.5892857142857143 -0.263835 0.5892857142857143 -0.5892857142857143V1.1785714285714286c0 -0.32545307142857144 -0.26382321428571426 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                strokeWidth="1.5"
              ></path>
            </g>
          </svg>
          <p className="font-medium text-sm">Tree Visualization</p>
        </div>
      );
    default:
      return null;
  }
};

/**
 * Komponen untuk menampilkan tag tingkat kesulitan.
 * @param {Object} props
 * @param {CourseData["level"]} props.difficulty
 * @returns {import("react").JSX.Element}
 */
const DifficultyTag = ({ difficulty, isCompleted }) => {
  switch (difficulty) {
    case "Basic":
      return (
        <div className="flex items-center text-mint-700 gap-1.5 bg-mint-100/60 px-3 py-1.5 rounded-[10px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            id="Controller-1--Streamline-Core"
            height="18"
            width="18"
          >
            <desc>Controller 1 Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="controller-1--remote-quadcopter-drones-flying-drone-control-controller-technology-fly"
              className="stroke-mint-700"
            >
              <path
                id="Vector 693"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.40024 5.01929v2.31089"
                strokeWidth="1"
              ></path>
              <path
                id="Vector 694"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.55576 6.1748 -2.3109 0"
                strokeWidth="1"
              ></path>
              <path
                id="Vector 2430"
                stroke-linejoin="round"
                d="M1.25636 5.21192 0.844169 8.92165C0.693911 10.274 1.75248 11.4567 3.11312 11.4567c0.8647 0 1.65519 -0.4886 2.0419 -1.262l0.3594 -0.71879h2.97116l0.3594 0.71879c0.38671 0.7734 1.17722 1.262 2.04192 1.262 1.3606 0 2.4192 -1.1827 2.2689 -2.53505l-0.4122 -3.70973c-0.1688 -1.5193 -1.453 -2.66871 -2.98161 -2.66871H4.23801c-1.52864 0 -2.81284 1.14941 -2.98165 2.66871Z"
                strokeWidth="1"
              ></path>
              <g id="Group 628">
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.4663 5.51448c-0.1367 0 -0.2475 -0.11085 -0.2475 -0.2476 0 -0.13674 0.1108 -0.24759 0.2475 -0.24759"
                  strokeWidth="1"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.4663 5.51448c0.1368 0 0.2476 -0.11085 0.2476 -0.2476 0 -0.13674 -0.1108 -0.24759 -0.2476 -0.24759"
                  strokeWidth="1"
                ></path>
              </g>
              <g id="Group 630">
                <path
                  id="Vector_3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.73317 6.75248c0 -0.13674 0.11085 -0.2476 0.2476 -0.2476 0.13674 0 0.24759 0.11086 0.24759 0.2476"
                  strokeWidth="1"
                ></path>
                <path
                  id="Vector_4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.73326 6.7524c0 0.13675 0.11085 0.2476 0.2476 0.2476 0.13674 0 0.24759 -0.11085 0.24759 -0.2476"
                  strokeWidth="1"
                ></path>
              </g>
            </g>
          </svg>
          <p className="font-medium text-sm">Mudah</p>
        </div>
      );
    case "Intermediate":
      return (
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] ${isCompleted ? "text-mint-700 bg-mint-100/60" : "text-orange-600 bg-orange-50"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
            id="Controller-1--Streamline-Core"
            height="18"
            width="18"
          >
            <desc>Controller 1 Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="controller-1--remote-quadcopter-drones-flying-drone-control-controller-technology-fly"
              className={isCompleted ? "stroke-mint-700" : "stroke-orange-600"}
            >
              <path
                id="Vector 693"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.40024 5.01929v2.31089"
                strokeWidth="1"
              ></path>
              <path
                id="Vector 694"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m5.55576 6.1748 -2.3109 0"
                strokeWidth="1"
              ></path>
              <path
                id="Vector 2430"
                stroke-linejoin="round"
                d="M1.25636 5.21192 0.844169 8.92165C0.693911 10.274 1.75248 11.4567 3.11312 11.4567c0.8647 0 1.65519 -0.4886 2.0419 -1.262l0.3594 -0.71879h2.97116l0.3594 0.71879c0.38671 0.7734 1.17722 1.262 2.04192 1.262 1.3606 0 2.4192 -1.1827 2.2689 -2.53505l-0.4122 -3.70973c-0.1688 -1.5193 -1.453 -2.66871 -2.98161 -2.66871H4.23801c-1.52864 0 -2.81284 1.14941 -2.98165 2.66871Z"
                strokeWidth="1"
              ></path>
              <g id="Group 628">
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.4663 5.51448c-0.1367 0 -0.2475 -0.11085 -0.2475 -0.2476 0 -0.13674 0.1108 -0.24759 0.2475 -0.24759"
                  strokeWidth="1"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.4663 5.51448c0.1368 0 0.2476 -0.11085 0.2476 -0.2476 0 -0.13674 -0.1108 -0.24759 -0.2476 -0.24759"
                  strokeWidth="1"
                ></path>
              </g>
              <g id="Group 630">
                <path
                  id="Vector_3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.73317 6.75248c0 -0.13674 0.11085 -0.2476 0.2476 -0.2476 0.13674 0 0.24759 0.11086 0.24759 0.2476"
                  strokeWidth="1"
                ></path>
                <path
                  id="Vector_4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.73326 6.7524c0 0.13675 0.11085 0.2476 0.2476 0.2476 0.13674 0 0.24759 -0.11085 0.24759 -0.2476"
                  strokeWidth="1"
                ></path>
              </g>
            </g>
          </svg>
          <p className="font-medium text-sm">Sedang</p>
        </div>
      );
    default:
      return <></>;
  }
};

/**
 * Kartu misi yang berisi ringkasan data dari JSON.
 * @param {Object} props
 * @param {CourseData} props.data
 * @param {import("motion").Variants} props.item
 * @returns {import("react").JSX.Element}
 */
const CourseCard = ({ data, item, completedPuzzles }) => {
  const isCompleted = completedPuzzles?.includes(data.id);

  return (
    <motion.div
      variants={item}
      className={`cursor-pointer relative transition-colors duration-200 px-4 pb-4 pt-6 xs:pt-4 ${isCompleted ? "bg-mint-100/20 hover:bg-mint-100/40" : "hover:bg-zinc-100"}`}
    >
      <NavLink className="block" to={`/puzzles/${data.id}`}>
        <div className="flex items-start gap-4 mb-3">
          <span
            className={`flex size-16.5 items-center justify-center shrink-0 rounded-lg ${isCompleted ? "bg-mint-100/60" : "bg-icy-100/50"}`}
          >
            <CourseIcon topic={data.topic} isCompleted={isCompleted} />
          </span>
          <div>
            <h5
              className={`font-bold text-lg ${isCompleted ? "text-mint-700" : "text-zinc-800"}`}
            >
              {data.topic}
            </h5>
            <p
              className={`font-medium leading-tight line-clamp-3 ${
                isCompleted ? "text-mint-700/80" : "text-zinc-500"
              }`}
              title={data.description}
            >
              {data.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <CategoryTag category={data.category} isCompleted={isCompleted} />
          <DifficultyTag difficulty={data.level} isCompleted={isCompleted} />
        </div>

        <div className="flex items-center text-icy-600 gap-2 absolute top-2 right-3">
          {isCompleted ? (
            <React.Fragment>
              <p className="text-mint-700 font-medium ps-1">Selesai</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="-0.75 -0.75 18.06 18.06"
                id="Check-Square--Streamline-Core"
                height="18"
                width="18"
              >
                <desc>
                  Check Square Streamline Icon: https://streamlinehq.com
                </desc>
                <g
                  id="check-square--check-form-validation-checkmark-success-add-addition-box-square-tick"
                  className="stroke-mint-700"
                >
                  <path
                    id="Vector"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12.419999999999998 0.5914285714285713h-8.279999999999998c-1.9598168571428567 0 -3.548571428571428 1.5887545714285711 -3.548571428571428 3.548571428571428v8.279999999999998c0 1.9598759999999997 1.5887545714285711 3.548571428571428 3.548571428571428 3.548571428571428h8.279999999999998c1.9598759999999997 0 3.548571428571428 -1.588695428571428 3.548571428571428 -3.548571428571428v-8.279999999999998c0 -1.9598168571428567 -1.588695428571428 -3.548571428571428 -3.548571428571428 -3.548571428571428Z"
                    strokeWidth="1.5"
                  ></path>
                  <path
                    id="Vector_2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.730524399999997 5.618571428571427 -4.73142857142857 5.914285714285713 -2.365714285714285 -1.774285714285714"
                    strokeWidth="1.5"
                  ></path>
                </g>
              </svg>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="font-medium">+100</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                id="Flash-1--Streamline-Core"
                height="18"
                width="18"
                className="fill-icy-100 stroke-icy-600"
              >
                <desc>Flash 1 Streamline Icon: https://streamlinehq.com</desc>
                <g id="flash-1--flash-power-connect-charge-electricity-lightning">
                  <path
                    id="Vector"
                    d="m6.071385714285714 0.7142857142857143 -3.2142857142857144 7.585714285714285c-0.044457142857142855 0.10821428571428571 -0.061657142857142855 0.2256857142857143 -0.05007142857142857 0.3421 0.011571428571428571 0.11641428571428572 0.05155714285714286 0.22821428571428573 0.11645714285714286 0.3255571428571429 0.0648857142857143 0.09732857142857143 0.1527 0.17724285714285715 0.2557142857142857 0.23270000000000002 0.103 0.055471428571428574 0.21805714285714287 0.08477142857142857 0.33504285714285714 0.08535714285714285h3.9857142857142858l-2.857142857142857 10L16.914285714285715 7.6571428571428575c0.10185714285714287 -0.09822857142857143 0.1722857142857143 -0.22451428571428572 0.20242857142857143 -0.3628571428571429 0.030000000000000002 -0.13832857142857144 0.01814285714285714 -0.28247142857142854 -0.033857142857142856 -0.41411428571428577 -0.052000000000000005 -0.13164285714285714 -0.14200000000000002 -0.24484285714285714 -0.25857142857142856 -0.32525714285714286 -0.11642857142857144 -0.0804 -0.25414285714285717 -0.12438571428571428 -0.39571428571428574 -0.12634285714285715H11.071385714285714l2.857142857142857 -5.714285714285714h-7.857142857142858Z"
                    strokeWidth="1"
                  ></path>
                  <path
                    id="Vector_2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6.071471428571428 0.7142857142857143 -3.2142857142857144 7.585714285714285c-0.044457142857142855 0.10821428571428571 -0.061642857142857145 0.2256857142857143 -0.05007142857142857 0.3421 0.011571428571428571 0.11641428571428572 0.05155714285714286 0.22821428571428573 0.11645714285714286 0.3255571428571429 0.0649 0.09732857142857143 0.1527 0.17724285714285715 0.2557142857142857 0.23270000000000002 0.103 0.055471428571428574 0.21805714285714287 0.08477142857142857 0.33504285714285714 0.08535714285714285h3.9857142857142858l-2.857142857142857 10L16.914285714285715 7.6571428571428575c0.10200000000000001 -0.09822857142857143 0.17242857142857143 -0.22451428571428572 0.20242857142857143 -0.3628571428571429 0.030000000000000002 -0.13832857142857144 0.018285714285714287 -0.28247142857142854 -0.03371428571428572 -0.41411428571428577 -0.052142857142857144 -0.13164285714285714 -0.14200000000000002 -0.24484285714285714 -0.25857142857142856 -0.32525714285714286 -0.11642857142857144 -0.0804 -0.2542857142857143 -0.12438571428571428 -0.3958571428571429 -0.12634285714285715H11.071471428571428l2.857142857142857 -5.714285714285714h-7.857142857142858Z"
                    strokeWidth="1"
                  ></path>
                </g>
              </svg>
            </React.Fragment>
          )}
        </div>
      </NavLink>
    </motion.div>
  );
};

/**
 * Halaman Dashboard utama NodeNova.
 * @returns {import("react").JSX.Element}
 */
const Dashboard = () => {
  const { user, userData, logout } = useAuth();
  const { completedPuzzles } = useGameProgress();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  // Konfigurasi Query Firestore: Mengambil koleksi "puzzles"
  const puzzlesRef = collection(db, "puzzles");
  const puzzlesQuery = query(puzzlesRef, orderBy("topic", "asc"));

  // Menggunakan hooks untuk fetching data secara real-time
  const [puzzles, loading, error] = useCollectionData(puzzlesQuery);

  const list = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: stagger(0.1),
      },
    },
  };

  const item = /** @type {import("motion").Variants} */ ({
    hidden: {
      opacity: 0,
      x: -4,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 220,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-8">
        {/* Greetings */}
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-2xl font-extrabold">
              Selamat datang di NodeNova, {userData?.name || "User"}!
            </h3>
          </div>
        </div>

        {/* Player stats */}
        <div className="items-center gap-4 shrink-0 hidden md:flex">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.6 -0.6 18 18"
              id="Diamond-2--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>Diamond 2 Streamline Icon: https://streamlinehq.com</desc>
              <g id="diamond-2--diamond-money-payment-finance-wealth-jewelry">
                <path
                  id="Vector"
                  stroke="#ff0077"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.766080000000002 1.8480480000000004H4.033944c-0.20131200000000002 0.005532000000000001 -0.398496 0.05838000000000001 -0.5756160000000001 0.15427200000000002 -0.17712000000000003 0.095892 -0.32918400000000003 0.23214000000000004 -0.44392800000000004 0.3977280000000001l-2.1830232000000005 3.0240000000000005c-0.16209960000000004 0.22916400000000003 -0.24305400000000005 0.505932 -0.23001600000000003 0.7863720000000001 0.013038000000000001 0.28045200000000003 0.11932200000000001 0.5484960000000001 0.3019836000000001 0.7616280000000001L7.452420000000001 14.520000000000001c0.112128 0.1446 0.255792 0.26160000000000005 0.42002400000000006 0.342 0.16423200000000004 0.08052000000000002 0.34468800000000005 0.12228000000000003 0.5275560000000001 0.12228000000000003 0.18286800000000003 0 0.36332400000000004 -0.041760000000000005 0.5275560000000001 -0.12228000000000003 0.16423200000000004 -0.08040000000000001 0.307896 -0.19740000000000005 0.42002400000000006 -0.342l6.549060000000002 -7.547952c0.18264000000000002 -0.21313200000000002 0.28896000000000005 -0.48117600000000005 0.30204000000000003 -0.7616280000000001 0.012960000000000003 -0.28044 -0.06792000000000001 -0.557208 -0.23004000000000005 -0.7863720000000001l-2.18304 -3.0240000000000005c-0.11472000000000002 -0.165588 -0.26676000000000005 -0.301836 -0.44388000000000005 -0.3977280000000001 -0.17712000000000003 -0.095892 -0.37440000000000007 -0.14874000000000004 -0.5756400000000002 -0.15427200000000002v0Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_2"
                  stroke="#ff0077"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m7.776048000000001 1.8360360000000002 -2.9280000000000004 4.5360000000000005 3.5520000000000005 8.579964"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_3"
                  stroke="#ff0077"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.06 1.8360360000000002 2.916000000000001 4.5360000000000005L8.400000000000002 14.952000000000004"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_4"
                  stroke="#ff0077"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M0.6240240000000001 6.372072000000001H16.176000000000002"
                  strokeWidth="1.2"
                ></path>
              </g>
            </svg>
            <span className="text-babypink-500 font-medium">
              {userData?.diamonds}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.6 -0.6 18 18"
              id="Flash-1--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>Flash 1 Streamline Icon: https://streamlinehq.com</desc>
              <g id="flash-1--flash-power-connect-charge-electricity-lightning">
                <path
                  id="Vector"
                  stroke="#0e89c8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.1000000000000005 0.6000000000000001 2.4000000000000004 6.972c-0.037344 0.09090000000000001 -0.05178000000000001 0.18957600000000005 -0.04206 0.287364 0.009720000000000001 0.09778800000000003 0.043308000000000006 0.19170000000000004 0.09782400000000001 0.27346800000000004 0.05450400000000001 0.08175600000000001 0.12826800000000002 0.14888400000000002 0.21480000000000002 0.19546800000000003 0.08652000000000001 0.04659600000000001 0.18316800000000003 0.07120800000000001 0.281436 0.07170000000000001h3.3480000000000008l-2.4000000000000004 8.400000000000002 10.308000000000002 -9.768000000000002c0.08568000000000002 -0.08251200000000002 0.14484000000000002 -0.188592 0.17004000000000002 -0.30480000000000007 0.025200000000000004 -0.11619600000000002 0.015360000000000004 -0.23727600000000001 -0.028440000000000003 -0.3478560000000001 -0.04368000000000001 -0.11058000000000001 -0.11928000000000002 -0.20566800000000002 -0.21708000000000005 -0.273216 -0.09792000000000002 -0.06753600000000001 -0.2136 -0.10448400000000001 -0.33252000000000004 -0.10612800000000003H9.3l2.4000000000000004 -4.800000000000001h-6.600000000000001Z"
                  strokeWidth="1.2"
                ></path>
              </g>
            </svg>
            <span className="text-icy-600 font-medium">
              {userData?.exp || 0}
            </span>
          </span>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center size-12.5. bg-mauve-purple-100 rounded-full cursor-pointer overflow-hidden border-3 border-transparent hover:border-mauve-purple-200 transition-all active:scale-95"
            >
              <img
                src={user.photoURL}
                alt="Avatar"
                className="rounded-full border4 border-icy-200 shadow-md object-cover size-10"
                referrerPolicy="no-referrer"
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-zinc-100 mb-1">
                    <p className="text-sm font-semibold text-zinc-800 truncate">
                      {userData?.name}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="w-full lg:w-3/5">
          {/* Progress */}
          <div className="w-full rounded-2xl border border-zinc-200 mb-6 overflow-hidden">
            <h5 className="text-xl font-semibold bg-zinc-50 px-6 py-5">
              Progresmu
            </h5>
            <div className="flex items-center px-4 pb-4 pt-8 md:pt-4 relative gap-3">
              <div className="flex items-center gap-2 absolute right-4 top-2">
                {!userData?.bonus_claimed ? (
                  <React.Fragment>
                    <p className="font-medium text-babypink-500">Bonus +3</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="-0.6 -0.6 18 18"
                      id="Diamond-2--Streamline-Core"
                      height="18"
                      width="18"
                    >
                      <desc>
                        Diamond 2 Streamline Icon: https://streamlinehq.com
                      </desc>
                      <g id="diamond-2--diamond-money-payment-finance-wealth-jewelry">
                        <path
                          id="Vector"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12.766080000000002 1.8480480000000004H4.033944c-0.20131200000000002 0.005532000000000001 -0.398496 0.05838000000000001 -0.5756160000000001 0.15427200000000002 -0.17712000000000003 0.095892 -0.32918400000000003 0.23214000000000004 -0.44392800000000004 0.3977280000000001l-2.1830232000000005 3.0240000000000005c-0.16209960000000004 0.22916400000000003 -0.24305400000000005 0.505932 -0.23001600000000003 0.7863720000000001 0.013038000000000001 0.28045200000000003 0.11932200000000001 0.5484960000000001 0.3019836000000001 0.7616280000000001L7.452420000000001 14.520000000000001c0.112128 0.1446 0.255792 0.26160000000000005 0.42002400000000006 0.342 0.16423200000000004 0.08052000000000002 0.34468800000000005 0.12228000000000003 0.5275560000000001 0.12228000000000003 0.18286800000000003 0 0.36332400000000004 -0.041760000000000005 0.5275560000000001 -0.12228000000000003 0.16423200000000004 -0.08040000000000001 0.307896 -0.19740000000000005 0.42002400000000006 -0.342l6.549060000000002 -7.547952c0.18264000000000002 -0.21313200000000002 0.28896000000000005 -0.48117600000000005 0.30204000000000003 -0.7616280000000001 0.012960000000000003 -0.28044 -0.06792000000000001 -0.557208 -0.23004000000000005 -0.7863720000000001l-2.18304 -3.0240000000000005c-0.11472000000000002 -0.165588 -0.26676000000000005 -0.301836 -0.44388000000000005 -0.3977280000000001 -0.17712000000000003 -0.095892 -0.37440000000000007 -0.14874000000000004 -0.5756400000000002 -0.15427200000000002v0Z"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_2"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m7.776048000000001 1.8360360000000002 -2.9280000000000004 4.5360000000000005 3.5520000000000005 8.579964"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_3"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.06 1.8360360000000002 2.916000000000001 4.5360000000000005L8.400000000000002 14.952000000000004"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_4"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M0.6240240000000001 6.372072000000001H16.176000000000002"
                          strokeWidth="1.2"
                        ></path>
                      </g>
                    </svg>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p className="font-medium text-babypink-500">
                      Telah diklaim
                    </p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="-0.6 -0.6 18 18"
                      id="Diamond-2--Streamline-Core"
                      height="18"
                      width="18"
                    >
                      <desc>
                        Diamond 2 Streamline Icon: https://streamlinehq.com
                      </desc>
                      <g id="diamond-2--diamond-money-payment-finance-wealth-jewelry">
                        <path
                          id="Vector"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12.766080000000002 1.8480480000000004H4.033944c-0.20131200000000002 0.005532000000000001 -0.398496 0.05838000000000001 -0.5756160000000001 0.15427200000000002 -0.17712000000000003 0.095892 -0.32918400000000003 0.23214000000000004 -0.44392800000000004 0.3977280000000001l-2.1830232000000005 3.0240000000000005c-0.16209960000000004 0.22916400000000003 -0.24305400000000005 0.505932 -0.23001600000000003 0.7863720000000001 0.013038000000000001 0.28045200000000003 0.11932200000000001 0.5484960000000001 0.3019836000000001 0.7616280000000001L7.452420000000001 14.520000000000001c0.112128 0.1446 0.255792 0.26160000000000005 0.42002400000000006 0.342 0.16423200000000004 0.08052000000000002 0.34468800000000005 0.12228000000000003 0.5275560000000001 0.12228000000000003 0.18286800000000003 0 0.36332400000000004 -0.041760000000000005 0.5275560000000001 -0.12228000000000003 0.16423200000000004 -0.08040000000000001 0.307896 -0.19740000000000005 0.42002400000000006 -0.342l6.549060000000002 -7.547952c0.18264000000000002 -0.21313200000000002 0.28896000000000005 -0.48117600000000005 0.30204000000000003 -0.7616280000000001 0.012960000000000003 -0.28044 -0.06792000000000001 -0.557208 -0.23004000000000005 -0.7863720000000001l-2.18304 -3.0240000000000005c-0.11472000000000002 -0.165588 -0.26676000000000005 -0.301836 -0.44388000000000005 -0.3977280000000001 -0.17712000000000003 -0.095892 -0.37440000000000007 -0.14874000000000004 -0.5756400000000002 -0.15427200000000002v0Z"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_2"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m7.776048000000001 1.8360360000000002 -2.9280000000000004 4.5360000000000005 3.5520000000000005 8.579964"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_3"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.06 1.8360360000000002 2.916000000000001 4.5360000000000005L8.400000000000002 14.952000000000004"
                          strokeWidth="1.2"
                        ></path>
                        <path
                          id="Vector_4"
                          stroke="#ff0077"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M0.6240240000000001 6.372072000000001H16.176000000000002"
                          strokeWidth="1.2"
                        ></path>
                      </g>
                    </svg>
                  </React.Fragment>
                )}
              </div>

              <div className="flex items-center justify-center rounded-lg p-2.5 bg-icy-100/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="-0.75 -0.75 18 18"
                  id="Task-List--Streamline-Core"
                  height="18"
                  width="18"
                >
                  <desc>
                    Task List Streamline Icon: https://streamlinehq.com
                  </desc>
                  <g id="task-list--task-list-work">
                    <path
                      id="Vector"
                      stroke="#0e8ac8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13.811442857142858 14.732142857142858c0 0.31255714285714287 -0.12422142857142857 0.6123857142857142 -0.34520357142857144 0.8333678571428571 -0.2211 0.22098214285714285 -0.5208107142857143 0.34520357142857144 -0.8333678571428571 0.34520357142857144H2.025669642857143c-0.3125807142857143 0 -0.6123503571428571 -0.12422142857142857 -0.8333796428571429 -0.34520357142857144 -0.22102103571428572 -0.22098214285714285 -0.3451917857142857 -0.5208107142857143 -0.3451917857142857 -0.8333678571428571v-12.964285714285715c0 -0.3125807142857143 0.12417075000000001 -0.6123503571428571 0.3451917857142857 -0.8333761071428573C1.4133192857142856 0.7134564642857143 1.7130889285714286 0.5892857142857143 2.025669642857143 0.5892857142857143h6.5832525c0.3125689285714286 0 0.6123503571428571 0.12417075000000001 0.8333678571428571 0.34519532142857146L13.466239285714286 4.958379642857143c0.22098214285714285 0.2210175 0.34520357142857144 0.5207989285714286 0.34520357142857144 0.8333678571428571V14.732142857142858Z"
                      stroke-width="1.5"
                    ></path>
                    <path
                      id="Vector_2"
                      stroke="#0e8ac8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m7.987579285714285 7.513392857142858 2.9464285714285716 0"
                      stroke-width="1.5"
                    ></path>
                    <path
                      id="Vector_3"
                      stroke="#0e8ac8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m7.987579285714285 11.6015625 2.9464285714285716 0"
                      stroke-width="1.5"
                    ></path>
                    <path
                      id="Vector_4"
                      stroke="#0e8ac8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m3.4298314285714286 11.534808214285714 0.9875132142857144 0.9875132142857144 1.6458514285714285 -2.3042014285714285"
                      stroke-width="1.5"
                    ></path>
                    <path
                      id="Vector_5"
                      stroke="#0e8ac8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m3.4298314285714286 7.372977857142858 0.9875132142857144 0.9875132142857144 1.6458514285714285 -2.3042014285714285"
                      stroke-width="1.5"
                    ></path>
                  </g>
                </svg>
              </div>

              <div className="w-full">
                <p className="font-semibold text-zinc-800">
                  {completedPuzzles?.length || 0} dari{" "}
                  {puzzles?.length || "..."} misi selesai
                </p>
                <div className="flex items-center gap-3">
                  {/* Progress bar */}
                  <span className="block bg-zinc-200/70 rounded-full w-full">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(completedPuzzles?.length / (puzzles?.length || 11)) * 100}%`,
                      }}
                      className="block bg-primary rounded-full h-2.5 relative"
                    ></motion.span>
                  </span>
                  <span className="text-zinc-800 font-semibold text-sm">
                    {Math.round(
                      ((completedPuzzles?.length || 0) /
                        (puzzles?.length || 11)) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <h3 className="font-semibold text-xl bg-zinc-50 px-6 py-5">Misi</h3>
            {/* Course Grid */}
            {loading ? (
              // Skeleton Loader
              <div className="animate-pulse *:not-last:border-b *:not-last:border-zinc-200">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex items-end gap-4 p-4">
                    <div className="size-16 bg-zinc-100 rounded-xl"></div>
                    <div className="grow flex flex-col">
                      <div className="max-w-40 h-6 bg-zinc-100 rounded-lg mb-2"></div>
                      <div className="max-w-100 h-4 bg-zinc-100 rounded-md"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 font-medium">
                Gagal memuat misi: {error.message}. Coba refresh halaman.
              </div>
            ) : (
              <motion.div
                variants={list}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 *:not-last:border-b *:not-last:border-zinc-200"
              >
                {puzzles?.map((p) => (
                  <CourseCard
                    key={p.id}
                    data={/** @type {CourseData} */ (p)}
                    item={item}
                    completedPuzzles={completedPuzzles}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
