import React from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router'
import './order.css'
import OrderCard from './OrderCard.js'
import {
  GET_PAST_ORDERS,
} from '../../../graphql/Queries.js'
import Modal from 'react-modal'
Modal.bind('#app')

const OrderList = ({}) => {
  const history = useHistory()

  const {
    data: orderData,
    loading: orderLoading,
    error: orderError
  } = useQuery(GET_PAST_ORDERS, { fetchPolicy: 'network-only' })

  console.log("ORDERS", orderData);

  if (orderError) return <p>Errors...</p>
  if (orderLoading) return <p>Loading...</p>
  if (orderData===null) return <p>No data...</p>

  console.log("ORDER2", orderData)
  console.log("ORDER3", orderData.findOrders)
  console.log("ORDERS4", orderData.findOrders.orders)

  const orders = orderData.findOrders.orders;

  return (
    <div className='orderlist'>
      {orders.map(order => {
        return <OrderCard order={order} />
      })}
    </div>
  )
}

export default OrderList
