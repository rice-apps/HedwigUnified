import { useQuery } from '@apollo/client'
import {
  DashboardWrapper,
  TitleWrapper,
  MakeClosedDashboardLabels,
  ClosedOrdersSpaceWrapper,
  MakeIndividualClosedOrder
} from './ClosedDashboardComponents.js'
import { useState } from 'react'
import { IconContext } from 'react-icons'
import Dropdown from 'react-dropdown'
import gql from 'graphql-tag.macro'
import 'react-dropdown/style.css'
import styled from 'styled-components/macro'

const DropDownContainer = styled('div')`
  width: 10vh;
  margin: 0 auto;
`

const DropdownWrapper = styled('div')`
  margin-bottom: 0.8em;
  margin-left: 10vw;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  font-size: 1.2vh;
  color: #3faffa;
  background: #ffffff;
`

const DropDownListContainer = styled('div')``

const DropDownList = styled('ul')`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: #3faffa;
  font-size: 1.3rem;
  font-weight: 500;
  &:first-child {
    padding-top: 0.8em;
  }
`

const ListItem = styled('li')`
  list-style: none;
  margin-bottom: 0.8em;
`

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const GET_COMPLETED_ORDERS = gql`
  query FIND_COMPLETED_ORDERS(
    $location: [String!]!
    $filter: FilterOrderInput!
  ) {
    findOrders(locations: $location, filter: $filter) {
      orders {
        id
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
          }
          totalMoney {
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
          pickupDetails {
            pickupAt
          }
        }
      }
    }
  }
`
function ClosedOrderDashboard () {
  const vendorId = ['LBBZPB7F5A100']
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  console.log(today)

  const [filter, setFilter] = useState({
    fulfillmentFilter: { fulfillmentStates: 'COMPLETED' }
  })
  const { data, loading, error } = useQuery(GET_COMPLETED_ORDERS, {
    variables: { location: vendorId, filter: filter }
  })
  if (error) return <p>Error!</p>
  if (loading) return <p>Waiting...</p>
  if (!data) return <p> No closed orders </p>

  const onSelect = option => {
    if (option === 'All') {
      setFilter({ fulfillmentFilter: { fulfillmentStates: 'COMPLETED' } })
    } else {
      setFilter({
        fulfillmentFilter: { fulfillmentStates: 'COMPLETED' },
        dateTimeFilter: { closed_at: { start_at: yesterday } }
      })
    }
  }

  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: 'middle', marginBottom: '2px' } }}
    >
      <DashboardWrapper>
        <HeaderWrapper>
          <TitleWrapper>Closed Orders</TitleWrapper>
          <DropdownWrapper>
            <Dropdown
              style={{ color: '#3faffa' }}
              options={['All', 'Today']}
              onChange={onSelect}
              placeholder='Select an option'
            />
          </DropdownWrapper>
        </HeaderWrapper>
        <MakeClosedDashboardLabels />
        <ClosedOrdersSpaceWrapper>
          {data.findOrders.orders.map(order => (
            <MakeIndividualClosedOrder
              customerName={order.customer.name}
              orderTime='October 5th at 6:45PM'
              orderStatus='Completed'
              paymentMethod='Membership'
              price={`$${order.total.amount / 100}`}
              phoneNumber={order.customer.phone}
              email={order.customer.email}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
            />
          ))}
          <MakeIndividualClosedOrder customerName='Sally' />
        </ClosedOrdersSpaceWrapper>
      </DashboardWrapper>
    </IconContext.Provider>
  )
}

export default ClosedOrderDashboard
