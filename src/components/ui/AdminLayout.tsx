import styled from "@emotion/styled";
import { Button, CommentIcon, FilmIcon, GridViewIcon, IconComponent, LogOutIcon, Menu, PageLayoutIcon, PeopleIcon, Popover, Position, UserIcon } from 'evergreen-ui';
import { motion } from "framer-motion";
import { FC, useCallback, useEffect } from "react";
import { matchPath, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from '../../assets/images/logo.png';
import { DEFAULT_AVATAR } from "../../constants";
import { useAppSelector } from "../../hooks/redux.hook";
import { UserAvatar, UserAvatarContainer } from "../layout";

const AdminLayoutStyled = styled(motion.div)`
  display: grid;
  align-self: stretch;
  flex: 1;
  grid-template-areas: "header header" "sidebar main";
  grid-template-columns: 225px 1fr;
  grid-template-rows: 64px 1fr;
  column-gap: 16px;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
`;

const AdminLayoutHeaderStyled = styled.div`
  grid-area: header;
  border-bottom: 1px rgba(0, 0, 0, 0.05) solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  & img {
    filter: brightness(1.25);
  }

  & ${UserAvatarContainer} {
    font-family: "SF UI Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    text-shadow: none;
    
    & > span {
      color: #474d66;
      font-weight: normal;
    }

    & > ${UserAvatar} {
      background-color: transparent;
      border: 1px #dedede solid;
    }

    &:hover {
      cursor: pointer;
    }
  }
`;

const NavigationButton = styled(Button)`
  justify-content: flex-start;
`;

const AdminLayoutSideNavStyled = styled.div`
  grid-area: sidebar;
  border-right: 1px rgba(0, 0, 0, 0.05) solid;
  display: flex;
  flex-direction: column;
  padding: 8px;
  box-sizing: border-box;
  gap: 8px;

  & ${NavigationButton}:focus {
    box-shadow: none;
  }
`;

const AdminLayoutMainStyled = styled(motion.div)`
  grid-area: main;
  padding: 16px 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

type NavigationRoute = {
  icon: IconComponent;
  label: string;
  to: string;
  extraPath?: string;
};

const navigationRoutes: NavigationRoute[] = [
  {
    icon: UserIcon,
    label: 'Users',
    to: '/cm/users',
  },
  {
    icon: CommentIcon,
    label: 'Reviews',
    to: '/cm/reviews',
  },
  {
    icon: FilmIcon,
    label: 'Movies',
    to: '/cm/movies',
  },
  {
    icon: PeopleIcon,
    label: 'Actors',
    to: '/cm/actors',
  },
  {
    icon: GridViewIcon,
    label: 'Genres',
    to: '/cm/genres',
  },
  {
    icon: PageLayoutIcon,
    label: 'Public Homepage',
    to: '/',
  }
];

const UserMenu = () => {
  const { userData } = useAppSelector((state) => state.session);
  const navigate = useNavigate();

  return (
    <Popover
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu>
          <Menu.Item icon={LogOutIcon} onSelect={() => navigate('/logout')} intent="danger">
            Log Out
          </Menu.Item>
        </Menu>
      }>
      <UserAvatarContainer>
        <span>{ userData?.fullname ?? 'Administrator' }</span>
        <UserAvatar image={userData?.photo ?? DEFAULT_AVATAR} />
      </UserAvatarContainer>
    </Popover>
  );
};

const transition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -20 }
};

const AdminLayout: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.session);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    if (userData?.role !== 'ADMIN')
      navigate('/');
  }, [userData, navigate]);

  return (
    <AdminLayoutStyled>
      <AdminLayoutHeaderStyled>
        <img src={logo} height={48} alt="Logo" />
        <UserMenu />
      </AdminLayoutHeaderStyled>
      <AdminLayoutSideNavStyled>
        {
          navigationRoutes.map((route) => {
            const active = matchPath(route.to, pathname);

            return (
              <NavigationButton
                onClick={() => handleNavigate(route.to)}
                isActive={!!active}
                key={route.to}
                iconBefore={route.icon}
                height={36}
                appearance="minimal">
                { route.label }
              </NavigationButton>
            );
          })
        }
      </AdminLayoutSideNavStyled>
      <AdminLayoutMainStyled {...transition} key={pathname}>
        <Outlet />
      </AdminLayoutMainStyled>
    </AdminLayoutStyled>
  );
};

export default AdminLayout;