import { useEffect } from 'react'
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
import { useQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag.macro'
import { LoadingPage } from './../../../../components/LoadingComponents'

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
const UPDATE_ORDER = gql`
  mutation UPDATE_ORDER(
    $orderId: String!
    $uid: String!
    $state: FulFillmentStatusEnum!
    $vendor: String!
  ) {
    updateOrder(
      orderId: $orderId
      vendor: $vendor
      record: { fulfillment: { uid: $uid, state: $state } }
    ) {
      fulfillment {
        uid
        state
      }
    }
  }
`

const ORDER_CREATED = gql`
  subscription {
    orderCreated {
      id
      studentId
      cohenId
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
`

const ORDER_UPDATED = gql`
  subscription {
    orderUpdated {
      id
      studentId
      cohenId
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
`

function OrderDashboard () {
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))
  const vendorId =
    currentUser.vendor[0] === 'Cohen House'
      ? ['LBBZPB7F5A100']
      : currentUser.vendor[0] === 'Test Account CMT'
      ? ['L2N8DA44TZK8E']
      : currentUser.vendor[0] === 'East West Tea'
      ? ['CF05Q06RWXA1D']
      : currentUser.vendor[0] === 'East West Test'
      ? ['LCW8P8CZEVNMQ']
      : null

  const { data: allOrders, loading, error, subscribeToMore } = useQuery(
    FIND_ORDERS,
    {
      variables: { location: vendorId, vendor: currentUser.vendor[0] }
    }
  )
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const isIsolation = currentUser.vendor[0] == 'Test Account CMT'
  console.log(isIsolation)
  useEffect(() => {
    const unsubscribeToNewOrders = subscribeToMore({
      document: ORDER_CREATED,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }

        console.log(prev)
        console.log(subscriptionData)

        const newOrderItem = subscriptionData.data.orderCreated
        return Object.assign({}, prev, {
          findOrders: {
            __typename: 'FindManyOrderPayload',
            orders: [
              { __typename: 'Order', ...newOrderItem },
              ...prev.findOrders.orders
            ]
          }
        })
      }
    })

    const unsubscribeToUpdatedOrders = subscribeToMore({
      document: ORDER_UPDATED
    })

    return () => {
      unsubscribeToNewOrders()
      unsubscribeToUpdatedOrders()
    }
  })

  if (loading) {
    return <LoadingPage />
  }
  if (error) {
    return <p style={{ fontSize: '2vh' }}>ErrorD...{error.message}</p>
  }

  const handleOrderClick = (order, orderState) => {
    updateOrder({
      variables: {
        vendor: currentUser.vendor[0],
        orderId: order.id,
        uid: order.fulfillment.uid,
        state: orderState
      }
    })
    console.log(order.name, order.id)
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
  console.log('ACCEPTED', acceptedOrders)
  const readyOrders = allOrders.findOrders.orders.filter(
    order => order.fulfillment.state === 'PREPARED'
  )

  console.log('NEWORDERS', newOrders)

  return (
    <OrderDashboardWrapper isIsolation={isIsolation}>
      <NewOrderTitleWrapper>
        <MakeDashboardTitle name='New' quantity={newOrders.length} />
      </NewOrderTitleWrapper>
      <NewOrderSpaceWrapper>
        {allOrders &&
          newOrders.map(order => (
            <OrderCard
              key={order.id}
              id={order.id}
              studentId={order.studentId}
              cohenId={order.cohenId}
              customerName={order.customer.name}
              phone={order.customer.phone}
              email={order.customer.email}
              submissionTime={order.submissionTime}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
              orderCost={order.total.amount / 100}
              orderTotal={(order.total.amount + order.totalTax.amount) / 100}
              fulfillment={order.fulfillment.state}
              handleClick={() => handleOrderClick(order, 'RESERVED')}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='NEW'
              isIsolation={isIsolation}
              newOrder
            />
          ))}
      </NewOrderSpaceWrapper>

      <AcceptedOrderTitleWrapper>
        <MakeDashboardTitle name='Accepted' quantity={acceptedOrders.length} />
      </AcceptedOrderTitleWrapper>
      <AcceptedOrderSpaceWrapper isIsolation={isIsolation}>
        {allOrders &&
          acceptedOrders.map(order => (
            <OrderCard
              key={order.id}
              id={order.id}
              studentId={order.studentId}
              cohenId={order.cohenId}
              customerName={order.customer.name}
              phone={order.customer.phone}
              email={order.customer.email}
              pickupTime={order.fulfillment.pickupDetails.pickupAt}
              items={order.items}
              submissionTime={order.submissionTime}
              orderCost={order.total.amount / 100}
              orderTotal={(order.total.amount + order.totalTax.amount) / 100}
              handleClick={() => handleOrderClick(order, 'PREPARED')}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='ACCEPTED'
              isIsolation={isIsolation}
            />
          ))}
      </AcceptedOrderSpaceWrapper>
      {isIsolation ? null : (
        <ReadyOrderTitleWrapper>
          <MakeDashboardTitle name='Ready' quantity={readyOrders.length} />
        </ReadyOrderTitleWrapper>
      )}
      {isIsolation ? null : (
        <ReadyOrderSpaceWrapper>
          {allOrders &&
            readyOrders.map(order => (
              <OrderCard
                key={order.id}
                id={order.id}
                studentId={order.studentId}
                cohenId={order.cohenId}
                customerName={order.customer.name}
                phone={order.customer.phone}
                email={order.customer.email}
                pickupTime={order.fulfillment.pickupDetails.pickupAt}
                submissionTime={order.submissionTime}
                items={order.items}
                orderCost={order.total.amount / 100}
                orderTotal={(order.total.amount + order.totalTax.amount) / 100}
                handleClick={() => handleOrderClick(order, 'COMPLETED')}
                cancelClick={() => handleOrderClick(order, 'CANCELED')}
                buttonStatus='READY'
                isIsolation={isIsolation}
              />
            ))}
        </ReadyOrderSpaceWrapper>
      )}
    </OrderDashboardWrapper>
  )
}

export default OrderDashboard
