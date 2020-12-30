import { gql, useQuery } from "@apollo/client";
import {
  DashboardWrapper,
  TitleWrapper,
  MakeClosedDashboardLabels,
  ClosedOrdersSpaceWrapper,
  MakeIndividualClosedOrder,
} from "./ClosedDashboardComponents.js";
import { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { MdToday } from "react-icons/md";

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
          variation_name
          modifiers {
            name
          }
          total_money {
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
`;
function ClosedOrderDashboard() {
  const vendorId = ["LBBZPB7F5A100"];
  const today = new Date();
  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  const [filter, setFilter] = useState({
    fulfillment_filter: { fulfillment_states: "COMPLETED" },
  });
  const { data, loading, error } = useQuery(GET_COMPLETED_ORDERS, {
    variables: { location: vendorId, filter: filter },
  });
  if (error) return <p>Error!</p>;
  if (loading) return <p>Waiting...</p>;
  if (!data) return <p> No closed orders </p>;

  const onSelect = (option) => {
    if (option === "All") {
      setFilter({ fulfillment_filter: { fulfillment_states: "COMPLETED" } });
    } else {
      setFilter({
        fulfillment_filter: { fulfillment_states: "COMPLETED" },
        date_time_filter: { closed_at: { start_at: yesterday } },
      });
    }
  };

  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: "middle", marginBottom: "2px" } }}
    >
      <Dropdown
        options={["All", "Today"]}
        onChange={onSelect}
        placeholder="Select an option"
      />
      <DashboardWrapper>
        <TitleWrapper>Closed Orders</TitleWrapper>
        <MakeClosedDashboardLabels />
        <ClosedOrdersSpaceWrapper>
          {data.findOrders.orders.map((order) => (
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
            />
          ))}
          <MakeIndividualClosedOrder customerName="Sally" />
        </ClosedOrdersSpaceWrapper>
      </DashboardWrapper>
    </IconContext.Provider>
  );
}

export default ClosedOrderDashboard;
