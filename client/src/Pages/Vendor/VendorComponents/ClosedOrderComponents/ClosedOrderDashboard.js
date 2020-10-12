import React from "react";
import { gql, useQuery } from "@apollo/client"
import {
  DashboardWrapper,
  TitleWrapper,
  MakeClosedDashboardLabels,
  ClosedOrdersSpaceWrapper,
  MakeIndividualClosedOrder
} from "./ClosedDashboardComponents.js";
import { IconContext } from "react-icons";

const GET_COMPLETED_ORDERS = gql`
    query FIND_COMPLETED_ORDERS($location: [String!]!, $filter: FilterOrderInput!) {
    findOrders(locations: $location, filter: $filter) {
      orders{
        id
        customer{
          name
          email
          phone
        }
        items{
          name
          quantity
          variation_name
          modifiers{
            name
      	  }
          total_money{
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
        fulfillment{
          pickupDetails{
            pickupAt
          }
        }
    }
  }
}
`
function ClosedOrderDashboard() {
  const vendorId = ["FMXAFFWJR95WC"]
  const filter = {"fulfillment_filter": {"fulfillment_states": "COMPLETED"}}
  const {data, loading, error} = useQuery(GET_COMPLETED_ORDERS, { variables: { location: vendorId, filter: filter } })
  if (error) return <p>Error!</p>
  if (loading) return <p>Waiting...</p>
  if (!data) return <p> No closed orders </p>
  console.log(data)

  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: "middle", marginBottom: "2px", } }}
    >
      <DashboardWrapper>
        <TitleWrapper>Closed Orders</TitleWrapper>
        <MakeClosedDashboardLabels />
        <ClosedOrdersSpaceWrapper>
          {data.findOrders.orders.map((order) => 
          <MakeIndividualClosedOrder
            customerName={order.customer.name}
            orderTime="October 5th at 6:45PM"
            orderStatus="Completed"
            paymentMethod="Membership"
            price={`$${order.total.amount / 100}`}
            phoneNumber={order.customer.phone}
            email={order.customer.email}
            pickupTime={order.fulfillment.pickupDetails.pickupAt}
            items={order.items}
          />)}
          <MakeIndividualClosedOrder customerName="Sally"/>
        
        </ClosedOrdersSpaceWrapper>
      </DashboardWrapper>
    </IconContext.Provider>
  );
}

export default ClosedOrderDashboard;
