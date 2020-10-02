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
} from "./DashboardComponents.js";
import OrderCard from "./OrderCard.js";

const ColumnWrapper = styled.div`
  display: flex;
  position: absolute;
  flex-direction: column;
  overflow: scroll;
  padding-right: 30px;
  height: 100%;
`;

var OrderDummy = [
  {
    name: "Thai tea",
    quantity: "1",
    variation_name: "medium",
    modifiers: null,
    total_money: { amount: 350 },
    total_tax: null
  },
  {
    name: "Milk tea",
    quantity: "Large",
    variation_name: "medium",
    modifiers: null,
    total_money: { amount: 350 },
    total_tax: null
  }
];

function OrderDashboard() {
  return (
    <OrderDashboardWrapper>
      <NewOrderTitleWrapper>
        <MakeDashboardTitle name="New" quantity="2" />
      </NewOrderTitleWrapper>
      <NewOrderSpaceWrapper></NewOrderSpaceWrapper>

      <AcceptedOrderTitleWrapper>
        <MakeDashboardTitle name="Accepted" quantity="5" />
      </AcceptedOrderTitleWrapper>
      <AcceptedOrderSpaceWrapper>
        <OrderCard orderTax="2.50" orderTotal="25.00" />
        <OrderCard />
        <OrderCard />
      </AcceptedOrderSpaceWrapper>

      <ReadyOrderTitleWrapper>
        <MakeDashboardTitle name="Ready" quantity="7" />
      </ReadyOrderTitleWrapper>
      <ReadyOrderSpaceWrapper></ReadyOrderSpaceWrapper>
    </OrderDashboardWrapper>
  );
}

export default OrderDashboard;
