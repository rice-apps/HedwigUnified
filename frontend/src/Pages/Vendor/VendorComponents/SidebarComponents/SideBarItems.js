import Collapsible from 'react-collapsible'
import styled, { css } from 'styled-components'
import './SidebarCollapsible.css'
// import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { NavLink } from 'react-router-dom'
import { gql, useQuery, useMutation } from '@apollo/client'

import Toggle from 'react-toggle'

import { VENDOR_QUERY } from '../../../../graphql/VendorQueries.js'

import moment from 'moment'
import { faBullseye } from '@fortawesome/free-solid-svg-icons'

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
  flex-direction: column;
  align-content: stretch;
  font-weight: 500;
`

const MainMenuItemWrapper = styled.div`
  color: ${props => (props.isClosed ? 'black' : '#EA907A')};
  font-weight: ${props => (props.isClosed ? 0 : 700)};
  width: 100%;
  height: 46.1px;
  font-size: 20px/12px;
  display: flex;
  text-align: left;

  flex-direction: row;
  align-items: center;
  margin-bottom: 7.7px;
  margin-top: 7.7px;
  margin-left: ${props => (props.isClosed ? '17.4px' : '0')};

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
    <MainMenuItemWrapper isClosed={props.isClosed}>
      {/* The margin is adjusted if the menu item is clicked due to style changes: */}
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
  margin-bottom: '10px';
  text-align: left;
  font-family: 'Avenir';
  margin-left: 26.4px;
`

function SideBarItems () {
  const [toggleIsClosed] = useMutation(UPDATE_VENDOR)

  // Get current hours for the vendor from the Open/Closed toggle:
  const {
    data: vendor_data,
    error: vendor_error,
    loading: vendor_loading
  } = useQuery(VENDOR_QUERY, {
    // vendor is still hard coded:
    variables: { vendor: 'Cohen House' }
  })

  if (vendor_loading) {
    return <p>Loading...</p>
  }
  if (vendor_error) {
    return <p>Error...</p>
  }

  // Get index of the current day to get isClosed value for current day:
  const currentDay = moment().format('dddd')
  const index = vendor_data.getVendor.hours.findIndex(
    obj => obj.day === currentDay
  )
  const originalHours = vendor_data.getVendor.hours

  // Similar function to onChangeIsClosed in EditHoursDashboard.js
  async function onChangeIsClosed (inputIsClosed) {
    // const originalHours = vendor_data.getVendor.hours
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

  console.log(originalHours[index].isClosed)

  return (
    <SideBarItemsWrapper>
      {/* <Img logo src={vendor_data.getVendor.logoUrl} /> */}
      <Title>Cohen House</Title>
      <div style={{ marginBottom: '26px' }}>
        <StyledText>
          Store Status: {originalHours[index].isClosed ? 'Closed' : 'Open'}
        </StyledText>
        <Toggle
          defaultChecked={originalHours[index].isClosed ? false : true}
          onChange={() => onChangeIsClosed(originalHours[index].isClosed)}
          icons={false}
          className='toggleStyle'
        />
      </div>
      {/* If user is on a url that collapsible will be open: */}
      <Collapsible
        classParentString='MainMenuCollapsible'
        closed={
          window.location.href.includes('openorders') ||
          window.location.href.includes('closedorders')
            ? undefined
            : true
        }
        open={
          window.location.href.includes('openorders') ||
          window.location.href.includes('closedorders')
            ? true
            : undefined
        }
        trigger={<MainMenuItem name='Order Processing' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Order Processing' />}
      >
        <SubMenuItem path='/employee/openorders' label='Open Orders' />
        <SubMenuItem path='/employee/closedorders' label='Closed Orders' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        closed={
          window.location.href.includes('items') ||
          window.location.href.includes('modifiers')
            ? undefined
            : true
        }
        open={
          window.location.href.includes('items') ||
          window.location.href.includes('modifiers')
            ? true
            : undefined
        }
        trigger={<MainMenuItem name='Menu Management' isClosed />}
        triggerWhenOpen={<MainMenuItem name='Menu Management' />}
      >
        <SubMenuItem path='/employee/items' label='Edit Items' />
        <SubMenuItem path='/employee/modifiers' label='Edit Modifiers' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        closed={
          window.location.href.includes('set-basic-info') ||
          window.location.href.includes('set-store-hours')
            ? undefined
            : true
        }
        open={
          window.location.href.includes('set-basic-info') ||
          window.location.href.includes('set-store-hours')
            ? true
            : undefined
        }
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
