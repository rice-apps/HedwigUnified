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
          currency
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

const GET_ORDER_TRACKERS = gql`
  query GET_ORDER_TRACKERS($sort:SortFindManyOrderTrackerInput, $filter: FilterFindManyOrderTrackerInput){
    getOrderTrackers(sort:$sort, filter:$filter){
      paymentId
      dataSource
      orderId
      paymentType
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

const COMPLETE_PAYMENT = gql`
  mutation COMPLETE_PAYMENT(
    $vendor: String!
    $paymentId: String!
    $source: DataSourceEnum!
    $money: MoneyInput!
  ){
    completePayment(
      vendor: $vendor
      paymentId: $paymentId
      source: $source
      money: $money
    ){
      order
      customer
      total {
        amount
        currency
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
  const vendorId = ["L2N8DA44TZK8E"]
  const currentUser = JSON.parse(localStorage.getItem('userProfile'))

  const { data: allOrders, loading, error, subscribeToMore } = useQuery(
    FIND_ORDERS,
    {
      variables: { location: vendorId, vendor: currentUser.vendor[0] }
    }
  )
  const { data: order_data, loading: order_loading, error: order_error } = useQuery(GET_ORDER_TRACKERS, {
    variables: {sort: "_ID_DESC", filter:{"paymentType":"CREDIT"}}
  })
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const [completePayment] = useMutation(COMPLETE_PAYMENT)

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
  if(order_loading) {
    return <LoadingPage />
  }
  if (order_error) {
    return <p style={{fontSize: '2vh'}}>Error...{order_error.message}</p>
  }

  const handleOrderClick = (order, orderState, orderTrackers=null) => {
    updateOrder({
      variables: {
        vendor: currentUser.vendor[0],
        orderId: order.id,
        uid: order.fulfillment.uid,
        state: orderState
      }
    })
    if(orderTrackers){
      const orderTracker = orderTrackers.filter(orderTracker => orderTracker.orderId === order.id)[0]
      completePayment({
        variables: {
          vendor: currentUser.vendor,
          paymentId: orderTracker.paymentId,
          source: orderTracker.dataSource,
          money: {amount: order.total.amount, currency: order.total.currency}
        }
      })
    }
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

  return (
    <OrderDashboardWrapper>
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
              handleClick={() => handleOrderClick(order, 'RESERVED', order_data.getOrderTrackers)}
              cancelClick={() => handleOrderClick(order, 'CANCELED')}
              buttonStatus='NEW'
              newOrder
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
            />
          ))}
      </ReadyOrderSpaceWrapper>
    </OrderDashboardWrapper>
  )
}

export default OrderDashboard
