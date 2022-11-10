import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { DEFAULT_AVATAR } from '../../constants';
import { useHistoryStack } from '../../hooks/history.hook';
import { useAppSelector } from '../../hooks/redux.hook';
import CustomSearch from '../input/CustomSearch';
import { Container, ContainerHeader, HeaderButton, HeaderControlsContainer, UserAvatar, UserAvatarContainer } from '../layout';

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
    icon: solid('users-viewfinder'),
    label: 'Actors',
    to: '/actors',
    extraPath: '/actors/:id'
  },
  {
    icon: solid('ticket'),
    label: 'Genres',
    to: '/genres',
    extraPath: '/genres/:id'
  },
  null,
];

type PublicLayoutContext = {
  setScrolled: (scrolled: boolean) => void;
};

const PublicLayout = () => {
  const { pathname } = useLocation();
  const historyStack = useHistoryStack();
  const [scrolled, setScrolled] = useState(false);
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
      {/* <SideBar>
        <Logo width={150} height={60} />
        {
          sidebarItems.map((item, index) => {
            if (item === null) return <SizedBox key={index} />;

            if (item.label === 'Favorites' && (!userData || userData.role === 'ADMIN'))
              return <SizedBox key={index} height={1} />
             
            const mainPathMatch = matchPath(item.to, pathname);
            const extraPathMatch = item.extraPath && matchPath(item.extraPath, pathname);

            const active = mainPathMatch || extraPathMatch;
              
            return (
              <SideBarItem key={item.to} className={clsx({ active })} to={item.to}>
                <div><FontAwesomeIcon icon={item.icon} /></div>
                <div>{ item.label }</div>
              </SideBarItem>
            );
          })
        }
        {
          loggedIn && (
            <SideBarItem to='/logout'>
              <div><FontAwesomeIcon icon={solid('right-from-bracket')} /></div>
              <div>Log Out</div>
            </SideBarItem>
          )
        }
        {
          !loggedIn && (
            <UIButton onClick={openLSUModal} className='accent single no-border'>
              <FontAwesomeIcon icon={solid('right-to-bracket')} />
              <span>Log In or Sign Up</span>
            </UIButton>
          )
        }
        {
          userData?.role === 'ADMIN' && (
            <SideBarItem className='special' key={'/cm'} to={'/cm'}>
              <div><FontAwesomeIcon icon={solid('laptop-code')} /></div>
              <div>Admin Console</div>
            </SideBarItem>
          )
        }
      </SideBar> */}
      <ContainerHeader className={clsx({ solid: scrolled })}>
        <HeaderControlsContainer>
          {
            historyStack.length > 0 && (
              <HeaderButton onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={solid('arrow-left')} />
              </HeaderButton>
            )
          }
          <CustomSearch />
        </HeaderControlsContainer>
        <UserAvatarContainer>
          <span>{ userData?.fullname ?? 'Guest' }</span>
          <UserAvatar image={userData?.photo ?? DEFAULT_AVATAR} />
        </UserAvatarContainer>
      </ContainerHeader>
      <Outlet context={{ setScrolled }} />
    </Container>
  );
};

export default PublicLayout;

export const usePublicLayoutContext = () => {
  return useOutletContext<PublicLayoutContext>();
};
