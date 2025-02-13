// project import
import getApplicationsMenu from './applications';
import homePage from './home-page';
import pages from './pages';
import { useGetProfile } from '../api/profile';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = () => {
  const { profile } = useGetProfile();

  const role = profile?.role; // Get the role from the profile object

  return {
    items: [
      homePage,
      getApplicationsMenu(role), // Pass the role to generate the applications menu
      pages,
    ],
  };
};

export default menuItems;
