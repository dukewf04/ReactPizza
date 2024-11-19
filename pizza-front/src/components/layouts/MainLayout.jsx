import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import CarouselPizza from '../CarouselPizza';

const MainLayout = () => {
  const location = useLocation();
  return (
    <>
      <div className="wrapper">
        <Header />
        <div className="content">
          { !['/cart', '/profile'].includes(location.pathname) && <CarouselPizza />}
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
