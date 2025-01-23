// routes.js
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
import PdfReader from "./pages/CustomBooks/Pdfreader";
import UserProfile from "./pages/User/UserProfile";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/read", element: <PdfReader /> },
      { path: "/desc/:bookId", element: <PageDescription /> },
      { path: "/hdesc/:hbookId", element: <HbookPageDescription /> },
      { path: "/info", element: <HostedBookInfo /> },
      { path: "/user", element: <UserProfile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/hnovels", element: <HostedBooks /> },
  { path: "/novels", element: <AllNovels /> },
  { path: "/text/:hbookTId", element: <TextViewer /> },
  { path: "/edit/:hbookIdd", element: <CustomEditor /> },
  { path: "/dash", element: <NewDashboard /> },
  { path: "/pdf/:BookId", element: <PdfViewer /> },
  { path: "*", element: <NotFoundPage /> },
]);
