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

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/novels", element: <AllNovels /> },
      { path: "/hnovels", element: <HostedBooks /> },
      { path: "/info", element: <HostedBookInfo /> },
      { path: "/desc/:bookId", element: <PageDescription /> },
      { path: "/hdesc/:hbookId", element: <HbookPageDescription /> },
    ],
  },
  { path: "/text/:hbookTId", element: <TextViewer /> },
  { path: "/edit", element: <CustomEditor /> },
  { path: "/dash", element: <NewDashboard /> },
  { path: "/pdf/:BookId", element: <PdfViewer /> },
  { path: "*", element: <NotFoundPage /> },
]);
