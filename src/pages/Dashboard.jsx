// @ts-check
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion, stagger, AnimatePresence } from "motion/react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  or,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useGameProgress } from "../context/GameProgressContext";
import { calculateExp } from "../constants/gameConfig";

/**
 * @typedef {Object} CourseData
 * @property {string} id - ID unik untuk setiap level/misi.
 * @property {string} topic - Topik utama (contoh: "Binary Tree", "Stack").
 * @property {"Basic" | "Intermediate" | "Advanced"} level - Tingkat kesulitan.
 * @property {"code-snippet" | "node-linker" | "binary-tree"} category - Kategori interaksi gameplay.
 * @property {string} description - Deskripsi singkat misi.
 * @property {string} [question] - Pertanyaan teknis di dalam game.
 */

const NodePuzzleIcon = ({ isCompleted }) => {
  return (
    <React.Fragment>
      {!isCompleted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          id="Module-Puzzle-1--Streamline-Core"
          height="24"
          width="24"
        >
          <desc>Module Puzzle 1 Streamline Icon: https://streamlinehq.com</desc>
          <g id="module-puzzle-1--code-puzzle-module-programming-plugin-piece">
            <path
              id="Union"
              fill="#ffffff"
              fill-rule="evenodd"
              d="M12.032845714285713 0.42857142857142855c-0.27586285714285713 0 -0.5486057142857143 0.058308 -0.8003657142857142 0.17110114285714284 -0.24282857142857142 0.10880057142857141 -0.4608514285714286 0.26592685714285713 -0.6407828571428571 0.4616845714285714L8.648965714285714 2.993468571428571c-0.20588571428571428 -0.4224171428571428 -0.4838914285714286 -0.8103257142857142 -0.82548 -1.144782857142857C7.03152 1.058604 5.958462857142856 0.6148199999999999 4.839651428571428 0.6148199999999999c-1.1204914285714285 0 -2.1951085714285714 0.4451142857142857 -2.9874171428571428 1.2374142857142858 -0.7923 0.7923085714285714 -1.2374142857142858 1.8669257142857143 -1.2374142857142858 2.9874171428571428 0 1.1188114285714286 0.44378399999999996 2.191868571428571 1.2338657142857143 2.9838342857142854 0.33034285714285716 0.3373885714285714 0.7128171428571428 0.6127371428571429 1.1291999999999998 0.8178514285714286L1.0653394285714286 10.522354285714286c-0.19761085714285714 0.18063428571428572 -0.35613085714285714 0.39996 -0.46566685714285716 0.6444342857142856C0.4868794285714286 11.418548571428571 0.42857142857142855 11.691291428571427 0.42857142857142855 11.967154285714285s0.058308 0.5486057142857143 0.17110114285714284 0.8003657142857142c0.10898057142857143 0.24323999999999996 0.2664497142857143 0.4615714285714285 0.4626634285714285 0.6416742857142856L3.5766342857142854 15.923502857142857c0.19613142857142857 0.19613142857142857 0.4750285714285714 0.2852228571428571 0.7485257142857142 0.23914285714285716 0.2735142857142857 -0.04609714285714286 0.5078057142857142 -0.2216742857142857 0.6288171428571429 -0.47124 0.12672 -0.2613257142857143 0.29441142857142855 -0.5006742857142856 0.4967314285714286 -0.7090114285714285 0.47328 -0.4749771428571428 1.1155714285714287 -0.7430399999999999 1.7861999999999998 -0.7453371428571428 0.672 -0.002297142857142857 1.3173942857142857 0.26244 1.7941885714285715 0.7359942857142856 0.47679428571428567 0.47353714285714277 0.7459542857142857 1.1171142857142855 0.7482685714285714 1.7890971428571425 0.00228 0.6695657142857142 -0.26058857142857145 1.3129371428571428 -0.7310228571428571 1.789165714285714 -0.20784 0.2014285714285714 -0.44646857142857144 0.3684 -0.7069028571428572 0.49474285714285715 -0.24685714285714283 0.11965714285714285 -0.4215085714285714 0.35022857142857144 -0.4697828571428571 0.6204 -0.048274285714285714 0.26999999999999996 0.03565714285714285 0.5468571428571428 0.22577142857142857 0.7446857142857143l2.4211199999999997 2.5193142857142856c0.1813542857142857 0.19954285714285713 0.4020514285714285 0.35948571428571424 0.6482399999999999 0.4698857142857143 0.25176 0.11279999999999998 0.5245028571428572 0.17108571428571429 0.8003657142857142 0.17108571428571429s0.5486057142857143 -0.05828571428571429 0.8003657142857142 -0.17108571428571429c0.24282857142857142 -0.10885714285714285 0.4608171428571428 -0.2658857142857142 0.6407657142857143 -0.4616571428571428l1.947582857142857 -1.9369714285714283c0.11144571428571427 0.22920000000000001 0.2438742857142857 0.4486285714285714 0.3962228571428571 0.6557142857142857 0.4822285714285714 0.6553714285714285 1.1434971428571428 1.1576571428571427 1.9043657142857144 1.4461714285714284 0.7607999999999999 0.2885142857142857 1.5886285714285713 0.3510857142857143 2.3842285714285714 0.18034285714285714 0.7956 -0.1707428571428571 1.5248571428571427 -0.5676 2.1001714285714286 -1.143085714285714 0.5754857142857143 -0.5753142857142857 0.9723428571428572 -1.3045714285714285 1.143085714285714 -2.1001714285714286 0.1707428571428571 -0.7956 0.10817142857142857 -1.6234285714285712 -0.18034285714285714 -2.3842285714285714 -0.2885142857142857 -0.7608685714285714 -0.7908 -1.4221371428571428 -1.4461714285714284 -1.9043657142857144 -0.20228571428571426 -0.14890285714285714 -0.41674285714285714 -0.27877714285714283 -0.6401142857142857 -0.38862857142857143l1.9174285714285715 -1.8858171428571429c0.19748571428571426 -0.18063428571428572 0.35605714285714285 -0.39996 0.4656 -0.6444342857142856 0.11279999999999998 -0.25176 0.17108571428571429 -0.5245028571428572 0.17108571428571429 -0.8003657142857142s-0.05828571428571429 -0.5486057142857143 -0.17108571428571429 -0.8003657142857142c-0.10937142857142856 -0.24419999999999997 -0.26777142857142855 -0.46328571428571425 -0.4650857142857142 -0.6438171428571429l-2.548628571428571 -2.5160571428571425c-0.19679999999999997 -0.19417714285714283 -0.4750285714285714 -0.2815885714285714 -0.7474285714285713 -0.2347885714285714 -0.27240000000000003 0.046817142857142856 -0.5053714285714286 0.22210285714285716 -0.6260571428571429 0.4707771428571428 -0.12342857142857142 0.25474285714285716 -0.2859428571428571 0.48862285714285714 -0.4815428571428571 0.6932228571428571 -0.47777142857142857 0.42565714285714285 -1.0997142857142856 0.6543085714285715 -1.7400685714285713 0.6391199999999999 -0.6489942857142857 -0.01541142857142857 -1.2671485714285713 -0.2800971428571429 -1.726182857142857 -0.7391314285714286 -0.45903428571428573 -0.45903428571428573 -0.7237199999999999 -1.0771885714285714 -0.7391314285714286 -1.7262 -0.015188571428571428 -0.6403714285714285 0.21346285714285715 -1.2622628571428571 0.6391199999999999 -1.7400857142857142 0.20459999999999998 -0.19553142857142855 0.43848 -0.35801142857142854 0.6932228571428571 -0.4815428571428571 0.24685714285714283 -0.11970857142857143 0.4214914285714286 -0.3503485714285714 0.4697828571428571 -0.6204171428571429 0.048274285714285714 -0.27008571428571426 -0.03565714285714285 -0.5469428571428571 -0.22577142857142857 -0.7447542857142857L13.48146857142857 1.0695342857142855c-0.18137142857142857 -0.19956342857142856 -0.4020514285714285 -0.3595508571428571 -0.6482571428571428 -0.46986171428571427C12.581451428571427 0.4868794285714286 12.308708571428571 0.42857142857142855 12.032845714285713 0.42857142857142855Z"
              clip-rule="evenodd"
              stroke-width="1.7143"
            ></path>
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          id="Check-Square--Streamline-Core"
          height="24"
          width="24"
        >
          <desc>Check Square Streamline Icon: https://streamlinehq.com</desc>
          <g id="check-square--check-form-validation-checkmark-success-add-addition-box-square-tick">
            <path
              id="Subtract"
              fill="#ffffff"
              fill-rule="evenodd"
              d="M6 0C2.686285714285714 0 0 2.686285714285714 0 6v12C0 21.313714285714283 2.686285714285714 24 6 24h12c3.3137142857142856 0 6 -2.686285714285714 6 -6v-12C24 2.686285714285714 21.313714285714283 0 18 0h-12Zm12.0048 8.946034285714285c0.44348571428571426 -0.5544857142857142 0.35365714285714284 -1.3635599999999999 -0.2009142857142857 -1.8071485714285713 -0.5544 -0.4435885714285714 -1.3635085714285713 -0.35369142857142855 -1.807097142857143 0.2007942857142857L9.91812 14.938011428571427 7.486474285714285 13.114285714285714c-0.5680628571428571 -0.4260514285714285 -1.3739485714285713 -0.31092 -1.8 0.2571428571428571 -0.4260342857142857 0.5680628571428571 -0.31092 1.3739485714285713 0.2571428571428571 1.8l3.4285714285714284 2.571428571428571c0.5555657142857142 0.41674285714285714 1.3416 0.31679999999999997 1.7754171428571428 -0.22542857142857142l6.857194285714285 -8.571394285714286Z"
              clip-rule="evenodd"
              stroke-width="1.7143"
            ></path>
          </g>
        </svg>
      )}
    </React.Fragment>
  );
};

