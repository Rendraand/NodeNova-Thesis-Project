import { collection, query, orderBy, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import React from "react";
import { NavLink } from "react-router";

const Skeleton = () => {
  return (
    <div className="flex flex-col items-center pt-10">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col items-center w-full md:w-md lg:w-lg"
        >
          <div className="bg-zinc-100 w-full h-30 rounded-xl animate-pulse"></div>
          {i !== 3 && (
            <span className="border-s-2 border-dashed h-24 border-zinc-100"></span>
          )}
        </div>
      ))}
    </div>
  );
};

const Journey = () => {
  const { user } = useAuth();
  const completePuzzleRef = collection(db, "user_journey");
  const completedPuzzleQuery = query(
    completePuzzleRef,
    where("user_id", "==", user?.uid),
    orderBy("status", "desc"),
    orderBy("updated_at", "desc"),
  );

  const [completedPuzzles, loading, error] =
    useCollectionData(completedPuzzleQuery);

  return (
    <div>
      <h1 className="text-2xl font-bold">Jejak belajar</h1>
      {loading && <Skeleton />}
      {error && <p>Error: {error.message}</p>}
      {completedPuzzles?.length > 0 && (
        <ul className="flex flex-col items-center pt-10 pb-10">
          {completedPuzzles?.map((puzzle, i) => (
            <React.Fragment>
              <li
                key={puzzle.id}
                className="flex flex-col items-center w-full md:w-md lg:w-lg"
              >
                <div className="p-5 rounded-2xl border border-zinc-200 w-full border-dashed relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Topik: {puzzle.topic}</h3>
                    <p
                      className={`py-0.5 px-2.5 rounded-lg font-semibold shrink-0 ${
                        puzzle.status === "completed"
                          ? "bg-mint-500 text-white"
                          : "bg-zinc-300 text-white"
                      }`}
                    >
                      {puzzle.status === "completed"
                        ? "Selesai"
                        : "Dalam progres"}
                    </p>
                  </div>

                  <div>
                    {puzzle.status === "completed" ? (
                      <p className="font-medium">
                        Menyelesaikan misi{" "}
                        <NavLink
                          to={`/puzzles/${puzzle.puzzle_id}`}
                          className={"text-primary font-bold hover:underline"}
                        >
                          {puzzle.puzzle_id}
                        </NavLink>{" "}
                        {puzzle.ccbh_triggered === 0 ? (
                          <span className="font-medium">tanpa memicu hint</span>
                        ) : (
                          <span className="font-medium">
                            dengan memicu{" "}
                            <span className="font-bold">
                              {puzzle.ccbh_triggered}x
                            </span>{" "}
                            case-based hint
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="font-medium">
                        Telah memicu case-based hint sebanyak{" "}
                        <span className="font-bold">
                          {puzzle.ccbh_triggered}x
                        </span>{" "}
                        pada misi{" "}
                        <NavLink
                          to={`/puzzles/${puzzle.puzzle_id}`}
                          className={"text-primary font-bold hover:underline"}
                        >
                          {puzzle.puzzle_id}
                        </NavLink>
                      </p>
                    )}
                    <p className="text-zinc-500">
                      Diupdate pada{" "}
                      {new Date(puzzle.updated_at).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {puzzle.status === "completed" && (
                    <span className="block p-2 bg-mint-500 absolute top-0 left-1/2 -translate-1/2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="-1 -1 14 14"
                        id="Check--Streamline-Core"
                        height="14"
                        width="14"
                      >
                        <desc>
                          Check Streamline Icon: https://streamlinehq.com
                        </desc>
                        <g id="check--check-form-validation-checkmark-success-add-addition-tick">
                          <path
                            id="Vector"
                            stroke="#ffffff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M0.4285714285714286 7.328614285714287 2.7685714285714287 10.337142857142858c0.07896 0.10260000000000001 0.18013714285714288 0.186 0.29592857142857143 0.24394285714285718 0.11579142857142857 0.057857142857142864 0.24319714285714286 0.0888 0.37264285714285716 0.09034285714285714 0.12736285714285714 0.001542857142857143 0.2534571428571429 -0.02545714285714286 0.3691114285714286 -0.07877142857142858 0.11564571428571431 -0.0534 0.2179457142857143 -0.13191428571428573 0.29946000000000006 -0.22980000000000003L11.571428571428573 1.3286142857142857"
                            strokeWidth="2"
                          ></path>
                        </g>
                      </svg>
                    </span>
                  )}
                </div>
                {i !== completedPuzzles.length - 1 && (
                  <span className="border-s-2 border-dashed h-24 border-zinc-300"></span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
      {completedPuzzles?.length === 0 && (
        <div className="flex flex-col items-center gap-4 pt-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 56 56"
            id="Pet-Paw--Streamline-Core"
            height="48"
            width="48"
          >
            <desc>Pet Paw Streamline Icon: https://streamlinehq.com</desc>
            <g
              id="pet-paw--paw-foot-animals-pets-footprint-track-hotel"
              className="fill-zinc-300"
            >
              <path
                id="Union"
                fill="currentFill"
                fillRule="evenodd"
                d="M18 6c-1.98132 0 -3.53028 1.2046 -4.49252 2.64796C12.53592 10.10528 12 12.00336 12 14c0 1.99664 0.53592 3.89472 1.50748 5.35204C14.46972 20.7954 16.01868 22 18 22c1.98132 0 3.53028 -1.2046 4.49252 -2.64796C23.46408 17.89472 24 15.99664 24 14c0 -1.99664 -0.53592 -3.89472 -1.50748 -5.35204C21.53028 7.2046 19.98132 6 18 6Zm20 0c-1.98132 0 -3.53028 1.2046 -4.49252 2.64796C32.53592 10.10528 32 12.00336 32 14c0 1.99664 0.53592 3.89472 1.50748 5.35204C34.46972 20.7954 36.01868 22 38 22c1.98132 0 3.5304 -1.2046 4.4924 -2.64796C43.464 17.89472 44 15.99664 44 14c0 -1.99664 -0.536 -3.89472 -1.5076 -5.35204C41.5304 7.2046 39.98132 6 38 6ZM6 24c-1.98132 0 -3.530292 1.2046 -4.492528 2.64796C0.535916 28.10528 0 30.00336 0 32c0 1.99664 0.535916 3.89472 1.507472 5.35204C2.469708 38.7954 4.01868 40 6 40c1.98132 0 3.53028 -1.2046 4.49252 -2.64796C11.46408 35.89472 12 33.99664 12 32c0 -1.99664 -0.53592 -3.89472 -1.50748 -5.35204C9.53028 25.2046 7.98132 24 6 24ZM28 24c-4.8034 0 -8.35504 2.5748 -10.62944 5.77028C15.1276 32.92168 14 36.82768 14 40c0 3.6964 2.22112 6.266 4.9434 7.8096C21.62536 49.3308 24.98632 50 28 50s6.37464 -0.6692 9.0566 -2.1904C39.77888 46.266 42 43.6964 42 40c0 -3.17232 -1.1276 -7.07832 -3.37056 -10.22972C36.35504 26.5748 32.8034 24 28 24Zm22 0c-1.9812 0 -3.5304 1.2046 -4.4924 2.64796C44.536 28.10528 44 30.00336 44 32c0 1.99664 0.536 3.89472 1.5076 5.35204 0.962 1.44336 2.5112 2.64796 4.4924 2.64796 1.9812 0 3.5304 -1.2046 4.4924 -2.64796C55.464 35.89472 56 33.99664 56 32c0 -1.99664 -0.536 -3.89472 -1.5076 -5.35204C53.5304 25.2046 51.9812 24 50 24Z"
                clipRule="evenodd"
                strokeWidth="4"
              ></path>
            </g>
          </svg>
          <p className="text-center font-medium text-zinc-600">
            Jejakmu belum tercatat. Coba mulai mengerjakan{" "}
            <span className="font-semibold text-primary">misi!</span>
          </p>
        </div>
      )}

      {/* White fade gradient */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-linear-to-b from-transparent to-white"></div>
    </div>
  );
};

export default Journey;
