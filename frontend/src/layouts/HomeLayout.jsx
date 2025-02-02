import { Outlet } from "react-router-dom";
import Sidebar from "../components/LinkComponents/Sidebar";
import Footerr from "../components/LinkComponents/Footerr";
import ScrollToTop from "../components/ScrollToTop";

const HomeLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="sticky ">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Scroll-to-top component */}
        <ScrollToTop />

        {/* Main Content */}
        <main className="flex-1 p-2">
          <Outlet />
        </main>

        {/* Footer */}
        {/* <Footerr /> */}
      </div>
    </div>
  );
};

export default HomeLayout;
