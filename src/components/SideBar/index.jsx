import React from 'react'
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SidebarRoute, SideBtnWrap } from './SidebarElements'

const Sidebar = ({isOpen,toggle}) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to='about' onClick={toggle}>About</SidebarLink>
          <SidebarLink to='locations' onClick={toggle}>Locations</SidebarLink>
          <SidebarLink to='contact' onClick={toggle}>Contact Us</SidebarLink>
          {/* <SidebarLink to='signup' onClick={toggle}>Sign up</SidebarLink> */}
        </SidebarMenu>
        {/* <SideBtnWrap>
          <SidebarRoute to='/signin'>Sign in</SidebarRoute>
        </SideBtnWrap> */}
      </SidebarWrapper>
    </SidebarContainer>
  )
}

export default Sidebar
