import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useHistory, useLocation } from "react-router";
import "/Users/Ananya/HedwigUnified/client/src/Pages/User/Confirmation/confirmation.css";
// import '../../fonts/style.css'
// fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { ReactComponent as FailureSVG } from "/Users/Ananya/HedwigUnified/client/src/Pages/User/Confirmation/alert-circle.svg";
import { ReactComponent as ConfirmationSVG } from "/Users/Ananya/HedwigUnified/client/src/Pages/User/Confirmation/check-circle.svg";
import { cartItems } from "../../../apollo";

const OrderSubmitted = ({ classes }) => {
  // const { data, loading, error } = useQuery(GET_VENDORS_QUERY)
  return (
    <div className="mainDiv">
      <ConfirmationSVG className="checkSvg" />
      <div>
        <p className="orderConfirmed">Order Confirmed!</p>
        <p className="statusUpdate">
          You will receive order status updates via <strong>text.</strong>
        </p>
      </div>
      {/* <div className="vendorCard">
          <FontAwesomeIcon icon={faMapPin} className="pinIcon" />
          <p className="vendorHeader">{"Cohen House"}</p>
          <p className="vendorHeader">Pick Up Instruction:</p>
          <p className="pickupInstructions">{"hi"}</p>
        </div> */}
    </div>
  );
};
export default OrderSubmitted;
