import { useEffect } from 'react'
import { useQuery, useMutation, gql } from '@apollo/client'
import _ from 'lodash'

// "or" filter: https://github.com/graphql-compose/graphql-compose-mongoose/issues/93
const ORDERS_QUERY = gql`
  query OrdersForVendor($vendor: MongoID) {
    orderMany(
      filter: {
        vendor: $vendor
        OR: [{ fulfillment: Placed }, { fulfillment: Preparing }]
      }
    ) {
      _id
      __typename
      user {
        name
      }
      items {
        product {
          name
          price
        }
        addons {
          name
          price
        }
        comments
      }
      createdAt
      fulfillment
    }
  }
`

const ORDER_SUBSCRIPTION = gql`
  subscription($vendor: ID!) {
    orderChanged(vendor: $vendor) {
      _id
      __typename
      user {
        name
      }
      items {
        product {
          name
          price
        }
        addons {
          name
          price
        }
        comments
      }
      createdAt
      fulfillment
    }
  }
`

const ORDER_FULFILLMENT_MUTATE = gql`
  mutation($id: MongoID!, $fulfillment: EnumOrdersFulfillment) {
    orderUpdateOne(
      filter: { _id: $id }
      record: { fulfillment: $fulfillment }
    ) {
      record {
        _id
        __typename
        fulfillment
      }
      recordId
    }
  }
`
const Order = ({ order }) => {
  // Deconstructing elements from the order object
  // EVERYTHING HERE IS FROM THE GRAPHQL QUERY
  const { _id, user, items, createdAt, fulfillment } = order
  const vendor = '5ecf473841ccf22523280c3b'

  // Helper function to update local list of orders without having to refetch orders, depending on fulfillment type
  const localUpdateOrders = (cache, updatedOrder) => {
    // The query must always be the exact same as the initial query made!! Including variables!!
    const variables = {
      vendor: vendor,
      or: [{ fulfillment: 'Placed' }, { fulfillment: 'Preparing' }]
    }
    const { orderMany: orders } = cache.readQuery({
      query: ORDERS_QUERY,
      variables
    })

    let newOrders
    switch (updatedOrder.record.fulfillment) {
      case 'Preparing':
        // Deep copy of orders so that we can pass in an updated version to the writeQuery
        newOrders = _.cloneDeep(orders)
        // Find index of order marked preparing
        const updatedOrderIndex = newOrders.findIndex(
          order => order._id == updatedOrder.recordId
        )
        // Update the fulfillment property of the corresponding local order to update
        newOrders[updatedOrderIndex].fulfillment =
          updatedOrder.record.fulfillment
        break
      case 'Cancelled':
      case 'Ready':
        newOrders = orders.filter(order => order._id != updatedOrder.recordId)
        break
      default:
        newOrders = orders
    }

    return cache.writeQuery({
      query: ORDERS_QUERY,
      variables,
      data: { orderMany: newOrders }
    })
  }

  // Typically useMutation returns a tuple: [markReady, { data } ] but we don't need { data } so we DESTRUCTURE using the [x, ] pattern
  const [markReady] = useMutation(ORDER_FULFILLMENT_MUTATE, {
    variables: { id: _id, fulfillment: 'Ready' },
    update: (cache, { data: { orderUpdateOne } }) =>
      localUpdateOrders(cache, orderUpdateOne)
  })

  const [markCancelled] = useMutation(ORDER_FULFILLMENT_MUTATE, {
    // TODO: Exact same update as before; let's collapse them into the same function
    variables: { id: _id, fulfillment: 'Cancelled' },
    update: (cache, { data: { orderUpdateOne } }) =>
      localUpdateOrders(cache, orderUpdateOne)
  })

  const [markPreparing] = useMutation(ORDER_FULFILLMENT_MUTATE, {
    variables: { id: _id, fulfillment: 'Preparing' },
    update: (cache, { data: { orderUpdateOne } }) =>
      localUpdateOrders(cache, orderUpdateOne)
  })

  return (
    <div>
      <h1>Order ID: {_id}</h1>
      <p>Ordered By: {user.name}</p>
      <p># of Order Items: {items.length}</p>
      <p>Ordered At: {createdAt}</p>
      <p>Items: {items.map(item => item.product.name).join(', ')}</p>
      <p>Fulfillment Status: {fulfillment}</p>
      <button onClick={() => markReady()}>Mark Completed.</button>
      <button onClick={() => markCancelled()}>Mark Cancelled.</button>
      <button onClick={() => markPreparing()}>Mark Preparing</button>
    </div>
  )
}

const Orders = () => {
  const vendor = '5ecf473841ccf22523280c3b'
  // Following this: https://www.apollographql.com/docs/react/v3.0-beta/data/subscriptions/#subscribing-to-updates-for-a-query
  // First query the data we want (active orders) and then subscribe for more as they roll in
  const { loading, error, data, subscribeToMore } = useQuery(ORDERS_QUERY, {
    variables: { vendor: vendor }
  })

  // Setup subscribeToMore
  const subscription = () =>
    subscribeToMore({
      document: ORDER_SUBSCRIPTION,
      variables: { vendor: vendor },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev // no new data, return existing orders
        // Get new/updated order from subscription
        const newFeedOrder = subscriptionData.data.orderChanged
        // TODO: ADD LOGIC FOR REMOVING AN ORDER IF THE USER CANCELS IT

        // Check if the order is already in the list
        const orderIndex = prev.orderMany.findIndex(
          order => order._id == newFeedOrder._id
        )
        if (orderIndex > -1) {
          // Found, replace that index with new order
          const newOrderMany = [...prev.orderMany]
          newOrderMany[orderIndex] = newFeedOrder
          return Object.assign({}, prev, { orderMany: newOrderMany })
        } else {
          // Not found, add to end of the list
          return Object.assign({}, prev, {
            orderMany: [...prev.orderMany, newFeedOrder]
          })
        }
      }
    })

  // Since the second arg is [], this will execute just once, which is what we need.
  useEffect(() => {
    // Only runs once, don't run if undefined
    if (subscribeToMore) {
      subscription()
    }
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Orders.</h1>
      <ul>
        {data.orderMany.map(order => {
          return <Order order={order} />
        })}
      </ul>
    </div>
  )
}

export default Orders
