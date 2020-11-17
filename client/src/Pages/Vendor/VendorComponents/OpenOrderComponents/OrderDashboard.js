import { useEffect } from 'react';
import styled from 'styled-components'
import {
  OrderDashboardWrapper,
  NewOrderTitleWrapper,
  AcceptedOrderTitleWrapper,
  ReadyOrderTitleWrapper,
  NewOrderSpaceWrapper,
  AcceptedOrderSpaceWrapper,
  ReadyOrderSpaceWrapper,
  MakeDashboardTitle
} from './DashboardComponents.js'
import OrderCard from './OrderCard.js'
import { gql, useQuery, useMutation } from '@apollo/client'

const FIND_ORDERS = gql`
  query FIND_ORDERS($location: [String!]!) {
    findOrders(locations: $location) {
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
          variation_name
          modifiers {
            name
            base_price_money {
              amount
            }
            total_price_money {
              amount
            }
          }
          total_money {
            amount
          }
          total_tax {
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
const UPDATE_ORDER = gql`
  mutation UPDATE_ORDER(
    $orderId: String!
    $uid: String!
    $state: FulFillmentStatusEnum!
  ) {
    updateOrder(
      orderId: $orderId
      record: { fulfillment: { uid: $uid, state: $state } }
    ) {
      fulfillment {
        state
      }
    }
  }
`

const ORDER_CREATED = gql`
  subscription {
    orderCreated {
      id
      customer {
        name
        email
        phone
      }
      items {
        name
        quantity
        variation_name
        modifiers {
          name
          base_price_money {
            amount
          }
          total_price_money {
            amount
          }
        }
        total_money {
          amount
        }
        total_tax {
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
`

function OrderDashboard () {
  const vendorId = ['FMXAFFWJR95WC']
  const { data: allOrders, loading, error, subscribeToMore } = useQuery(
    FIND_ORDERS,
    {
      variables: { location: vendorId }
    }
  )
  const [updateOrder] = useMutation(UPDATE_ORDER)

  useEffect(() => {
    const unsubscribeToNewOrders = subscribeToMore({
      document: ORDER_CREATED
    })

    return () => {
      unsubscribeToNewOrders()
    }
  })

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error...</p>
  }
  console.log(allOrders)
  console.log(allOrders.orders)

  const handleOrderClick = (order, orderState) => {
    updateOrder({
      variables: {
        orderId: order.id,
        uid: order.fulfillment.uid,
        state: orderState
      }
    })
    console.log('button was pressed')
  }
  // if (!loading && orders) {
  //     const { order } = orders.items
  //     order.forEach(setElement => {
  //       order_list.push(setElement)
  //     })
  //   }

  const newOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'PROPOSED'
  )
  const acceptedOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'RESERVED'
  )
  const readyOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'PREPARED'
  )

  return (
    <OrderDashboardWrapper>
      <NewOrderTitleWrapper>
        <MakeDashboardTitle name='New' quantity={newOrders.length} />
      </NewOrderTitleWrapper>

      <NewOrderSpaceWrapper>
        {allOrders &&
          newOrders.map(order => (
            <OrderCard
              customerName={order.customer.name}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
              orderCost={order.total.amount / 100}
              orderTotal={(order.total.amount + order.totalTax.amount) / 100}
              fulfillment={order.fulfillment.state}
              handleClick={() => handleOrderClick(order, 'RESERVED')}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='NEW'
            />
          ))}
      </NewOrderSpaceWrapper>

      <AcceptedOrderTitleWrapper>
        <MakeDashboardTitle name='Accepted' quantity={acceptedOrders.length} />
      </AcceptedOrderTitleWrapper>
      <AcceptedOrderSpaceWrapper>
        {allOrders &&
          acceptedOrders.map(order => (
            <OrderCard
              customerName={order.customer.name}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
              orderCost={order.total.amount / 100}
              orderTotal={(order.total.amount + order.totalTax.amount) / 100}
              handleClick={() => handleOrderClick(order, 'PREPARED')}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='ACCEPTED'
            />
          ))}
      </AcceptedOrderSpaceWrapper>

      <ReadyOrderTitleWrapper>
        <MakeDashboardTitle name='Ready' quantity={readyOrders.length} />
      </ReadyOrderTitleWrapper>
      <ReadyOrderSpaceWrapper>
        {allOrders &&
          readyOrders.map(order => (
            <OrderCard
              customerName={order.customer.name}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
              orderCost={order.total.amount / 100}
              orderTotal={(order.total.amount + order.totalTax.amount) / 100}
              handleClick={() => handleOrderClick(order, 'COMPLETED')}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='READY'
            />
          ))}
      </ReadyOrderSpaceWrapper>
    </OrderDashboardWrapper>
  )
}

export default OrderDashboard
