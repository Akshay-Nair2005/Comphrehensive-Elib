import {
  NotFoundPage,
  HomePage,
  AllNovels,
  TextViewer,
  PageDescription,
  PdfViewer,
  HbookPageDescription,
  CustomEditor,
} from "./pages";
import MainLayout from "./layouts/MainLayout";
import HostedBooks from "./components/Book/HostedBooks";
import { createBrowserRouter } from "react-router-dom";
import { NewDashboard } from "./pages/trial/NewDashboard";
import HostedBookInfo from "./pages/HostedBooks/HostedBookInfo";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
// import PdfReader from "./pages/CustomBooks/PdfReader";
import UserProfile from "./pages/User/UserProfile";
import HomeLayout from "./layouts/HomeLayout"; // Import a separate layout for the homepage
import AboutUs from "./pages/AboutUs";
import SavedBooks from "./pages/User/SavedBooks";
import UserBooks from "./pages/User/UserBooks";
import UserChatApp from "./pages/User/UserChatApp";
import UserChatRoom from "./pages/User/UserChatRoom";
import ForgotPassword from "./pages/Auth/ForgetPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import UserEditor from "./pages/HostedBooks/UserEditor";
import { PdfReader } from "./pages/CustomBooks/PdfReader";
import { AuthorTextViewer } from "./pages/HostedBooks/AuthorTextViewer";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />, // Use HomeLayout for the homepage
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/room", element: <UserChatRoom /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />, // Use MainLayout for other routes with navigation
    children: [
      { path: "/desc/:bookId", element: <PageDescription /> },
      { path: "/hdesc/:hbookId", element: <HbookPageDescription /> },
      { path: "/info", element: <HostedBookInfo /> },
      { path: "/read", element: <PdfReader /> },
      { path: "/user", element: <UserProfile /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/saved", element: <SavedBooks /> },
      { path: "/userbooks", element: <UserBooks /> },
      { path: "/chat", element: <UserChatApp /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgetpass", element: <ForgotPassword /> },
  { path: "/resetpass", element: <ResetPassword /> },
  { path: "/hnovels", element: <HostedBooks /> },
  { path: "/novels", element: <AllNovels /> },
  { path: "/text/:hbookTId", element: <TextViewer /> },
  { path: "/edit/:hbookIdd", element: <CustomEditor /> },
  { path: "/uedit/:uhbookId", element: <UserEditor /> },
  { path: "/uview/:ahbookId", element: <AuthorTextViewer /> },
  { path: "/dash", element: <NewDashboard /> },
  { path: "/pdf/:BookId", element: <PdfViewer /> },
  { path: "*", element: <NotFoundPage /> },
]);
