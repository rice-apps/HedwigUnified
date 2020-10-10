import React from "react";
import {
  DashboardWrapper,
  TitleWrapper,
  MakeClosedDashboardLabels,
  ClosedOrdersSpaceWrapper,
  MakeIndividualClosedOrder
} from "./ClosedDashboardComponents.js";
import { IconContext } from "react-icons";

function ClosedOrderDashboard() {
  return (
    <IconContext.Provider
      value={{ style: { verticalAlign: "middle", marginBottom: "2px", } }}
    >
      <DashboardWrapper>
        <TitleWrapper>Closed Orders</TitleWrapper>
        <MakeClosedDashboardLabels />
        <ClosedOrdersSpaceWrapper>
          <MakeIndividualClosedOrder
            customerName="Allison Smith"
            orderTime="October 6th at 4:45PM"
            orderStatus="Completed"
            paymentMethod="Tetra"
            price="$3.50"
            phoneNumber="(832)-123-7446"
            email="nth8@rice.edu"
            pickupTime="October 6th at 4:50PM"
          />
          <MakeIndividualClosedOrder
            customerName="Rick Gomez"
            orderTime="October 6th at 3:45PM"
            orderStatus="Cancelled"
            paymentMethod="Membership"
            price="$8.50"
            phoneNumber="(713)-123-7446"
            email="asd3@rice.edu"
            pickupTime="October 6th at 4:00PM"
          />
          <MakeIndividualClosedOrder
            customerName="Scott Rixner"
            orderTime="October 5th at 6:45PM"
            orderStatus="Completed"
            paymentMethod="Membership"
            price="$5.50"
            phoneNumber="(281)-134-7126"
            email="rsi23@rice.edu"
            pickupTime="October 5th at 7:00PM"
          />
          
        </ClosedOrdersSpaceWrapper>
      </DashboardWrapper>
    </IconContext.Provider>
  );
}

export default ClosedOrderDashboard;
