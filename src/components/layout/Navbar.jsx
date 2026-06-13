import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router";
import { useState } from "react";

import appLogo from "../../assets/vector/NodeNova-Logo.svg";

const Navbar = () => {
  const { user, userData, logout } = useAuth();
  const [userDropdown, setUserDropdown] = useState(false);
  const [navDropdown, setNavDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdown(false);
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between p-4 border-b border-zinc-200 md:hidden">
      <div className="flex items-center gap-4 relative">
        {/* Hamburger */}
        <button
          onClick={() => {
            setUserDropdown(false);
            setNavDropdown(!navDropdown);
          }}
          className="flex items-center text-zinc-600 p-2 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <img src={appLogo} alt="Logo" width={30} />

        {/* Navigation Menu */}
        <AnimatePresence>
          {navDropdown && (
            <motion.ul
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-0 left-0 translate-y-[calc(100%+8px)] bg-white w-48 p-2 rounded-xl shadow-lg border border-zinc-100 space-y-1"
            >
              <li>
                <button
                  onClick={() => {
                    setUserDropdown(false);
                    setNavDropdown(false);
                    navigate("/dashboard", { replace: true });
                  }}
                  className={
                    "bg-icy-100/50 text-icy-600 flex items-center gap-2 px-3 py-2 rounded-lg font-medium w-full cursor-pointer"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="-0.75 -0.75 18 18"
                    id="Dashboard-3--Streamline-Core"
                    height="18"
                    width="18"
                  >
                    <desc>
                      Dashboard 3 Streamline Icon: https://streamlinehq.com
                    </desc>
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
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserDropdown(false);
                    setNavDropdown(false);
                    navigate("/journey", { replace: true });
                  }}
                  className={
                    "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group w-full cursor-pointer"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    id="Map-Fold--Streamline-Core"
                    height="18"
                    width="18"
                  >
                    <desc>
                      Map Fold Streamline Icon: https://streamlinehq.com
                    </desc>
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
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setUserDropdown(false);
                    setNavDropdown(false);
                    navigate("/settings", { replace: true });
                  }}
                  className={
                    "flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-zinc-800 hover:bg-icy-100/50 transition-colors hover:text-icy-600 group w-full cursor-pointer"
                  }
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
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Player stats */}
      <div className="items-center gap-4 shrink-0 flex">
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
          <span className="text-icy-600 font-medium">{userData?.exp || 0}</span>
        </span>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNavDropdown(false);
              setUserDropdown(!userDropdown);
            }}
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
            {userDropdown && (
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
    </nav>
  );
};

export default Navbar;
