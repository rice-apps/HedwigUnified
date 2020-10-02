import React from 'react'
import Collapsible from 'react-collapsible'
import styled, { css } from 'styled-components'
import './Collapsible.css'
import { FcCollapse, FcExpand } from 'react-icons/fc'
import { NavLink } from 'react-router-dom'

const SideBarItemsWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 80%;
  /* background-color: green; */
  flex-direction: column;
  align-content: stretch;
  margin-top: 10px;
`

const MainMenuItemWrapper = styled.div`
  background-color: #ffc8ba;
  color: black;
  width: 100%;
  padding: 0.5vh 0.5vw;
  border-radius: 20px;
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
        <FcExpand
          style={{ color: 'black', marginTop: '3px', marginLeft: '6px' }}
        />
      ) : (
        <FcCollapse
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
        activeStyle={{ color: '#EA907A', fontWeight: 'bold' }}
      >
        {' '}
        {props.label}{' '}
      </StyledNavLink>
    </SubMenuItemWrapper>
  )
}

function SideBarItems () {
  return (
    <SideBarItemsWrapper>
      <Collapsible
        open='true'
        trigger={<MainMenuItem name='Order Processing' IsClosed={true} />}
        triggerWhenOpen={
          <MainMenuItem name='Order Processing' isClosed={false} />
        }
      >
        <SubMenuItem
          path='/employee/openorders'
          label='Open Orders'
        ></SubMenuItem>
        <SubMenuItem
          path='/employee/closedorders'
          label='Closed Orders'
        ></SubMenuItem>
      </Collapsible>

      <Collapsible
        open='true'
        trigger={<MainMenuItem name='Menu Management' IsClosed={true} />}
        triggerWhenOpen={
          <MainMenuItem name='Menu Management' isClosed={false} />
        }
      >
        <SubMenuItem path='/employee/items' label='Edit Items'></SubMenuItem>
        <SubMenuItem
          path='/employee/modifiers'
          label='Edit Modifiers'
        ></SubMenuItem>
      </Collapsible>

      <Collapsible
        open='true'
        trigger={<MainMenuItem name='Store Information' IsClosed={true} />}
        triggerWhenOpen={
          <MainMenuItem name='Store Information' isClosed={false} />
        }
      >
        <SubMenuItem
          path='/employee/set-basic-info'
          label='Set Basic Info'
        ></SubMenuItem>
        <SubMenuItem
          path='/employee/set-store-hours'
          label='Set Store Hours'
        ></SubMenuItem>
      </Collapsible>
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
