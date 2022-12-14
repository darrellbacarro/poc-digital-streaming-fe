import { Pane } from 'evergreen-ui';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { useAppSelector } from '../hooks/redux.hook';
import ActorsPage from './pages/ActorsPage';
import GenresPage from './pages/GenresPage';
import MoviesPage from './pages/MoviesPage';
import ReviewsPage from './pages/ReviewsPage';
import UsersPage from './pages/UsersPage';

const AdminApp = () => {
  const { userData } = useAppSelector((state) => state.session);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.role !== 'ADMIN') {
      navigate('/', { replace: true });
      toast.error('Unauthorized access', { duration: 1500, style: { backgroundColor: '#333', color: '#fff' } });
    }
  }, [userData]);

  return (
    <Pane className="admin-container">
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="users" />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="actors" element={<ActorsPage />} />
          <Route path="genres" element={<GenresPage />} />
        </Route>
      </Routes>
    </Pane>
  );
};

export default AdminApp;