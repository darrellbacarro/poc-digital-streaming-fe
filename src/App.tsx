import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useSearchParams
} from "react-router-dom";
import AdminApp from "./admin/AdminApp";
import PublicLayout from "./components/layout/PublicLayout";
import LoginSignUpModal from "./components/modal_forms/LoginSignUpModal";
import {
  ActorPage,
  ActorsPage,
  FavoritesPage,
  GenrePage,
  HomePage,
  LogoutPage,
  MoviesByGenrePage,
  SearchPage
} from "./pages";
import MoviePage from "./pages/MoviePage";

const App = () => {
  const [sp] = useSearchParams();
  const { pathname } = useLocation();

  const lsuModalOpen = useMemo(() => {
    return sp.has("l") || sp.has("s");
  }, [sp]);

  useEffect(() => {
    if (!pathname.includes("/cm")) require("./stylesheets/index.scss");
    else require("./stylesheets/admin.scss");
  }, [pathname]);

  return (
    <>
      <Toaster />
      {lsuModalOpen && <LoginSignUpModal key="lsu-modal" />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="browse">
              <Route index element={<Navigate to="/" />} />
              <Route path=":id" element={<MoviePage />} />
            </Route>
            <Route path="actors">
              <Route index element={<ActorsPage />} />
              <Route path=":id" element={<ActorPage />} />
            </Route>
            <Route path="genres">
              <Route index element={<GenrePage />} />
              <Route path=":id" element={<MoviesByGenrePage />} />
            </Route>
            <Route path="favorites" element={<FavoritesPage />} />
          </Route>
          <Route path="logout" element={<LogoutPage />} />
          <Route path="cm/*" element={<AdminApp />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default App;
