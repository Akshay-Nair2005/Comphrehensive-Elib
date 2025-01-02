import NotFoundPage from "./pages/NotFoundPage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AllNovels from "./pages/AllNovels";
import TextViewer from "./pages/TextViewer";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import ScrollToTop from '../src/components/ScrollToTop';  // Import the ScrollToTop component
import PageDescription from "./pages/PageDescription";
import PdfViewer from "./pages/PdfViewer";
import HbookPageDescription from "./pages/HbookPageDescription";
import CustomEditor from "./pages/CustomEditor";
import HostedBooks from "./components/Book/HostedBooks";

// Define the router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/novels" element={<AllNovels />} />
        <Route path="/hnovels" element={<HostedBooks  />} />
        <Route path="/desc/:bookId" element={<PageDescription />} />
        <Route path="/hdesc/:hbookId" element={<HbookPageDescription />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/text/:hbookTId" element={<TextViewer />} />
      <Route path="/edit" element={<CustomEditor />} />
      <Route path="/pdf/:BookId" element={<PdfViewer />} />
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router}>
      {/* ScrollToTop should be inside the RouterProvider to ensure it can react to route changes */}
      <ScrollToTop />
    </RouterProvider>
  );
}

export default App;