/**
 * @param {Object} props
 * @param {string[]} props.completedPuzzles
 * @param {string|null} props.levelInfoId
 * @param {Function} props.setLevelInfoId
 */
const LinkedListMap = ({ completedPuzzles, levelInfoId, setLevelInfoId }) => {
  const puzzlesRef = collection(db, "puzzles");
  const puzzlesQuery = query(
    puzzlesRef,
    where("topic", "==", "Singly Linked List"),
    orderBy("level", "asc"),
  );
  const [puzzles, loading, error] = useCollectionData(puzzlesQuery);

  return (
    <React.Fragment>
      {/* Topic Header */}
      <div className="flex flex-col bg-primary text-white px-4 py-5 mb-6 rounded-xl">
        <h3 className="text-xl font-bold">Linked List</h3>
        <p className="text font-medium">
          Pelajari struktur node dan alur pemindahan pointer
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 mb-12">
        {puzzles?.map((data, index) => (
          <div
            className={`relative ${(index + 1) % 4 === 2 ? "ms-10" : ""} ${(index + 1) % 4 === 0 ? "me-10" : ""}`}
          >
            {data.prerequisite_id === "" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLevelInfoId(data.id);
                }}
                className="flex items-center px-5 py-4 bg-icy-300 rounded-xl shadow-[0_6px_0_0_#0E8AC8] active:shadow-[0_2px_0_0_#0E8AC8] active:translate-y-1"
              >
                <NodePuzzleIcon
                  isCompleted={completedPuzzles.includes(data.id)}
                />
              </button>
            ) : (
              <React.Fragment>
                {completedPuzzles.includes(data.prerequisite_id) ? (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-icy-300 rounded-xl shadow-[0_6px_0_0_#0E8AC8] active:shadow-[0_2px_0_0_#0E8AC8] active:translate-y-1"
                  >
                    <NodePuzzleIcon
                      isCompleted={completedPuzzles.includes(data.id)}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-zinc-200 rounded-xl shadow-[0_6px_0_0_#A1A1AA]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      id="Padlock-Square-1--Streamline-Core"
                      height="24"
                      width="24"
                    >
                      <desc>
                        Padlock Square 1 Streamline Icon:
                        https://streamlinehq.com
                      </desc>
                      <g id="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
                        <path
                          id="Subtract"
                          fill="#a1a1aa"
                          fill-rule="evenodd"
                          d="M12 3.4285714285714284a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 3.4285714285714284v1.7142857142857142h6.857142857142857V6.857142857142857a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 -3.4285714285714284ZM5.142857142857142 6.857142857142857v1.7142857142857142a2.571428571428571 2.571428571428571 0 0 0 -2.571428571428571 2.571428571428571v10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 5.142857142857142 24h13.714285714285714a2.571428571428571 2.571428571428571 0 0 0 2.571428571428571 -2.571428571428571v-10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 18.857142857142858 8.571428571428571V6.857142857142857a6.857142857142857 6.857142857142857 0 1 0 -13.714285714285714 0Zm6.857142857142857 11.571428571428571a2.142857142857143 2.142857142857143 0 1 0 0 -4.285714285714286 2.142857142857143 2.142857142857143 0 0 0 0 4.285714285714286Z"
                          clip-rule="evenodd"
                          stroke-width="1.7143"
                        ></path>
                      </g>
                    </svg>
                  </button>
                )}
              </React.Fragment>
            )}

            {/* Modal Level Info */}
            {levelInfoId === data.id && (
              <div
                id={`card-${data.id}`}
                className="absolute top-8 left-24 p-4 border-2 border-zinc-200 rounded-xl bg-white w-xs z-10"
              >
                {data.prerequisite_id === "" ? (
                  <React.Fragment>
                    <h3 className="font-semibold text-lg">
                      Level {data.level} - {data.topic}
                    </h3>
                    <p className="text-primary font-semibold">
                      {data.variation}
                    </p>
                    <p className="text-zinc-500 t font-medium mb-3">
                      {data.description}
                    </p>
                    <NavLink
                      to={`/linked-list/puzzles/${data.id}`}
                      className="flex items-center px-6 py-2 bg-primary text-white font-bold w-full justify-center shadow-[0_4px_0_0_#0E8AC8] rounded-xl hover:bg-icy-400 cursor-pointer"
                    >
                      {completedPuzzles.includes(data.id)
                        ? "Mainkan lagi"
                        : `Mulai + ${calculateExp(data.level)} EXP`}
                    </NavLink>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!completedPuzzles.includes(data.prerequisite_id) ? (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg text-zinc-600 mb-2">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-zinc-400 font-medium mb-3">
                          Selesaikan misi sebelumnya untuk membuka
                        </p>
                        <div className="flex items-center px-6 py-2 bg-zinc-200 text-zinc-400 font-bold w-full justify-center rounded-xl cursor-default">
                          Terkunci
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-primary font-semibold">
                          {data.variation}
                        </p>
                        <p className="text-zinc-500 t font-medium mb-3">
                          {data.description}
                        </p>
                        <NavLink
                          to={`/linked-list/puzzles/${data.id}`}
                          className="flex items-center px-6 py-2 bg-primary text-white font-bold w-full justify-center shadow-[0_4px_0_0_#0E8AC8] rounded-xl hover:bg-icy-400 cursor-pointer"
                        >
                          {completedPuzzles.includes(data.id)
                            ? "Mainkan lagi"
                            : `Mulai + ${calculateExp(data.level)} EXP`}
                        </NavLink>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

/**
 * @param {Object} props
 * @param {string[]} props.completedPuzzles
 * @param {string} props.levelInfoId
 * @param {Function} props.setLevelInfoId
 */
const StackAndQueueMap = ({
  completedPuzzles,
  levelInfoId,
  setLevelInfoId,
}) => {
  const puzzlesRef = collection(db, "puzzles");
  const puzzlesQuery = query(
    puzzlesRef,
    or(where("topic", "==", "Stack"), where("topic", "==", "Queue")),
    orderBy("level", "asc"),
  );
  const [puzzles, loading, error] = useCollectionData(puzzlesQuery);
  return (
    <React.Fragment>
      {/* Topic Header */}
      <div className="flex flex-col bg-mauve-purple-500/90 text-white px-4 py-5 mb-6 rounded-xl">
        <h3 className="text-xl font-bold">Stack & Queue</h3>
        <p className="text font-medium text-mauve-purple-100">
          Pahami konsep struktur dan operasi pada Stack & Queue
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 mb-12">
        {puzzles?.map((data, index) => (
          <div
            className={`relative ${(index + 1) % 4 === 2 ? "ms-10" : ""} ${(index + 1) % 4 === 0 ? "me-10" : ""}`}
          >
            {data.prerequisite_id === "" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLevelInfoId(data.id);
                }}
                className="flex items-center px-5 py-4 bg-mauve-purple-300 rounded-xl shadow-[0_6px_0_0_#A937EB] active:shadow-[0_2px_0_0_#A937EB] active:translate-y-1"
              >
                <NodePuzzleIcon
                  isCompleted={completedPuzzles.includes(data.id)}
                />
              </button>
            ) : (
              <React.Fragment>
                {completedPuzzles.includes(data.prerequisite_id) ? (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-mauve-purple-300 rounded-xl shadow-[0_6px_0_0_#A937EB] active:shadow-[0_2px_0_0_#A937EB] active:translate-y-1"
                  >
                    <NodePuzzleIcon
                      isCompleted={completedPuzzles.includes(data.id)}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-zinc-200 rounded-xl shadow-[0_6px_0_0_#A1A1AA]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      id="Padlock-Square-1--Streamline-Core"
                      height="24"
                      width="24"
                    >
                      <desc>
                        Padlock Square 1 Streamline Icon:
                        https://streamlinehq.com
                      </desc>
                      <g id="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
                        <path
                          id="Subtract"
                          fill="#a1a1aa"
                          fill-rule="evenodd"
                          d="M12 3.4285714285714284a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 3.4285714285714284v1.7142857142857142h6.857142857142857V6.857142857142857a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 -3.4285714285714284ZM5.142857142857142 6.857142857142857v1.7142857142857142a2.571428571428571 2.571428571428571 0 0 0 -2.571428571428571 2.571428571428571v10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 5.142857142857142 24h13.714285714285714a2.571428571428571 2.571428571428571 0 0 0 2.571428571428571 -2.571428571428571v-10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 18.857142857142858 8.571428571428571V6.857142857142857a6.857142857142857 6.857142857142857 0 1 0 -13.714285714285714 0Zm6.857142857142857 11.571428571428571a2.142857142857143 2.142857142857143 0 1 0 0 -4.285714285714286 2.142857142857143 2.142857142857143 0 0 0 0 4.285714285714286Z"
                          clip-rule="evenodd"
                          stroke-width="1.7143"
                        ></path>
                      </g>
                    </svg>
                  </button>
                )}
              </React.Fragment>
            )}

            {/* Modal Level Info */}
            {levelInfoId === data.id && (
              <div
                id={`card-${data.id}`}
                className="absolute top-8 left-24 p-4 border-2 border-zinc-200 rounded-xl bg-white w-xs z-10"
              >
                {data.prerequisite_id === "" ? (
                  <React.Fragment>
                    <h3 className="font-semibold text-lg">
                      Level {data.level} - {data.topic}
                    </h3>
                    <p className="text-mauve-purple-500 font-semibold">
                      {data.variation}
                    </p>
                    <p className="text-zinc-500 t font-medium mb-3">
                      {data.description}
                    </p>
                    <NavLink
                      to={`/stack-and-queue/puzzles/${data.id}`}
                      className="flex items-center px-6 py-2 bg-mauve-purple-400 text-white font-bold w-full justify-center shadow-[0_4px_0_0_#9216DA] rounded-lg hover:bg-mauve-purple-400/90 cursor-pointer active:shadow-none active:translate-y-1"
                    >
                      {completedPuzzles.includes(data.id)
                        ? "Mainkan lagi"
                        : `Mulai + ${calculateExp(data.level)} EXP`}
                    </NavLink>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!completedPuzzles.includes(data.prerequisite_id) ? (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg text-zinc-600 mb-2">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-zinc-400 font-medium mb-3">
                          Selesaikan misi sebelumnya untuk membuka
                        </p>
                        <div className="flex items-center px-6 py-2 bg-zinc-200 text-zinc-400 font-bold w-full justify-center rounded-xl cursor-default">
                          Terkunci
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-mauve-purple-500 font-semibold">
                          {data.variation}
                        </p>
                        <p className="text-zinc-500 t font-medium mb-3">
                          {data.description}
                        </p>
                        <NavLink
                          to={`/stack-and-queue/puzzles/${data.id}`}
                          className="flex items-center px-6 py-2 bg-mauve-purple-400 text-white font-bold w-full justify-center shadow-[0_4px_0_0_#9216DA] rounded-xl hover:bg-mauve-purple-400/90 cursor-pointer"
                        >
                          {completedPuzzles.includes(data.id)
                            ? "Mainkan Lagi"
                            : `Mulai + ${calculateExp(data.level)} EXP`}
                        </NavLink>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

/**
 * @param {Object} props
 * @param {string[]} props.completedPuzzles - Array of completed puzzle IDs.
 * @param {string | null} props.levelInfoId - ID of the currently selected level.
 * @param {Function} props.setLevelInfoId - Function to set the selected level ID.
 */
const BinaryTreeMap = ({ completedPuzzles, levelInfoId, setLevelInfoId }) => {
  const puzzlesRef = collection(db, "puzzles");
  const puzzlesQuery = query(
    puzzlesRef,
    where("topic", "==", "Binary Search Tree"),
    orderBy("level", "asc"),
  );
  const [puzzles, loading, error] = useCollectionData(puzzlesQuery);
  return (
    <React.Fragment>
      {/* Topic Header */}
      <div className="flex flex-col bg-mint-500 text-white px-4 py-5 mb-6 rounded-xl">
        <h3 className="text-xl font-bold">Binary Search Tree</h3>
        <p className="text font-medium text-white">
          Pahami konsep struktur dan hierarki komponen pohon biner
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 mb-12">
        {puzzles?.map((data, index) => (
          <div
            className={`relative ${(index + 1) % 4 === 2 ? "ms-10" : ""} ${(index + 1) % 4 === 0 ? "me-10" : ""}`}
          >
            {data.prerequisite_id === "" ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLevelInfoId(data.id);
                }}
                className="flex items-center px-5 py-4 bg-mint-400 rounded-xl shadow-[0_6px_0_0_#26A155] active:shadow-[0_2px_0_0_#26A155] active:translate-y-1"
              >
                <NodePuzzleIcon
                  isCompleted={completedPuzzles.includes(data.id)}
                />
              </button>
            ) : (
              <React.Fragment>
                {completedPuzzles.includes(data.prerequisite_id) ? (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-mint-400 rounded-xl shadow-[0_6px_0_0_#26A155] active:shadow-[0_2px_0_0_#26A155] active:translate-y-1"
                  >
                    <NodePuzzleIcon
                      isCompleted={completedPuzzles.includes(data.id)}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLevelInfoId(data.id);
                    }}
                    className="flex items-center px-5 py-4 bg-zinc-200 rounded-xl shadow-[0_6px_0_0_#A1A1AA]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      id="Padlock-Square-1--Streamline-Core"
                      height="24"
                      width="24"
                    >
                      <desc>
                        Padlock Square 1 Streamline Icon:
                        https://streamlinehq.com
                      </desc>
                      <g id="padlock-square-1--combination-combo-lock-locked-padlock-secure-security-shield-keyhole">
                        <path
                          id="Subtract"
                          fill="#a1a1aa"
                          fill-rule="evenodd"
                          d="M12 3.4285714285714284a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 3.4285714285714284v1.7142857142857142h6.857142857142857V6.857142857142857a3.4285714285714284 3.4285714285714284 0 0 0 -3.4285714285714284 -3.4285714285714284ZM5.142857142857142 6.857142857142857v1.7142857142857142a2.571428571428571 2.571428571428571 0 0 0 -2.571428571428571 2.571428571428571v10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 5.142857142857142 24h13.714285714285714a2.571428571428571 2.571428571428571 0 0 0 2.571428571428571 -2.571428571428571v-10.285714285714285A2.571428571428571 2.571428571428571 0 0 0 18.857142857142858 8.571428571428571V6.857142857142857a6.857142857142857 6.857142857142857 0 1 0 -13.714285714285714 0Zm6.857142857142857 11.571428571428571a2.142857142857143 2.142857142857143 0 1 0 0 -4.285714285714286 2.142857142857143 2.142857142857143 0 0 0 0 4.285714285714286Z"
                          clip-rule="evenodd"
                          stroke-width="1.7143"
                        ></path>
                      </g>
                    </svg>
                  </button>
                )}
              </React.Fragment>
            )}

            {/* Modal Level Info */}
            {levelInfoId === data.id && (
              <div
                id={`card-${data.id}`}
                className="absolute top-8 left-24 p-4 border-2 border-zinc-200 rounded-xl bg-white w-xs z-10"
              >
                {data.prerequisite_id === "" ? (
                  <React.Fragment>
                    <h3 className="font-semibold text-lg">
                      Level {data.level} - {data.topic}
                    </h3>
                    <p className="text-mint-600 font-semibold">
                      {data.sub_category}
                    </p>
                    <p className="text-zinc-500 t font-medium mb-3">
                      {data.description}
                    </p>
                    <NavLink
                      to={`/binary-tree/puzzles/${data.id}`}
                      className="flex items-center px-6 py-2 bg-mint-500 text-white font-bold w-full justify-center shadow-[0_4px_0_0_#1C783F] rounded-lg hover:bg-mint-500/90 cursor-pointer active:shadow-none active:translate-y-1"
                    >
                      {completedPuzzles.includes(data.id)
                        ? "Mainkan lagi"
                        : `Mulai + ${calculateExp(data.level)} EXP`}
                    </NavLink>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {!completedPuzzles.includes(data.prerequisite_id) ? (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg text-zinc-600 mb-2">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-zinc-400 font-medium mb-3">
                          Selesaikan misi sebelumnya untuk membuka
                        </p>
                        <div className="flex items-center px-6 py-2 bg-zinc-200 text-zinc-400 font-bold w-full justify-center rounded-xl cursor-default">
                          Terkunci
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <h3 className="font-semibold text-lg">
                          Level {data.level} - {data.topic}
                        </h3>
                        <p className="text-mint-600 font-semibold">
                          {data.sub_category}
                        </p>
                        <p className="text-zinc-500 font-medium mb-3">
                          {data.description}
                        </p>
                        <NavLink
                          to={`/linked-list/puzzles/${data.id}`}
                          className="flex items-center px-6 py-2 bg-mint-500 text-white font-bold w-full justify-center shadow-[0_4px_0_0_#1C783F] rounded-lg hover:bg-mint-500/90 cursor-pointer active:shadow-none active:translate-y-1"
                        >
                          {completedPuzzles.includes(data.id)
                            ? "Mainkan lagi"
                            : `Mulai + ${calculateExp(data.level)} EXP`}
                        </NavLink>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

const AVATAR_COLORS = [
  "bg-rose-400",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-blue-600",
  "bg-amber-600",
  "bg-violet-600",
  "bg-pink-500",
  "bg-cyan-600",
  "bg-orange-500",
];

const getAvatarColorClass = (userId) => {
  if (!userId) return "bg-zinc-500";
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 4) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }
  return (parts[0][0] + (parts[1][0] || "")).toUpperCase();
};

const renderRankBadge = (rank) => {
  if (rank === 1) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#fde047] flex items-center justify-center text-zinc-900 font-bold text-sm select-none shadow-xs">
        1
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#e4e4e7] flex items-center justify-center text-zinc-800 font-bold text-sm select-none shadow-xs">
        2
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#ffedd5] flex items-center justify-center text-orange-950 font-bold text-sm select-none shadow-xs">
        3
      </div>
    );
  }
  return (
    <span className="text-zinc-400 font-semibold text-sm select-none">
      {rank}
    </span>
  );
};

/**
 * Halaman Dashboard utama NodeNova.
 * @returns {import("react").JSX.Element}
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();
  const { completedPuzzles } = useGameProgress();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [levelInfoId, setLevelInfoId] = useState("");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("exp", "desc"), limit(3));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLeaderboard(users);
        setLeaderboardLoading(false);
      },
      (error) => {
        console.error("Error fetching leaderboard data:", error);
        setLeaderboardLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (levelInfoId && !e.target.closest(`#card-${levelInfoId}`)) {
        setLevelInfoId("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("scroll", () => setLevelInfoId(""));
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("scroll", () => setLevelInfoId(""));
    };
  }, [levelInfoId]);

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
    <div className="flex items-start gap-8">
      <div className="w-lg pb-16">
        <LinkedListMap
          completedPuzzles={completedPuzzles}
          levelInfoId={levelInfoId}
          setLevelInfoId={setLevelInfoId}
        />
        <StackAndQueueMap
          completedPuzzles={completedPuzzles}
          levelInfoId={levelInfoId}
          setLevelInfoId={setLevelInfoId}
        />
        <BinaryTreeMap
          completedPuzzles={completedPuzzles}
          levelInfoId={levelInfoId}
          setLevelInfoId={setLevelInfoId}
        />
      </div>

      <div className="flex mb-4 gap-4 grow flex-col sticky top-0">
        {/* Player stats */}
        <div className="items-center gap-4 hidden md:flex justify-end grow">
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
              id="Flash-1--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>Flash 1 Streamline Icon: https://streamlinehq.com</desc>
              <g id="flash-1--flash-power-connect-charge-electricity-lightning">
                <path
                  id="Union"
                  fill="#1aa8ef"
                  fill-rule="evenodd"
                  d="M5.4928928571428575 0c-0.25812 0 -0.4912071428571429 0.1543834285714286 -0.5919171428571429 0.39204642857142863l-2.8928571428571432 6.827149285714286 -0.00002571428571428572 -0.00002571428571428572 -0.002687142857142857 0.006531428571428573c-0.08002285714285715 0.19478571428571428 -0.11098285714285715 0.40624714285714286 -0.09014142857142858 0.6157928571428571 0.02082857142857143 0.2095457142857143 0.09281571428571429 0.41077285714285716 0.20962285714285714 0.58599 0.11680714285714286 0.17520428571428573 0.2748728571428572 0.31905000000000006 0.4602857142857143 0.4188728571428572 0.18541285714285716 0.09983571428571429 0.3925157142857143 0.15258857142857143 0.60309 0.15363000000000002l0 0.00001285714285714286h2.7380957142857145l-2.3373000000000004 8.180485714285714c-0.07959857142857144 0.27861428571428576 0.03699 0.5760000000000001 0.2846957142857143 0.7263 0.24769285714285716 0.15030000000000002 0.5653157142857144 0.11622857142857143 0.7756071428571428 -0.08305714285714287l11.044324285714287 -10.465675714285714 0 0.00001285714285714286 0.0038571428571428576 -0.003715714285714286c0.18347142857142856 -0.17679857142857144 0.31024285714285715 -0.40413857142857146 0.36437142857142857 -0.6531428571428572 0.054000000000000006 -0.24900428571428573 0.032785714285714286 -0.5084485714285715 -0.060814285714285723 -0.7454057142857144 -0.09372857142857144 -0.23694428571428575 -0.2557285714285714 -0.44073 -0.46542857142857147 -0.5854628571428572s-0.45771428571428574 -0.2238814285714286 -0.7124142857142858 -0.22741714285714287l0 -0.00006428571428571429H11.033061428571429L13.139357142857143 0.9303518571428572c0.09964285714285714 -0.199278 0.08897142857142858 -0.4359394285714286 -0.02815714285714286 -0.6254652857142857C12.99407142857143 0.11536225714285715 12.787122857142858 0 12.564321428571429 0h-7.071428571428572Z"
                  clip-rule="evenodd"
                  stroke-width="1.2857"
                ></path>
              </g>
            </svg>
            <span className="text-zinc-500 font-medium">
              {userData?.exp} exp
            </span>
          </span>

          {/* Profile Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center size-14 rounded-full cursor-pointer overflow-hidden border-3 border-transparent hover:border-mauve-purple-200 transition-all active:scale-95"
            >
              <img
                src={user?.photoURL}
                alt="Avatar"
                className="rounded-full border-icy-200 shadow-md object-cover size-12"
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

        {/* Top Rank Lists */}
        <div className="bg-white border-2 border-zinc-200 rounded-3xl overflow-hidden flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
              id="Trophy--Streamline-Core"
              height="32"
              width="32"
            >
              <desc>Trophy Streamline Icon: https://streamlinehq.com</desc>
              <g id="trophy--reward-rating-trophy-social-award-media">
                <path
                  id="Union"
                  fill="#a1a1aa"
                  fill-rule="evenodd"
                  d="M0 1.7140754285714286c0 -0.9467725714285714 0.767510857142857 -1.7142846918857142 1.7142857142857142 -1.7142846918857142h6.593417142857143c0.042879999999999995 0 0.08541714285714286 0.001575496457142857 0.12752 0.0046717775999999996h15.133462857142856c0.04091428571428571 -0.0029660937142857143 0.08228571428571428 -0.004464149257142857 0.12365714285714285 -0.004464149257142857H30.285714285714285c0.9467428571428571 0 1.7142857142857142 0.7675124921142856 1.7142857142857142 1.714285063542857V8.308548571428572c0 4.249737142857143 -3.1908571428571424 7.754194285714285 -7.307657142857142 8.248114285714285 -1.0226285714285714 3.1296 -3.6884342857142856 5.516 -6.978057142857143 6.140022857142856V28.57142857142857h5.978057142857143c0.9467428571428571 0 1.7142857142857142 0.7675428571428571 1.7142857142857142 1.7142857142857142s-0.7675428571428571 1.7142857142857142 -1.7142857142857142 1.7142857142857142H16.060022857142854c-0.019931428571428572 0.0006857142857142856 -0.03993142857142857 0.0011428571428571427 -0.060022857142857135 0.0011428571428571427s-0.04009142857142857 -0.00045714285714285713 -0.060022857142857135 -0.0011428571428571427H8.30768c-0.9467657142857143 0 -1.7142857142857142 -0.7675428571428571 -1.7142857142857142 -1.7142857142857142s0.7675199999999999 -1.7142857142857142 1.7142857142857142 -1.7142857142857142H14.285714285714285V22.696685714285714c-3.289622857142857 -0.6240228571428571 -5.955405714285714 -3.010445714285714 -6.978125714285714 -6.140022857142856C3.1909485714285712 16.062742857142855 0 12.558285714285713 0 8.308548571428572V1.7140754285714286ZM6.593417142857143 12.878011428571428V3.4283657142857145H3.4285714285714284v4.880182857142857c0 2.091405714285714 1.3158628571428572 3.875474285714285 3.164845714285714 4.569462857142857ZM25.40662857142857 3.4285714285714284v9.44944C27.255542857142856 12.184022857142857 28.57142857142857 10.399954285714285 28.57142857142857 8.308548571428572V3.4285714285714284h-3.1648Z"
                  clip-rule="evenodd"
                  stroke-width="2.2857"
                ></path>
              </g>
            </svg>
            <h3 className="text-xl font-semibold">Peringkat teratas</h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <svg
                className="animate-spin h-8 w-8 text-sky-500"
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
              <span className="text-zinc-400 font-medium text-sm">
                Memuat data peringkat...
              </span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-16 text-zinc-400 font-medium text-sm">
              Belum ada data peringkat.
            </div>
          ) : (
            leaderboard.map((userDoc, index) => {
              const rank = index + 1;
              const isCurrentUser = userDoc.id === user?.uid;
              const photoURL =
                userDoc.photoURL || (isCurrentUser ? user?.photoURL : null);

              return (
                <div
                  key={userDoc.id}
                  className={`flex items-center justify-between px-6 py-4.5 transition-colors duration-200 ${
                    isCurrentUser ? "bg-icy-100/50" : "hover:bg-zinc-50/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Medal / Rank badge */}
                    <div className="w-8 flex justify-center items-center shrink-0">
                      {renderRankBadge(rank)}
                    </div>

                    {/* User Avatar */}
                    <div className="relative shrink-0 select-none">
                      {photoURL ? (
                        <img
                          src={photoURL}
                          alt={userDoc.name}
                          className="size-13.5 rounded-full object-cover border border-zinc-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className={`size-13.5 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColorClass(
                            userDoc.id,
                          )}`}
                        >
                          {getInitials(userDoc.name)}
                        </div>
                      )}
                    </div>

                    {/* User Name */}
                    <span
                      className={`text-sm font-semibold truncate max-w-40 sm:max-w-70 ${
                        isCurrentUser
                          ? "text-zinc-900 font-bold"
                          : "text-zinc-700"
                      }`}
                    >
                      {userDoc.name}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-2 font-bold shrink-0 select-none">
                    {/* Lightning bolt icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 18 18"
                      id="Flash-1--Streamline-Core"
                      height="18"
                      width="18"
                    >
                      <desc>
                        Flash 1 Streamline Icon: https://streamlinehq.com
                      </desc>
                      <g id="flash-1--flash-power-connect-charge-electricity-lightning">
                        <path
                          id="Union"
                          fill="#1aa8ef"
                          fill-rule="evenodd"
                          d="M5.4928928571428575 0c-0.25812 0 -0.4912071428571429 0.1543834285714286 -0.5919171428571429 0.39204642857142863l-2.8928571428571432 6.827149285714286 -0.00002571428571428572 -0.00002571428571428572 -0.002687142857142857 0.006531428571428573c-0.08002285714285715 0.19478571428571428 -0.11098285714285715 0.40624714285714286 -0.09014142857142858 0.6157928571428571 0.02082857142857143 0.2095457142857143 0.09281571428571429 0.41077285714285716 0.20962285714285714 0.58599 0.11680714285714286 0.17520428571428573 0.2748728571428572 0.31905000000000006 0.4602857142857143 0.4188728571428572 0.18541285714285716 0.09983571428571429 0.3925157142857143 0.15258857142857143 0.60309 0.15363000000000002l0 0.00001285714285714286h2.7380957142857145l-2.3373000000000004 8.180485714285714c-0.07959857142857144 0.27861428571428576 0.03699 0.5760000000000001 0.2846957142857143 0.7263 0.24769285714285716 0.15030000000000002 0.5653157142857144 0.11622857142857143 0.7756071428571428 -0.08305714285714287l11.044324285714287 -10.465675714285714 0 0.00001285714285714286 0.0038571428571428576 -0.003715714285714286c0.18347142857142856 -0.17679857142857144 0.31024285714285715 -0.40413857142857146 0.36437142857142857 -0.6531428571428572 0.054000000000000006 -0.24900428571428573 0.032785714285714286 -0.5084485714285715 -0.060814285714285723 -0.7454057142857144 -0.09372857142857144 -0.23694428571428575 -0.2557285714285714 -0.44073 -0.46542857142857147 -0.5854628571428572s-0.45771428571428574 -0.2238814285714286 -0.7124142857142858 -0.22741714285714287l0 -0.00006428571428571429H11.033061428571429L13.139357142857143 0.9303518571428572c0.09964285714285714 -0.199278 0.08897142857142858 -0.4359394285714286 -0.02815714285714286 -0.6254652857142857C12.99407142857143 0.11536225714285715 12.787122857142858 0 12.564321428571429 0h-7.071428571428572Z"
                          clip-rule="evenodd"
                          stroke-width="1.2857"
                        ></path>
                      </g>
                    </svg>
                    <span className="text-zinc-500 text-sm font-semibold">
                      {userDoc.exp || 0} exp
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
