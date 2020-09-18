import React from 'react'
import { useQuery } from '@apollo/client'
import { useHistory } from 'react-router'
import './order.css'
import OrderDetail from './OrderDetail.js'
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

  if (orderError) return <p>Errors...</p>
  if (orderLoading) return <p>Loading...</p>
  if (!orderData) return <p>No data...</p>

  const orders = orderData.orderMany

  return (
    <div className='orderlist'>
      {orders.map(order => {
        return <OrderDetail order={order} />
      })}
    </div>
  )
}

export default OrderList
