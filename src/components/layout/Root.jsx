import { useAuth } from "../../context/AuthContext";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

import GetStarted from "../../pages/GetStarted";
import NewComer from "../../pages/NewComer";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Root = () => {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && userData && window.location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    } else if (!user || !userData) {
      navigate("/", { replace: true });
    }
  }, [user, userData, navigate]);

  if (loading) {
    return (
      <p className="text-center mt-16 font-semibold text-lg">
        Tunggu sebentar...
      </p>
    );
  }

  if (!user) {
    return <GetStarted />;
  }

  // untuk "new" user render halaman untuk input display name (hanya ketika pertama kali)
  if (!userData) {
    return <NewComer />;
  }

  // ketika user sudah ada (existing)
  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="px-10 pt-12 pb-15 md:ms-60">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
