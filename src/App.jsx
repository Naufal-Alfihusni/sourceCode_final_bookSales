import { useEffect } from "react";
import { decodeToken, isExpired } from "react-jwt";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/public";
import PublicLayout from "./layouts/public";
import Authors from "./pages/public/authors";
import Books from "./pages/public/books";
import ShowBook from "./pages/public/books/show";
import ShowUser from "./pages/public/users/show";
import UserEdit from "./pages/public/users/edit";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

import AdminLayout from "./layouts/admin";
import Dashboard from "./pages/admin";
import AdminBooks from "./pages/admin/books";
import AdminGenres from "./pages/admin/genres";
import AdminAuthors from "./pages/admin/authors";
import AdminUsers from "./pages/admin/users";

import AdminTransactions from "./pages/admin/transactions";
import BookCreate from "./pages/admin/books/create";
import AuthorCreate from "./pages/admin/authors/create";
import GenreCreate from "./pages/admin/genres/create";

import AuthorEdit from "./pages/admin/authors/edit";
import BookEdit from "./pages/admin/books/edit";
import GenreEdit from "./pages/admin/genres/edit";
import TransactionEdit from "./pages/admin/transactions/edit";
import AboutUs from "./pages/public/about";

function TokenExpiryWatcher() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const expiration = decodeToken(token)?.exp;
    const clearExpiredSession = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
      navigate("/login", { replace: true });
    };

    if (isExpired(token) || !expiration) {
      clearExpiredSession();
      return;
    }

    const timeoutId = window.setTimeout(
      clearExpiredSession,
      Math.max(expiration * 1000 - Date.now(), 0),
    );

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <TokenExpiryWatcher />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="authors" element={<Authors />} />
            <Route path="books">
              <Route index element={<Books />} />
              <Route path="show/:id" element={<ShowBook />} />
            </Route>
            <Route path="about" element={<AboutUs />} />
            <Route path="users">
              <Route path="show/:id" element={<ShowUser />} />
              <Route path="edit/:id" element={<UserEdit />} />
            </Route>
          </Route>

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Admin */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="books">
              <Route index element={<AdminBooks />} />
              <Route path="create" element={<BookCreate />} />
              <Route path="edit/:id" element={<BookEdit />} />
            </Route>
            <Route path="genres">
              <Route index element={<AdminGenres />} />
              <Route path="create" element={<GenreCreate />} />
              <Route path="edit/:id" element={<GenreEdit />} />
            </Route>
            <Route path="authors">
              <Route index element={<AdminAuthors />} />
              <Route path="create" element={<AuthorCreate />} />
              <Route path="edit/:id" element={<AuthorEdit />} />
            </Route>
            <Route path="users">
              <Route index element={<AdminUsers />} />
            </Route>
            <Route path="transactions">
              <Route index element={<AdminTransactions />} />
              <Route path="edit/:id" element={<TransactionEdit />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
