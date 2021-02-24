import Collapsible from 'react-collapsible'
import styled from 'styled-components/macro'
import './SidebarCollapsible.css'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { NavLink } from 'react-router-dom'

import { CSVLink, CSVDownload } from "react-csv"
import { gql, useQuery } from '@apollo/client'

const FIND_ORDERS = gql`
  query FIND_ORDERS($location: [String!]!, $vendor: String!) {
    findOrders(locations: $location, vendor: $vendor) {
      orders {
        id
        studentId
        cohenId
        submissionTime
        customer {
          name
          email
          phone
        }
        items {
          name
          quantity
          variationName
          modifiers {
            name
            basePriceMoney {
              amount
            }
            totalPriceMoney {
              amount
            }
          }
          totalMoney {
            amount
          }
          totalTax {
            amount
          }
        }
        total {
          amount
        }
        totalTax {
          amount
        }
        totalDiscount {
          amount
        }
        fulfillment {
          uid
          state
          pickupDetails {
            pickupAt
          }
        }
      }
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
  justify-content: space-between;
`

const DownloadWrapper = styled.div`
  background-color: #ffc8ba;
  color: black;
  width: 100%;
  padding: 0.5vh 0.5vw;
  border-radius: 20px;
  font-weight: 600;
  font-size: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 6px 0px;
  justify-content: space-between;
`;

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
  text-decoration: none;
  text-align: left;
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

  /* NEW FOR TURNING ORDERS INTO CSV in feature/orders-to-array */
  const vendorId = ['LBBZPB7F5A100']
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))

  const { data: allOrders, loading, error, subscribeToMore } = useQuery(
    FIND_ORDERS,
    {
      variables: { location: vendorId, vendor: currentUser.vendor }
    }
  )

  if (loading) {
    return "Loading..."
  }
  if (error) {
    return <p style={{ fontSize: '2vh' }}>ErrorD...{error.message}</p>
  }

  // Creates the order data to populate a CSV file
  function createCsvString(orderArray) {
    const csvString = [
      [
        "Cohen Id",
        "Customer Email",
        "Customer Name",
        "Customer Phone",
        "Pickup Time",
        "Fulfilled Status",
        "ID",
        "Items",
        "Student Id",
        "Submission Time",
        "Total",
        "Total Discount",
        "Total Tax"
      ],
      ...orderArray.map(order => [
        order.cohenId,
        order.customer.email, 
        order.customer.name, 
        order.customer.phone, 
        order.fulfillment.pickupDetails.pickupAt,
        order.fulfillment.state,
        order.id,
        [...order.items.map(order => order.name)],
        order.studentId,
        order.submissionTime,
        order.total.amount,
        order.totalDiscount.amount,
        order.totalTax.amount
      ]
      )
    ]
    .map(e => e.join(",")) 
    .join("\n");

    return csvString;
  }

  const newOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'PROPOSED'
  )

  const acceptedOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'RESERVED'
  )

  const readyOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'PREPARED'
  )

  const completedOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'COMPLETED'
  )
  /* END NEW */

  return (
    <SideBarItemsWrapper>
      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Order Processing' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Order Processing' />
        }
      >
        <SubMenuItem path='/employee/openorders' label='Open Orders' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Menu Management' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Menu Management' />
        }
      >
        <SubMenuItem path='/employee/items' label='Edit Items' />
      </Collapsible>

      <Collapsible
        classParentString='MainMenuCollapsible'
        open
        trigger={<MainMenuItem name='Store Information' IsClosed />}
        triggerWhenOpen={
          <MainMenuItem name='Store Information' />
        }
      >
        <SubMenuItem path='/employee/set-basic-info' label='Set Basic Info' />
        <SubMenuItem path='/employee/set-store-hours' label='Set Store Hours' />
      </Collapsible>

      {/* NEW FOR TURNING ORDERS INTO CSV in feature/orders-to-array */ }
      {/* <CSVLink data={newOrders}>Download New Orders</CSVLink>
      <CSVLink data={acceptedOrders}>Download Accepted Orders</CSVLink>
      <CSVLink data={readyOrders}>Download Ready Orders</CSVLink> */}
      <DownloadWrapper><CSVLink data={createCsvString(completedOrders)}>Download Completed Orders</CSVLink></DownloadWrapper>
      {/* END NEW */ }

      <BottomMenuItem path='/employee/faq' label='Help' />
    </SideBarItemsWrapper>
  )
}

export default SideBarItems
