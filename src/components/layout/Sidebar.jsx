import appLogo from "../../assets/vector/App-Logo.svg";

import { NavLink } from "react-router";
import { collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { query, orderBy, limit, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useCollectionData } from "react-firebase-hooks/firestore";

const RecentlyCompleted = ({ userId }) => {
  const completePuzzleRef = collection(db, "user_journey");
  const completedPuzzleQuery = query(
    completePuzzleRef,
    where("user_id", "==", userId),
    where("status", "==", "completed"),
    orderBy("updated_at", "desc"),
    limit(3),
  );

  const [completedPuzzles, loading, error] =
    useCollectionData(completedPuzzleQuery);

  if (loading) {
    return <div className="px-3 pt-3 text-center">Memuat...</div>;
  }

  if (error) {
    return <div className="px-3 text-center">Error: {error.message}</div>;
  }

  if (completedPuzzles.length > 0) {
    return (
      <ul className="px-3 space-y-3">
        {completedPuzzles.map((puzzle) => (
          <li key={puzzle.id} className="font-medium flex gap-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.6 -0.6 18 18"
              id="Check-Square--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>
                Check Square Streamline Icon: https://streamlinehq.com
              </desc>
              <g id="check-square--check-form-validation-checkmark-success-add-addition-box-square-tick">
                <path
                  id="Vector"
                  stroke="#1aa7ef"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12.600000000000001 0.6000000000000001h-8.400000000000002c-1.9882200000000003 0 -3.6000000000000005 1.6117800000000002 -3.6000000000000005 3.6000000000000005v8.400000000000002c0 1.9882800000000003 1.6117800000000002 3.6000000000000005 3.6000000000000005 3.6000000000000005h8.400000000000002c1.9882800000000003 0 3.6000000000000005 -1.6117200000000003 3.6000000000000005 -3.6000000000000005v-8.400000000000002c0 -1.9882200000000003 -1.6117200000000003 -3.6000000000000005 -3.6000000000000005 -3.6000000000000005Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_2"
                  stroke="#1aa7ef"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.900532 5.700000000000001 -4.800000000000001 6.000000000000001 -2.4000000000000004 -1.8000000000000003"
                  strokeWidth="1.2"
                ></path>
              </g>
            </svg>
            <span>
              Misi{" "}
              <NavLink
                to={`/puzzles/${puzzle.puzzle_id}`}
                className={"text-primary font-medium hover:underline"}
              >
                {puzzle.puzzle_id}
              </NavLink>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="px-3 pt-3 text-center font-medium text-sm text-zinc-300 flex flex-col gap-2 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 56 56"
        id="Cyborg-2--Streamline-Core"
        height="24"
        width="24"
        className="fill-zinc-300"
      >
        <desc>Cyborg 2 Streamline Icon: https://streamlinehq.com</desc>
        <g id="cyborg-2--artificial-robotics-intelligence-machine-technology-android">
          <path
            id="Subtract"
            fill="currentFill"
            fill-rule="evenodd"
            d="M21.332 7.416A6.668 6.668 0 1 1 31 13.372v5.88h11a10 10 0 0 1 10 10v16a10 10 0 0 1 -10 10h-28a10 10 0 0 1 -10 -10v-16a10 10 0 0 1 10 -10h11v-5.88a6.668 6.668 0 0 1 -3.668 -5.956Zm15.488 37.3a2.5 2.5 0 0 0 -3.64 -3.432c-0.9 0.96 -2.828 1.692 -5.18 1.692s-4.28 -0.736 -5.18 -1.692a2.5 2.5 0 0 0 -3.64 3.432c2.208 2.34 5.728 3.26 8.82 3.26 3.092 0 6.612 -0.92 8.82 -3.26ZM20.168 36.168a3 3 0 1 0 0 -6 3 3 0 0 0 0 6Zm18.664 -3a3 3 0 1 1 -6 0 3 3 0 0 1 6 0Z"
            clip-rule="evenodd"
            stroke-width="4"
          ></path>
        </g>
      </svg>
      <p>Masih kosong nih...</p>
    </div>
  );
};

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-60 border-r-2 border-zinc-200 fixed top-0 left-0 h-screen bg-white z-10 -translate-x-full md:translate-x-0 transition-transform duration-200 py-4 px-2.5 flex flex-col justify-between overflow-y-auto scrollbar-none gap-10">
      <div className="space-y-10">
        <div className="flex items-center gap-2 px-3">
          <img src={appLogo} alt="Logo" width={32} />
          <h1 className="text-xl font-bold text-primary">NodeNova</h1>
        </div>

        <div className="flex flex-col gap-3">
          <NavLink
            className={
              "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/dashboard"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
              id="Home-3--Streamline-Core"
              height="18"
              width="18"
              className="fill-zinc-400 group-hover:fill-icy-600 transition-colors"
            >
              <desc>Home 3 Streamline Icon: https://streamlinehq.com</desc>
              <g id="home-3--home-house-roof-shelter">
                <path
                  id="Subtract"
                  fill="currentFill"
                  fill-rule="evenodd"
                  d="M0.40909114285714293 7.772014285714286C0.14817085714285716 8.015207142857143 0 8.355857142857143 0 8.71254V16.071428571428573c0 1.0650857142857144 0.8634510000000001 1.9285714285714288 1.9285714285714288 1.9285714285714288H7.714285714285715v-3.8571428571428577c0 -0.7101000000000001 0.57564 -1.2857142857142858 1.2857142857142858 -1.2857142857142858s1.2857142857142858 0.5756142857142857 1.2857142857142858 1.2857142857142858v3.8571428571428577h5.7857142857142865c1.0650857142857144 0 1.9285714285714288 -0.8634857142857143 1.9285714285714288 -1.9285714285714288V8.71254c0 -0.3566828571428572 -0.14811428571428573 -0.6973328571428572 -0.4091142857142857 -0.9405257142857143L9.41837142857143 0.154764c-0.24075000000000002 -0.20635174285714286 -0.5959928571428572 -0.206352 -0.8367428571428572 0L0.40909114285714293 7.772014285714286Z"
                  clip-rule="evenodd"
                  stroke-width="1.2857"
                ></path>
              </g>
            </svg>
            <p>Beranda</p>
          </NavLink>
          <NavLink
            className={
              "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/leaderboard"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              id="Trophy--Streamline-Core"
              height="18"
              width="18"
              className="fill-zinc-400 group-hover:fill-icy-600 transition-colors"
            >
              <desc>Trophy Streamline Icon: https://streamlinehq.com</desc>
              <g id="trophy--reward-rating-trophy-social-award-media">
                <path
                  id="Union"
                  fill="currentFill"
                  fill-rule="evenodd"
                  d="M0 0.749908c0 -0.414213 0.335786 -0.7499995527 0.75 -0.7499995527h2.88462c0.01876 0 0.03737 0.0006892797 0.05579 0.0020439027h6.62089c0.0179 -0.001297666 0.036 -0.0019530653 0.0541 -0.0019530653H13.25c0.4142 0 0.75 0.3357867153 0.75 0.7499997153V3.63499c0 1.85926 -1.396 3.39246 -3.1971 3.60855 -0.4474 1.3692 -1.61369 2.41325 -3.0529 2.68626V12.5h2.6154c0.4142 0 0.75 0.3358 0.75 0.75s-0.3358 0.75 -0.75 0.75H7.02626c-0.00872 0.0003 -0.01747 0.0005 -0.02626 0.0005s-0.01754 -0.0002 -0.02626 -0.0005H3.63461c-0.41421 0 -0.75 -0.3358 -0.75 -0.75s0.33579 -0.75 0.75 -0.75H6.25V9.9298c-1.43921 -0.27301 -2.60549 -1.31707 -3.05293 -2.68626C1.39604 7.02745 0 5.49425 0 3.63499V0.749908ZM2.88462 5.63413V1.49991H1.5v2.13508c0 0.91499 0.57569 1.69552 1.38462 1.99914ZM11.1154 1.5v4.13413C11.9243 5.33051 12.5 4.54998 12.5 3.63499V1.5h-1.3846Z"
                  clip-rule="evenodd"
                  stroke-width="1"
                ></path>
              </g>
            </svg>
            <p>Papan Peringkat</p>
          </NavLink>
          <NavLink
            className={
              "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/achievements"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
              id="Crown--Streamline-Core"
              height="18"
              width="18"
              className="fill-zinc-400 group-hover:fill-icy-600 transition-colors"
            >
              <desc>Crown Streamline Icon: https://streamlinehq.com</desc>
              <g id="crown--reward-social-rating-media-queen-vip-king-crown">
                <path
                  id="Union"
                  fill="currentFill"
                  fill-rule="evenodd"
                  d="M9.526654285714287 2.2027757142857145C9.40635 2.030927142857143 9.209777142857144 1.9285714285714288 9 1.9285714285714288c-0.20977714285714288 0 -0.40635000000000004 0.1023557142857143 -0.5266542857142857 0.27420428571428573L4.412764285714286 8.003622857142858 1.0974252857142859 4.688292857142858c-0.18385585714285713 -0.18385714285714286 -0.4603602857142857 -0.23886000000000002 -0.7005792857142857 -0.13935857142857144C0.15662700000000002 4.648435714285715 0 4.882847142857143 0 5.142857142857143v8.357142857142858c0 0.6819428571428572 0.27091800000000005 1.3359857142857143 0.7531534285714286 1.8182571428571428C1.235390142857143 15.800528571428574 1.889447142857143 16.071428571428573 2.5714285714285716 16.071428571428573h12.857142857142858c0.6819428571428572 0 1.3359857142857143 -0.27090000000000003 1.8182571428571428 -0.7531714285714286S18 14.18194285714286 18 13.500000000000002V5.142857142857143c0 -0.26001 -0.15660000000000002 -0.4944214285714286 -0.3969 -0.5939228571428572 -0.2401714285714286 -0.09950142857142857 -0.5167285714285714 -0.044498571428571436 -0.7005857142857144 0.13935857142857144l-3.315214285714286 3.3153300000000003 -4.060645714285714 -5.800847142857144Z"
                  clip-rule="evenodd"
                  stroke-width="1.2857"
                ></path>
              </g>
            </svg>
            <p>Pencapaianmu</p>
          </NavLink>
          <NavLink
            className={
              "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/journey"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              id="Calendar-Star--Streamline-Core"
              height="18"
              width="18"
              className="fill-zinc-400 group-hover:fill-icy-600 transition-colors"
            >
              <desc>
                Calendar Star Streamline Icon: https://streamlinehq.com
              </desc>
              <g id="calendar-star--calendar-date-day-favorite-like-month-star">
                <path
                  id="Subtract"
                  fill="currentFill"
                  fill-rule="evenodd"
                  d="M4.5 1c0 -0.552285 -0.44772 -1 -1 -1s-1 0.447715 -1 1v1h-1C0.671573 2 0 2.67157 0 3.5v9c0 0.8284 0.671573 1.5 1.5 1.5h11c0.8284 0 1.5 -0.6716 1.5 -1.5v-9c0 -0.82843 -0.6716 -1.5 -1.5 -1.5h-0.9999V1c0 -0.552285 -0.4477 -1 -1 -1 -0.55226 0 -0.99998 0.447715 -0.99998 1v1H4.5V1Zm2.48874 4.12509c0.0934 -0.00179 0.18545 0.02258 0.26573 0.07036 0.08028 0.04779 0.14558 0.11708 0.18854 0.20005l0.00185 0.00365 0.74436 1.49737 0.00294 0.00061 1.64897 0.25037c0.09313 0.01271 0.18087 0.05138 0.25307 0.11162 0.073 0.0609 0.1271 0.14133 0.1561 0.23188 0.029 0.09055 0.0316 0.18748 0.0075 0.27945 -0.024 0.09146 -0.0733 0.17425 -0.1423 0.23882L8.95504 9.11208c0.00863 0.02016 0.01457 0.04139 0.01766 0.06315l0.23245 1.63577c0.01745 0.0919 0.00881 0.1869 -0.02504 0.2743 -0.03501 0.0903 -0.09547 0.1686 -0.17406 0.2252 -0.07859 0.0567 -0.17193 0.0893 -0.2687 0.094 -0.09475 0.0046 -0.18881 -0.0179 -0.27124 -0.0647l-1.45585 -0.7707c-0.00451 -0.0015 -0.00925 -0.0023 -0.01403 -0.0023 -0.00478 0 -0.00951 0.0008 -0.01402 0.0023l-1.45586 0.7707c-0.08243 0.0468 -0.17649 0.0693 -0.27123 0.0647 -0.09678 -0.0047 -0.19011 -0.0373 -0.2687 -0.094 -0.07859 -0.0566 -0.13906 -0.1349 -0.17406 -0.2252 -0.03431 -0.0885 -0.04272 -0.1849 -0.02434 -0.278l0.27595 -1.63842c0.00149 -0.00882 0.00345 -0.01756 0.00587 -0.02617L3.87547 7.99917l-0.00502 -0.00495c-0.06458 -0.06541 -0.1099 -0.14733 -0.131 -0.23679 -0.0211 -0.08946 -0.01717 -0.183 0.01136 -0.27038 0.02853 -0.08737 0.08056 -0.16521 0.15039 -0.22497 0.06983 -0.05977 0.15476 -0.09916 0.24549 -0.11386l0.00373 -0.00058 1.65253 -0.24225 0.0012 -0.00205 0.74244 -1.4935c0.03979 -0.08328 0.10184 -0.15397 0.17932 -0.20422 0.07838 -0.05084 0.16942 -0.07873 0.26283 -0.08053Z"
                  clip-rule="evenodd"
                  stroke-width="1"
                ></path>
              </g>
            </svg>
            <p>Jejak belajar</p>
          </NavLink>
          <NavLink
            className={
              "flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/settings"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              id="Cog--Streamline-Core"
              height="18"
              width="18"
              className="fill-zinc-400 group-hover:fill-icy-600 transition-colors"
            >
              <desc>Cog Streamline Icon: https://streamlinehq.com</desc>
              <g id="cog--work-loading-cog-gear-settings-machine">
                <path
                  id="Subtract"
                  fill="currentFill"
                  fill-rule="evenodd"
                  d="m5.557 0.69 -0.463 1.195 -1.594 0.904 -1.27 -0.194a1.077 1.077 0 0 0 -1.078 0.528l-0.43 0.754a1.077 1.077 0 0 0 0.086 1.217l0.807 1.001v1.81L0.83 8.906a1.077 1.077 0 0 0 -0.086 1.217l0.43 0.754a1.077 1.077 0 0 0 1.078 0.528l1.27 -0.194 1.573 0.904 0.463 1.196a1.076 1.076 0 0 0 1 0.689h0.905a1.076 1.076 0 0 0 1.002 -0.69l0.463 -1.195 1.572 -0.904 1.27 0.194a1.077 1.077 0 0 0 1.078 -0.528l0.43 -0.754a1.077 1.077 0 0 0 -0.086 -1.217l-0.807 -1.001v-1.81l0.786 -1.001a1.077 1.077 0 0 0 0.086 -1.217l-0.43 -0.754a1.076 1.076 0 0 0 -1.078 -0.528l-1.27 0.194 -1.573 -0.904L8.443 0.689A1.077 1.077 0 0 0 7.442 0h-0.884a1.077 1.077 0 0 0 -1.001 0.69ZM7 9.25a2.25 2.25 0 1 0 0 -4.5 2.25 2.25 0 0 0 0 4.5Z"
                  clip-rule="evenodd"
                  stroke-width="1"
                ></path>
              </g>
            </svg>
            <p>Pengaturan</p>
          </NavLink>
        </div>

        {/* <div className="flex flex-col gap-1">
          <p className="font-medium text-sm text-zinc-500 px-3">
            Baru diselesaikan
          </p>
          <RecentlyCompleted userId={user?.uid} />
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
