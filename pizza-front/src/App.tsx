import './scss/app.scss';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Profile from './pages/Profile';
import { createAxiosInterceptors } from './utils/alarmHandler';
import AdminPanel from './pages/AdminPanel';

function App() {
  // Перехватчик axios
  createAxiosInterceptors();

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin/dashboard" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
