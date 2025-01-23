import { Outlet } from "react-router-dom";
import Navv from "../components/Navv";
import Footerr from "../components/Footerr";
import ScrollToTop from "../components/ScrollToTop";

const MainLayout = () => {
  return (
    <>
      <ScrollToTop /> {/* Ensure it runs for every route change */}
      <Navv />
      <main>
        <Outlet />
      </main>
      <Footerr />
    </>
  );
};

export default MainLayout;
