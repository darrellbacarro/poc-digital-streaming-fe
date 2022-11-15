import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { matchPath, Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { DEFAULT_AVATAR } from '../../constants';
import { useAppSelector } from '../../hooks/redux.hook';
import CustomSearch from '../input/CustomSearch';
import { Container, ContainerHeader, HeaderControlsContainer, SideBar, SizedBox, UIButton, UserAvatar, UserAvatarContainer } from '../layout';
import { IconNavLink } from './IconNavLink';

type SidebarItemData = {
  icon: IconDefinition;
  label: string;
  to: string;
  extraPath?: string;
};

const sidebarItems: (SidebarItemData | null)[] = [
  {
    icon: solid('film'),
    label: 'Browse Movies',
    to: '/',
    extraPath: '/browse/:id'
  },
  {
    icon: solid('thumbs-up'),
    label: 'Favorites',
    to: '/favorites',
  },
  {
    icon: solid('user-astronaut'),
    label: 'Actors',
    to: '/actors',
    extraPath: '/actors/:id'
  },
  {
    icon: solid('masks-theater'),
    label: 'Genres',
    to: '/genres',
    extraPath: '/genres/:id'
  },
  null,
];

type PublicLayoutContext = {
  setScrolled: (scrolled: boolean) => void;
  setAtBottom: (atBottom: boolean) => void;
  atBottom: boolean;
};

const PublicLayout = () => {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const { token, userData } = useAppSelector(state => state.session);
  const navigate = useNavigate();

  const loggedIn = useMemo(() => {
    return !!token;
  }, [token]);

  const openLSUModal = useCallback(() => {
    navigate({ search: '?l' });
  }, [navigate]);

  useEffect(() => {
    setScrolled(false);
  }, [pathname]);

  return (
    <Container>
      <SideBar>
        <img src={logo} width={42} alt="Logo" />
        {
          sidebarItems.map((item, index) => {
            if (item === null) return <SizedBox key={index} />;

            if (item.label === 'Favorites' && (!userData || userData.role === 'ADMIN'))
              return <SizedBox key={index} height={1} />
             
            const mainPathMatch = matchPath(item.to, pathname);
            const extraPathMatch = item.extraPath && matchPath(item.extraPath, pathname);

            const active = mainPathMatch || extraPathMatch;

            return (
              <IconNavLink to={item.to} active={!!active} key={item.to} label={item.label} icon={item.icon} />
            );
          })
        }
        {
          loggedIn && (
            <IconNavLink to="/logout" icon={solid('right-from-bracket')} label="Log Out" />
          )
        }
        {
          userData?.role === 'ADMIN' && (
            <IconNavLink className='special' to="/cm" icon={solid('laptop-code')} label="Content Management" />
          )
        }
      </SideBar>
      <ContainerHeader className={clsx({ solid: scrolled })}>
        <HeaderControlsContainer>
          <CustomSearch />
        </HeaderControlsContainer>
        {
          loggedIn ? (
            <UserAvatarContainer>
              <span>{ userData?.fullname ?? 'Guest' }</span>
              <UserAvatar image={userData?.photo ?? DEFAULT_AVATAR} />
            </UserAvatarContainer>
          ) : (
            <UIButton
              onClick={openLSUModal}
              className={clsx('accent', 'no-border', 'md')}>Log In</UIButton>
          )
        }
      </ContainerHeader>
      <Outlet context={{ setScrolled, atBottom, setAtBottom }} />
    </Container>
  );
};

export default PublicLayout;

export const usePublicLayoutContext = () => {
  return useOutletContext<PublicLayoutContext>();
};
