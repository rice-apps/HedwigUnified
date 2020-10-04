
import React from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import {
  OrderDashboardWrapper,
  GeneralTitleWrapper,
  NewOrderTitleWrapper,
  AcceptedOrderTitleWrapper,
  ReadyOrderTitleWrapper,
  NewOrderSpaceWrapper,
  AcceptedOrderSpaceWrapper,
  ReadyOrderSpaceWrapper,
  MakeDashboardTitle
} from './DashboardComponents.js'
import OrderCard from './OrderCard.js'
import { gql, useQuery } from '@apollo/client'

const ColumnWrapper = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  overflow: scroll;
  padding-right: 30px;
  height: 100%;

`

const FIND_ORDERS = gql`
  query FIND_ORDERS($location: [String!]!) {
    findOrders(locations: $location) {
      orders{
        id
        customer
        items{
          name
          quantity
          variation_name
          modifiers{
            name
            base_price_money{
              amount
        	  }
            total_price_money{
  				    amount
        	  }
      	  }
          total_money{
            amount
      	  }
          total_tax{
            amount
      	  }
    	  }
        total{
          amount
    	  }
        totalTax{
          amount
        }
        totalDiscount{
          amount
        }
        fulfillmentStatus
    }
  }
}
`


function OrderDashboard () {
  const vendorId = ["FMXAFFWJR95WC"]
  const { data: allOrders, loading, error } = useQuery(FIND_ORDERS, { variables: { location: vendorId } })
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error...</p>
  }
  console.log(allOrders)
  console.log(allOrders.orders)


  // if (!loading && orders) {
  //     const { order } = orders.items
  //     order.forEach(setElement => {
  //       order_list.push(setElement)
  //     })
  //   }


  return (
    <OrderDashboardWrapper>
      <NewOrderTitleWrapper>
        <MakeDashboardTitle name='New' quantity='2' />
      </NewOrderTitleWrapper>

      <NewOrderSpaceWrapper>
        {allOrders && (
          allOrders.findOrders.orders.filter(order => order.fulfillmentStatus === "PROPOSED").map(order => <OrderCard />))}
      </NewOrderSpaceWrapper>

      <AcceptedOrderTitleWrapper>
        <MakeDashboardTitle name='Accepted' quantity='5' />
      </AcceptedOrderTitleWrapper>
      <AcceptedOrderSpaceWrapper>

        {allOrders && (
          allOrders.findOrders.orders.filter(order => order.fulfillmentStatus === "RESERVED").map(order => <OrderCard />))}

      </AcceptedOrderSpaceWrapper>

      <ReadyOrderTitleWrapper>
        <MakeDashboardTitle name='Ready' quantity='7' />
      </ReadyOrderTitleWrapper>
      <ReadyOrderSpaceWrapper>
        {allOrders && (
          allOrders.findOrders.orders.filter(order => order.fulfillmentStatus === "COMPLETED").map(order => <OrderCard />))}
      </ReadyOrderSpaceWrapper>
    </OrderDashboardWrapper>


  )
}

export default OrderDashboard

