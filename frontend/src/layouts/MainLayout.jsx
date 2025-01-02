import { Outlet } from 'react-router-dom';
import Navv from '../components/Navv';

const MainLayout = () => {
  return (
    <>
        <Navv />
        <Outlet />
    </>
  )
}

export default MainLayout