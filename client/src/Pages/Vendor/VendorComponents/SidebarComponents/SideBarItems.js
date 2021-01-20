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

const UPDATE_VENDOR = gql`
  mutation UPDATE_VENDOR($hours: [UpdateOneVendorBusinessHoursInput]!) {
    updateVendor(record: { hours: $hours }, filter: { name: "Cohen House" }) {
      record {
        hours {
          start
          end
        }
      }
    }
  }
`

const SideBarItemsWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  /* background-color: green; */
  flex-direction: column;
  align-content: stretch;
  /* margin-top: 26px; */
  font-weight: 500;
`

const MainMenuItemWrapper = styled.div`
  /* background-color: #ffc8ba; */
  /* background: #ffeaea 0% 0% no-repeat padding-box; */
  color: ${props => (props.isClosed ? 'black' : '#EA907A')};
  font-weight: ${props => (props.isClosed ? 0 : 700)};
  width: 100%;
  height: 46.1px;
  font-size: 20px/12px;
  display: flex;
  text-align: left;

  flex-direction: row;
  align-items: center;
  /* margin: 6px 0px; */
  margin-bottom: 7.7px;
  margin-top: 7.7px;
  margin-left: ${props => (props.isClosed ? '17.4px' : '0')};

  /* NEW */
  background-color: ${props => (props.isClosed ? 'white' : '#ffeaea')};
  border-left: ${props => (props.isClosed ? '' : '6px solid #EA907A')};
  padding: ${props => (props.isClosed ? '9px' : '0px')};
`

const Img = styled.img`
  ${props =>
    props.logo &&
    css`
      grid-area: ImageSpace;
      height: 62px;
      width: 62px;
      border-radius: 50%;
      margin-top: 37.4px;
    `}
`

function MainMenuItem (props) {
  // Make IsExpanded prop true when the menu item is expanded by the user
  return (
    /* NEW */
    <MainMenuItemWrapper isClosed={props.isClosed}>
      <div style={props.isClosed ? {} : { marginLeft: '17.4px' }}>
        {props.name}
      </div>
    </MainMenuItemWrapper>
  )
}

const SubMenuItemWrapper = styled.div`
  background-color: white;
  margin-left: 42.7px;
  width: 80%;
  padding: 0.85vh;
  /* 0.4vw */
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
  margin-right: 8px;
  margin-top: 8.7px;
  margin-bottom: 26px;
  width: 75.5px;
`

const BottomWrapper = styled.div`
  /* padding-top: 215px; */
  margin-bottom: '10px';
  text-align: left;
  font-family: 'Avenir';
  margin-left: 26.4px;
`

function SideBarItems () {
  const [storeStatus, setStoreStatus] = useState('Open')

  const [toggleIsClosed, { data, loading, error }] = useMutation(UPDATE_VENDOR)

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

  async function onChangeIsClosed (inputIsClosed) {
    const originalHours = vendor_data.getVendor.hours
    const updatedHours = [...originalHours]
    // This index is the index of the day! should reflect what day the user clicks to edit:
    const updatedDay = { ...updatedHours[index] }
    updatedDay.isClosed = !inputIsClosed

    updatedHours[index] = updatedDay
    updatedHours.map((day, index) => {
      const dayCopy = { ...updatedHours[index] }
      delete dayCopy['__typename']
      updatedHours[index] = dayCopy
    })

    await toggleIsClosed({
      variables: {
        name: 'Cohen House',
        hours: updatedHours
      }
    })
    window.location.reload()
  }

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
      <div style={{ marginBottom: '26px' }}>
        <StyledText>
          Store Status:{' '}
          {vendor_data.getVendor.hours[index].isClosed ? 'Closed' : 'Open'}
        </StyledText>
        <Toggle
          defaultChecked={
            vendor_data.getVendor.hours[index].isClosed ? false : true
          }
          onChange={() =>
            onChangeIsClosed(vendor_data.getVendor.hours[index].isClosed)
          }
          icons={false}
          className='toggleStyle'
        />
      </div>
      <Collapsible
        classParentString='MainMenuCollapsible'
        closed
        /* NEW */
        trigger={<MainMenuItem name='Order Processing' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Order Processing' />}
      >
        <SubMenuItem path='/employee/openorders' label='Open Orders' />
        <SubMenuItem path='/employee/closedorders' label='Closed Orders' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        closed
        trigger={<MainMenuItem name='Menu Management' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Menu Management' />}
      >
        <SubMenuItem path='/employee/items' label='Edit Items' />
        <SubMenuItem path='/employee/modifiers' label='Edit Modifiers' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        closed
        trigger={<MainMenuItem name='Store Status' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Store Status' />}
      >
        <SubMenuItem path='/employee/set-basic-info' label='Set Basic Info' />
        <SubMenuItem path='/employee/set-store-hours' label='Set Store Hours' />
      </Collapsible>
      <div>
        <BottomWrapper
          style={{
            position: 'absolute',
            bottom: 0,
            marginBottom: '12px'
          }}
        >
          <div style={{ marginBottom: '8px' }}>Help</div>
          <div>About</div>
        </BottomWrapper>
      </div>
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
