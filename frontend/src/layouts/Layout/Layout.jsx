import Footer from '../../components/Footer/Footer';
import Header from '../../components/Headers/Header/Header';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout