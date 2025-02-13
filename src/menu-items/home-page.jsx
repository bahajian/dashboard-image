// third-party
import { FormattedMessage } from 'react-intl';

// assets
import ChromeOutlined from '@ant-design/icons/ChromeOutlined';

// type

// icons
const icons = { ChromeOutlined };

const homePage = {
  id: 'Home',
  title: <FormattedMessage id="home" />,
  type: 'group',
  url: '/home',
  icon: icons.ChromeOutlined
};

export default homePage;
