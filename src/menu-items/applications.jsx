// third-party
import { FormattedMessage } from 'react-intl';

// assets
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';

// icons
const icons = {
  MessageOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  CustomerServiceOutlined,
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const getApplicationsMenu = (role) => {
  const children = [
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'user-profile',
          title: <FormattedMessage id="user-profile" />,
          type: 'item',
          link: '/profile',
          url: '/profile/user/personal',
          breadcrumbs: false,
        },
      ],
    },
  ];

  if (role === 'ADVISOR') {
    children.push({
      id: 'channel',
      title: <FormattedMessage id="Channels" />,
      type: 'collapse',
      icon: icons.CustomerServiceOutlined,
      children: [
        {
          id: 'channel-card',
          title: <FormattedMessage id="Channel List" />,
          type: 'item',
          url: '/channel/list',
        },
      ],
    });
  }

  if (role === 'INVESTOR') {
    children.push({
      id: 'signal',
      title: <FormattedMessage id="Signals" />,
      type: 'collapse',
      icon: icons.MessageOutlined,
      children: [
        // {
        //   id: 'signal-card',
        //   title: <FormattedMessage id="Signal" />,
        //   type: 'item',
        //   url: '/signal/list',
        // },
        {
          id: 'chat-card',
          title: <FormattedMessage id="Signal-chat" />,
          type: 'item',
          url: '/signal/chat',
        },
      ],
    });
  }

  return {
    id: 'group-applications',
    title: <FormattedMessage id="applications" />,
    icon: icons.AppstoreAddOutlined,
    type: 'group',
    children,
  };
};

export default getApplicationsMenu;
