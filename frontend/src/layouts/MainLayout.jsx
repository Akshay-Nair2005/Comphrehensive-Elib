import { Outlet } from "react-router-dom";
import Navv from "../components/LinkComponents/Navv";
import Footerr from "../components/LinkComponents/Footerr";
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
