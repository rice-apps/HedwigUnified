import Collapsible from 'react-collapsible'
import styled, { css } from 'styled-components'
import './SidebarCollapsible.css'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { NavLink } from 'react-router-dom'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client'

import { useState, useEffect } from 'react'

import Toggle from 'react-toggle'

import { VENDOR_QUERY } from '../../../../graphql/VendorQueries.js'

import moment from 'moment'

const GET_VENDOR_INFO = gql`
  query GET_AVAILABILITY($name: String!) {
    getVendor(filter: { name: $name }) {
      name
      logoUrl
      website
      email
      facebook
      phone
      cutoffTime
      pickupInstruction
    }
  }
`

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
  /* background-color: #ffc8ba; */
  /* background: #ffeaea 0% 0% no-repeat padding-box; */
  color: black;
  width: 100%;
  /* padding: 0.5vh 0.5vw; */
  /* border-radius: 20px; */
  height: 46.1px;
  /* font-weight: 600; */
  /* font: normal normal normal 20px/12px Avenir; */
  font-size: 20px/12px;
  /* font-size: 20px; */
  font-family: 'Avenir';
  display: flex;
  text-align: left;

  flex-direction: row;
  align-items: center;
  margin: 6px 0px;

  /* NEW */
  background-color: ${props => (props.isClosed ? 'white' : '#ffeaea')};
  border-left: ${props => (props.isClosed ? '' : '9px solid #EA907A')};
  padding: ${props => (props.isClosed ? '9px' : '0px')};
`

const Img = styled.img`
  ${props =>
    props.logo &&
    css`
      grid-area: ImageSpace;
      height: 18vh;
      width: 18vh;
      border-radius: 50%;
      margin-top: 10px;
    `}
`

function MainMenuItem (props) {
  // Make IsExpanded prop true when the menu item is expanded by the user
  return (
    /* NEW */
    <MainMenuItemWrapper isClosed={props.isClosed}>
      {props.name}
      {/* {props.IsClosed ? (
        <IoIosArrowDown
          style={{ color: 'black', marginTop: '3px', marginLeft: '6px' }}
        />
      ) : (
        <IoIosArrowUp
          style={{ color: 'black', marginTop: '3px', marginLeft: '6px' }}
        />
      )} */}
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
        activeStyle={{ color: '#EA907A', fontWeight: '700' }}
      >
        {' '}
        {props.label}{' '}
      </StyledNavLink>
    </SubMenuItemWrapper>
  )
}

const Title = styled.h1`
  font-family: 'Avenir';
  font-weight: 'Book';
  font-size: 18px;
  text-align: center;
  text-decoration: none;
  letter-spacing: 0px;
  color: black;
`

const StyledText = styled.text`
  text-align: left;
  font-size: 13.4px;
  margin-left: 12.7px;
  margin-right: 18px;
`

const BottomWrapper = styled.div`
  padding-top: 374px;
  text-align: left;
  font-family: 'Avenir';
`

function SideBarItems () {
  const [storeStatus, setStoreStatus] = useState('Open')
  // get vendor data:
  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    variables: { vendor: 'Cohen House' }
  })

  if (vendor_loading) {
    return <p>Loading...</p>
  }
  if (vendor_error) {
    return <p>Error...</p>
  }

  // Get index of current day:
  const currentDay = moment().format('dddd')
  const index = vendor_data.getVendor.hours.findIndex(
    obj => obj.day === currentDay
  )

  console.log(vendor_data.getVendor.hours[index].isClosed)

  function handleToggleStoreStatus (inputStatus) {
    if (inputStatus === 'Open') {
      setStoreStatus('Closed')
    } else if (inputStatus === 'Closed') {
      setStoreStatus('Open')
    } else {
      console.log('Invalid store status')
    }
  }

  return (
    <SideBarItemsWrapper>
      {/* <Img logo src={vendorData.getVendor.logoUrl} /> */}
      <Title>Cohen House</Title>
      <StyledText>Store Status: {storeStatus}</StyledText>
      <Toggle
        defaultChecked={storeStatus}
        onChange={() => handleToggleStoreStatus(storeStatus)}
        className='toggleStyle'
      />
      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        /* NEW */
        trigger={<MainMenuItem name='Order Processing' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Order Processing' />}
      >
        <SubMenuItem path='/employee/openorders' label='Open Orders' />
        <SubMenuItem path='/employee/closedorders' label='Closed Orders' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Menu Management' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Menu Management' />}
      >
        <SubMenuItem path='/employee/items' label='Edit Items' />
        <SubMenuItem path='/employee/modifiers' label='Edit Modifiers' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Store Status' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Store Status' />}
      >
        <SubMenuItem path='/employee/set-basic-info' label='Set Basic Info' />
        <SubMenuItem path='/employee/set-store-hours' label='Set Store Hours' />
      </Collapsible>
      <BottomWrapper>
        <div>Help</div>
        <div>About</div>
      </BottomWrapper>
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
