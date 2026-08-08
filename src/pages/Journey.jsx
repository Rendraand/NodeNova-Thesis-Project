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
  const { user, userData } = useAuth();
  const completePuzzleRef = collection(db, "user_journey");
  const completedPuzzleQuery = query(
    completePuzzleRef,
    where("user_id", "==", user?.uid),
    // orderBy("status", "desc"),
    where("status", "==", "completed"),
    orderBy("updated_at", "desc"),
  );

  const [completedPuzzles, loading, error] =
    useCollectionData(completedPuzzleQuery);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Jejak & progres belajar</h1>

      {/* Progress Panel */}
      <div className="border-2 border-zinc-200 p-6 rounded-xl">
        <div className="flex items-center gap-5 mb-6">
          <div className="p-5 rounded-xl bg-icy-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 32 32"
              id="Calendar-Star--Streamline-Core"
              height="32"
              width="32"
            >
              <desc>
                Calendar Star Streamline Icon: https://streamlinehq.com
              </desc>
              <g id="calendar-star--calendar-date-day-favorite-like-month-star">
                <path
                  id="Subtract"
                  fill="#ffffff"
                  fill-rule="evenodd"
                  d="M10.285714285714285 2.2857142857142856c0 -1.2623657142857143 -1.02336 -2.2857142857142856 -2.2857142857142856 -2.2857142857142856s-2.2857142857142856 1.0233485714285713 -2.2857142857142856 2.2857142857142856v2.2857142857142856h-2.2857142857142856C1.535024 4.571428571428571 0 6.106445714285714 0 8v20.57142857142857c0 1.8934857142857142 1.535024 3.4285714285714284 3.4285714285714284 3.4285714285714284h25.142857142857142c1.8934857142857142 0 3.4285714285714284 -1.5350857142857142 3.4285714285714284 -3.4285714285714284v-20.57142857142857c0 -1.8935542857142855 -1.5350857142857142 -3.4285714285714284 -3.4285714285714284 -3.4285714285714284h-2.285485714285714V2.2857142857142856c0 -1.2623657142857143 -1.0233142857142856 -2.2857142857142856 -2.2857142857142856 -2.2857142857142856 -1.2623085714285713 0 -2.2856685714285714 1.0233485714285713 -2.2856685714285714 2.2857142857142856v2.2857142857142856H10.285714285714285V2.2857142857142856Zm5.688548571428571 9.428777142857143c0.21348571428571428 -0.004091428571428571 0.42388571428571425 0.051611428571428565 0.6073828571428571 0.16082285714285716 0.18349714285714286 0.1092342857142857 0.33275428571428567 0.26761142857142856 0.43094857142857146 0.45725714285714286l0.004228571428571429 0.008342857142857143 1.7013942857142856 3.42256 0.006719999999999999 0.0013942857142857142 3.769074285714286 0.5722742857142856c0.21286857142857143 0.029051428571428572 0.4134171428571428 0.11744 0.5784457142857143 0.25513142857142856 0.16685714285714284 0.1392 0.29051428571428567 0.32304 0.35679999999999995 0.5300114285714286 0.06628571428571428 0.20697142857142858 0.07222857142857143 0.4285257142857143 0.01714285714285714 0.6387428571428571 -0.054857142857142854 0.20905142857142855 -0.16754285714285713 0.39828571428571424 -0.32525714285714286 0.5458742857142856L20.468662857142856 20.82761142857143c0.019725714285714287 0.046079999999999996 0.03330285714285714 0.09460571428571429 0.04036571428571428 0.14434285714285713l0.5313142857142856 3.7389028571428566c0.03988571428571428 0.21005714285714283 0.020137142857142857 0.4272 -0.05723428571428571 0.6269714285714285 -0.08002285714285713 0.2064 -0.21821714285714283 0.38537142857142853 -0.3978514285714285 0.5147428571428572 -0.1796342857142857 0.1296 -0.39298285714285713 0.20411428571428572 -0.6141714285714285 0.21485714285714286 -0.21657142857142855 0.010514285714285714 -0.4315657142857143 -0.04091428571428571 -0.6199771428571428 -0.14788571428571426l-3.327657142857143 -1.7616c-0.010308571428571429 -0.0034285714285714284 -0.02114285714285714 -0.005257142857142857 -0.032068571428571425 -0.005257142857142857 -0.010925714285714287 0 -0.021737142857142854 0.0018285714285714285 -0.03204571428571428 0.005257142857142857l-3.3276799999999995 1.7616c-0.18841142857142856 0.10697142857142856 -0.40340571428571426 0.15839999999999999 -0.6199542857142858 0.14788571428571426 -0.22121142857142856 -0.010742857142857143 -0.43453714285714284 -0.08525714285714285 -0.6141714285714285 -0.21485714285714286 -0.1796342857142857 -0.12937142857142855 -0.3178514285714285 -0.3083428571428571 -0.3978514285714285 -0.5147428571428572 -0.07842285714285714 -0.20228571428571426 -0.09764571428571428 -0.4226285714285714 -0.05563428571428571 -0.6354285714285715l0.630742857142857 -3.74496c0.0034057142857142854 -0.020159999999999997 0.007885714285714286 -0.04013714285714285 0.013417142857142857 -0.05981714285714285L8.858217142857143 18.283817142857142l-0.011474285714285715 -0.011314285714285714c-0.14761142857142856 -0.1495085714285714 -0.2512 -0.3367542857142857 -0.29942857142857143 -0.5412342857142857 -0.048228571428571426 -0.20448 -0.03924571428571429 -0.41828571428571426 0.025965714285714286 -0.6180114285714285 0.06521142857142857 -0.19970285714285713 0.18413714285714286 -0.3776228571428571 0.3437485714285714 -0.5142171428571428 0.15961142857142857 -0.13661714285714285 0.35373714285714286 -0.22665142857142856 0.56112 -0.2602514285714286l0.008525714285714284 -0.0013257142857142858 3.7772114285714284 -0.5537142857142857 0.0027428571428571424 -0.004685714285714286 1.6970057142857142 -3.4137142857142857c0.09094857142857142 -0.19035428571428573 0.23277714285714285 -0.35193142857142856 0.4098742857142857 -0.46678857142857144 0.1791542857142857 -0.11620571428571429 0.38724571428571425 -0.17995428571428568 0.6007542857142857 -0.18406857142857141Z"
                  clip-rule="evenodd"
                  stroke-width="2.2857"
                ></path>
              </g>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-zinc-800 text-2xl">
              Progres belajarmu
            </h3>
            <p className="font-medium text-zinc-500">
              Masih ada misi yang kamu selesaikan nih!
            </p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-zinc-800 font-semibold mb-1 text-lg">6%</p>
          <div className="flex bg-zinc-200 h-2 rounded-full">
            <div className="w-1/15 bg-primary h-2 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex justify-between items-center px-5 py-2.5 rounded-lg border border-zinc-200">
            <p className="font-medium">Linked List</p>
            <p className="font-medium text-zinc-500">
              {userData.current_completed_level.linked_list}/5
            </p>
          </div>
          <div className="flex justify-between items-center px-5 py-2.5 rounded-lg border border-zinc-200">
            <p className="font-medium">Stack & Queue</p>
            <p className="font-medium text-zinc-500">
              {userData.current_completed_level.stack_and_queue}/5
            </p>
          </div>
          <div className="flex justify-between items-center px-5 py-2.5 rounded-lg border border-zinc-200">
            <p className="font-medium">Binary Tree</p>
            <p className="font-medium text-zinc-500">
              {userData.current_completed_level.binary_tree}/5
            </p>
          </div>
        </div>
      </div>

      {loading && <Skeleton />}
      {error && <p>Error: {error.message}</p>}
      {completedPuzzles?.length > 0 && (
        <ul className="flex flex-col items-center pt-20 pb-10">
          {completedPuzzles?.map((puzzle, i) => (
            <React.Fragment>
              <li key={puzzle.id} className="flex flex-col items-center">
                <div className="flex items-center px-5 py-4 bg-icy-300 rounded-xl shadow-[0_6px_0_0_#0E8AC8] relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    id="Check-Square--Streamline-Core"
                    height="24"
                    width="24"
                  >
                    <desc>
                      Check Square Streamline Icon: https://streamlinehq.com
                    </desc>
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
                  <div
                    className={`text-icy-700 w-78 absolute ${i % 2 === 0 ? "-top-4 left-28" : "-top-4 -left-12 -translate-x-full"}`}
                  >
                    <div className="p-5 rounded-2xl w-full border-dashed relative bg-icy-100">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold">
                          Level {puzzle.level || "-"} - {puzzle.topic}
                        </h3>
                      </div>

                      <div className="flex justify-between font-medium">
                        <p>Code snippet</p>
                        <p>{puzzle.ccbh_triggered + 1}x percobaan</p>
                      </div>
                    </div>
                    <p className="font-medium text-center mt-1">
                      Selesai pada{" "}
                      {new Date(puzzle.updated_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              </li>
              {i < completedPuzzles.length - 1 && (
                <li className="pt-4">
                  <div className="flex flex-col items-center gap-2 mb-2">
                    <span className="size-2 bg-zinc-200 rounded-full"></span>
                    <span className="size-2 bg-zinc-200 rounded-full"></span>
                    <span className="size-2 bg-zinc-200 rounded-full"></span>
                  </div>
                </li>
              )}
            </React.Fragment>
          ))}
          <li className="pt-4">
            <div className="flex flex-col items-center gap-2 mb-2">
              <span className="size-2 bg-zinc-200 rounded-full"></span>
              <span className="size-2 bg-zinc-200 rounded-full"></span>
              <span className="size-2 bg-zinc-200 rounded-full"></span>
            </div>
            <div className="size-8 bg-babypink-100 rounded-full border-4 border-babypink-300 shadow-[0_4px_0_0_#CC005F]"></div>
          </li>
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
