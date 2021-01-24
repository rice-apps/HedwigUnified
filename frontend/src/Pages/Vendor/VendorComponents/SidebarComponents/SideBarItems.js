import Collapsible from 'react-collapsible'
import styled from 'styled-components/macro'
import './SidebarCollapsible.css'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

const SideBarItemsWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 80%;
  /* background-color: green; */
  flex-direction: column;
  align-content: stretch;
  margin-top: 10px;
  font-weight: 500;
`

const MainMenuItemWrapper = styled.div`
  background-color: #ffc8ba;
  color: black;
  width: 100%;
  padding: 0.5vh 0.5vw;
  border-radius: 20px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 0px;
`

function MainMenuItem (props) {
  // Make IsExpanded prop true when the menu item is expanded by the user
  return (
    <MainMenuItemWrapper>
      {props.name}
      {props.IsClosed ? (
        <IoIosArrowDown
          style={{ color: 'black', marginTop: '3px', marginLeft: '6px' }}
        />
      ) : (
        <IoIosArrowUp
          style={{ color: 'black', marginTop: '3px', marginLeft: '6px' }}
        />
      )}
    </MainMenuItemWrapper>
  )
}

const SubMenuItemWrapper = styled.div`
  background-color: white;
  margin-left: 15px;
  width: 80%;
  padding: 0.4vh 0.4vw;
  border-radius: 20px;
  position: relative;
`

const BottomMenuItemWrapper = styled.div`
  text-align: left;
  margin-left: 2vw;
  display: grid;
  font-size: 2.3vh;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;

  position: absolute;
  bottom: 3vh;
  left: 0px;
`

const StyledNavLink = styled(NavLink)`
  margin-left: 10px;
  text-decoration: none;
  color: black;
`

function SubMenuItem (props) {
  return (
    <SubMenuItemWrapper>
      <StyledNavLink
        to={props.path}
        activeStyle={{ color: '#EA907A', fontWeight: '700' }}
      >
        {' '}
        {props.label}{' '}
      </StyledNavLink>
    </SubMenuItemWrapper>
  )
}

function BottomMenuItem (props) {
  return (
    <BottomMenuItemWrapper>
      <StyledNavLink
        to='/employee/faq'
        activeStyle={{ color: '#EA907A', fontWeight: '700' }}
      >
        Help
      </StyledNavLink>
      {/* <StyledNavLink
      to='/employee/about'
      activeStyle={{ color: '#EA907A', fontWeight: '700' }}>
        About 
      </StyledNavLink> */}
    </BottomMenuItemWrapper>
  )
}

function SideBarItems () {
  return (
    <SideBarItemsWrapper>
      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Order Processing' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Order Processing' isClosed={false} />
        }
      >
        <SubMenuItem path='/employee/openorders' label='Open Orders' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Menu Management' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Menu Management' isClosed={false} />
        }
      >
        <SubMenuItem path='/employee/items' label='Edit Items' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Store Information' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Store Information' isClosed={false} />
        }
      >
        <SubMenuItem path='/employee/set-basic-info' label='Set Basic Info' />
        <SubMenuItem path='/employee/set-store-hours' label='Set Store Hours' />
      </Collapsible>
      <BottomMenuItem path='/employee/faq' label='Help' />
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
