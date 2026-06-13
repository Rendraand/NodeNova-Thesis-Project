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
    <div className="w-60 border-r border-zinc-300 fixed top-0 left-0 h-screen bg-white z-10 -translate-x-full md:translate-x-0 transition-transform duration-200 py-4 px-1.5 flex flex-col justify-between overflow-y-auto scrollbar-none gap-10">
      <div className="space-y-10">
        <div className="flex items-center gap-2 px-3">
          <img src={appLogo} alt="Logo" width={32} />
          <h1 className="text-xl font-bold">NodeNova</h1>
        </div>

        <div className="flex flex-col gap-1">
          <NavLink
            className={
              "bg-icy-100/50 text-icy-600 flex items-center gap-2 px-3 py-2 rounded-lg font-medium"
            }
            to={"/dashboard"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.75 -0.75 18 18"
              id="Dashboard-3--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>Dashboard 3 Streamline Icon: https://streamlinehq.com</desc>
              <g
                id="dashboard-3--app-application-dashboard-home-layout-vertical"
                className="stroke-icy-600"
              >
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.321428571428571 7.660714285714286H10.607142857142858c-0.3254507142857143 0 -0.5892857142857143 0.263835 -0.5892857142857143 0.5892857142857143v7.071428571428571c0 0.32540357142857146 0.263835 0.5892857142857143 0.5892857142857143 0.5892857142857143h4.714285714285714c0.32540357142857146 0 0.5892857142857143 -0.26388214285714284 0.5892857142857143 -0.5892857142857143V8.25c0 -0.3254507142857143 -0.26388214285714284 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                  strokeWidth="1.5"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.321428571428571 0.5892857142857143H10.607142857142858c-0.3254507142857143 0 -0.5892857142857143 0.26383264285714286 -0.5892857142857143 0.5892857142857143v2.368928571428571c0 0.3254507142857143 0.263835 0.5892857142857143 0.5892857142857143 0.5892857142857143h4.714285714285714c0.32540357142857146 0 0.5892857142857143 -0.263835 0.5892857142857143 -0.5892857142857143V1.1785714285714286c0 -0.32545307142857144 -0.26388214285714284 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                  strokeWidth="1.5"
                ></path>
                <path
                  id="Vector_3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.892857142857143 0.5892857142857143H1.1785714285714286C0.8531183571428572 0.5892857142857143 0.5892857142857143 0.8531183571428572 0.5892857142857143 1.1785714285714286v7.071428571428571c0 0.3254507142857143 0.26383264285714286 0.5892857142857143 0.5892857142857143 0.5892857142857143h4.714285714285714c0.3254507142857143 0 0.5892857142857143 -0.263835 0.5892857142857143 -0.5892857142857143V1.1785714285714286c0 -0.32545307142857144 -0.263835 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                  strokeWidth="1.5"
                ></path>
                <path
                  id="Vector_4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.892857142857143 12.363214285714287H1.1785714285714286c-0.32545307142857144 0 -0.5892857142857143 0.26376428571428573 -0.5892857142857143 0.5892857142857143V15.321428571428571c0 0.32540357142857146 0.26383264285714286 0.5892857142857143 0.5892857142857143 0.5892857142857143h4.714285714285714c0.3254507142857143 0 0.5892857142857143 -0.26388214285714284 0.5892857142857143 -0.5892857142857143v-2.368928571428571c0 -0.3255214285714286 -0.263835 -0.5892857142857143 -0.5892857142857143 -0.5892857142857143Z"
                  strokeWidth="1.5"
                ></path>
              </g>
            </svg>
            <p>Beranda</p>
          </NavLink>
          <NavLink
            className={
              "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/journey"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              id="Map-Fold--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>Map Fold Streamline Icon: https://streamlinehq.com</desc>
              <g
                id="map-fold--navigation-map-maps-gps-travel-fold"
                className="stroke-zinc-500 group-hover:stroke-icy-600 transition-colors"
              >
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.83 12.5 -3.10498 0.7171C1.09836 13.3618 0.5 12.8859 0.5 12.2427V2.29538c0 -0.4656 0.321324 -0.86959 0.77498 -0.97436L4.83 0.5v12Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.82996 12.5 4.34 1v-12l-4.34 -1v12Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 11.7046c0 0.4656 -0.3213 0.8696 -0.7749 0.9744l-3.55506 0.821v-12L12.275 0.782916c0.6267 -0.144725 1.225 0.331194 1.225 0.974354v9.94733Z"
                  strokeWidth="1.2"
                ></path>
              </g>
            </svg>
            <p>Jejak belajar</p>
          </NavLink>
        </div>

        {/* <div className="flex flex-col gap-1">
          <p className="font-medium text-sm text-zinc-500 px-3">Bantuan</p>
          <NavLink
            className={
              "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
            }
            to={"/settings"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="-0.6 -0.6 18 18"
              id="Page-Setting--Streamline-Core"
              height="18"
              width="18"
            >
              <desc>
                Page Setting Streamline Icon: https://streamlinehq.com
              </desc>
              <g
                id="page-setting--page-setting-square-triangle-circle-line-combination-variation"
                className="stroke-zinc-500 group-hover:stroke-icy-600"
              >
                <path
                  id="Vector"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.600000000000001 1.2000000000000002h-6.000000000000001v6.000000000000001h6.000000000000001V1.2000000000000002Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.900000000000002 16.200000000000003h-6.000000000000001"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.900000000000002 10.200000000000001h6.000000000000001"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.900000000000002 13.200000000000003h6.000000000000001"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.200000000000003 7.200000000000001H9.600000000000001L12.900000000000002 0.6000000000000001 16.200000000000003 7.200000000000001Z"
                  strokeWidth="1.2"
                ></path>
                <path
                  id="Vector_6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.6000000000000005 16.200000000000003c1.6568520000000004 0 3.0000000000000004 -1.3431600000000001 3.0000000000000004 -3.0000000000000004 0 -1.6568520000000004 -1.343148 -3.0000000000000004 -3.0000000000000004 -3.0000000000000004S0.6000000000000001 11.543148 0.6000000000000001 13.200000000000003c0 1.6568400000000003 1.343148 3.0000000000000004 3.0000000000000004 3.0000000000000004Z"
                  strokeWidth="1.2"
                ></path>
              </g>
            </svg>
            <p>Variasi gameplay</p>
          </NavLink>
        </div> */}

        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm text-zinc-500 px-3">
            Baru diselesaikan
          </p>
          <RecentlyCompleted userId={user?.uid} />
        </div>
      </div>

      <NavLink
        className={
          "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group"
        }
        to={"/settings"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="-0.75 -0.75 18 18"
          id="Cog--Streamline-Core"
          height="18"
          width="18"
        >
          <desc>Cog Streamline Icon: https://streamlinehq.com</desc>
          <g
            id="cog--work-loading-cog-gear-settings-machine"
            className="stroke-zinc-500 group-hover:stroke-icy-600 transition-colors"
          >
            <path
              id="Vector"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.163975714285714 2.6517857142857144 0.5067857142857143 -1.3082142857142858c0.08547 -0.221496 0.23584392857142858 -0.4120156071428571 0.4314160714285714 -0.5466072857142857C7.297761428571429 0.6623736428571428 7.529421428571429 0.5899869642857143 7.766832857142857 0.5892857142857143h0.9664285714285714c0.23741142857142858 0.00070125 0.46908321428571426 0.07308792857142857 0.6646553571428571 0.2076784285714286 0.19558392857142856 0.13459167857142856 0.3459460714285715 0.3251112857142857 0.4314160714285714 0.5466072857142857l0.5067857142857143 1.3082142857142858 1.7206671428571427 0.99 1.3907142857142856 -0.21214285714285713c0.23158928571428572 -0.0314325 0.4673035714285715 0.0066825 0.6772071428571429 0.10951285714285715 0.20978571428571427 0.10283035714285714 0.38433214285714284 0.2657207142857143 0.5013642857142857 0.4679871428571429l0.4714285714285715 0.825c0.12080357142857143 0.20548392857142858 0.17654999999999998 0.4427657142857143 0.1596964285714286 0.6805307142857143 -0.01685357142857143 0.237765 -0.10536428571428572 0.46484035714285715 -0.2539821428571429 0.6512549999999999l-0.8603571428571428 1.0960714285714286v1.98l0.8839285714285714 1.0960714285714286c0.14861785714285713 0.18641464285714288 0.2371285714285714 0.41348999999999997 0.2539821428571429 0.6512549999999999 0.01685357142857143 0.237765 -0.038892857142857146 0.4750467857142857 -0.1596964285714286 0.6805307142857143l-0.4714285714285715 0.825c-0.11703214285714286 0.20224285714285714 -0.29157857142857146 0.3651214285714286 -0.5013642857142857 0.46801071428571434 -0.20990357142857144 0.10277142857142857 -0.4456178571428571 0.14095714285714286 -0.6772071428571429 0.10948928571428572l-1.3907142857142856 -0.21214285714285713 -1.7206671428571427 0.99 -0.5067857142857143 1.3082142857142858c-0.08547 0.22145357142857144 -0.23583214285714285 0.41202857142857147 -0.4314160714285714 0.5466214285714286 -0.19557214285714286 0.13459285714285715 -0.42724392857142857 0.20695714285714287 -0.6646553571428571 0.20766428571428572h-0.99c-0.23741142857142858 -0.0007071428571428571 -0.4690714285714286 -0.07307142857142858 -0.6646553571428571 -0.20766428571428572 -0.19557214285714286 -0.13459285714285715 -0.3459460714285715 -0.3251678571428571 -0.4314160714285714 -0.5466214285714286l-0.5067857142857143 -1.3082142857142858 -1.7207142857142856 -0.99 -1.3907142857142856 0.21214285714285713c-0.2315657142857143 0.031467857142857145 -0.4672564285714286 -0.0067178571428571435 -0.6771128571428572 -0.10948928571428572 -0.20984464285714288 -0.10288928571428572 -0.38439107142857143 -0.26576785714285717 -0.5014585714285714 -0.46801071428571434l-0.4714285714285715 -0.825c-0.12080357142857143 -0.20548392857142858 -0.17645571428571427 -0.4427657142857143 -0.1596257142857143 -0.6805307142857143 0.01683 -0.237765 0.10536428571428572 -0.46484035714285715 0.25391142857142857 -0.6512549999999999l0.8603571428571428 -1.0960714285714286V7.260000000000001l-0.8839285714285714 -1.0960714285714286c-0.14854714285714288 -0.18641464285714288 -0.23708142857142858 -0.41348999999999997 -0.25391142857142857 -0.6512549999999999 -0.01683 -0.237765 0.038822142857142854 -0.4750467857142857 0.1596257142857143 -0.6805307142857143l0.4714285714285715 -0.825c0.1170675 -0.20226642857142857 0.2916139285714286 -0.3651567857142857 0.5014585714285714 -0.4679871428571429 0.20985642857142858 -0.10283035714285714 0.44554714285714286 -0.14094535714285714 0.6771128571428572 -0.10951285714285715l1.3907142857142856 0.21214285714285713 1.7442857142857142 -0.99Zm-0.2710714285714286 5.598214285714286c0 0.4661957142857143 0.13824642857142858 0.9219257142857143 0.39724928571428575 1.3095578571428572 0.2590146428571429 0.3876321428571429 0.6271414285714286 0.6897471428571429 1.0578503571428572 0.8681592857142858 0.4307207142857143 0.17840035714285715 0.9046596428571428 0.22508357142857144 1.3618982142857143 0.1341332142857143 0.4572385714285715 -0.09095035714285715 0.8772460714285715 -0.31544464285714285 1.2069042857142858 -0.6451028571428571 0.32964642857142856 -0.32964642857142856 0.5541407142857143 -0.7496539285714287 0.6450910714285715 -1.2068925 0.09095035714285715 -0.4572385714285715 0.04427892857142857 -0.9311775 -0.1341332142857143 -1.3618982142857143 -0.17840035714285715 -0.43070892857142856 -0.4805271428571429 -0.7988475 -0.8681592857142858 -1.0578503571428572C9.171972857142858 6.031103571428572 8.716242857142857 5.892857142857143 8.250047142857143 5.892857142857143c-0.6251496428571428 0 -1.2247007142857143 0.24833678571428572 -1.6667475 0.6903953571428572 -0.44204678571428574 0.44204678571428574 -0.6903953571428572 1.0415978571428572 -0.6903953571428572 1.6667475v0Z"
              strokeWidth="1.5"
            ></path>
          </g>
        </svg>
        <p>Pengaturan</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
