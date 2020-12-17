import { css, jsx } from "@emotion/react";
import { Fragment, useEffect, useState } from "react";
import { gql, useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useParams, useHistory } from "react-router";
import { createRecord, CREATE_ORDER, CREATE_PAYMENT, GET_VENDOR } from "./util";
import logo from "../../../images/cohenhouse.png";
import "./cart.scss";
import { centerCenter, row, column, endStart } from "../../../Styles/flex";
import CartProduct from "./CartProducts";
import Payments from "./Payments.js";
import currency from "currency.js";
import { cartItems, orderSummary } from "../../../apollo";
import dispatch from "../Products/FunctionalCart";
import Select from "react-select";
import { TimePicker } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BottomAppBar from "./../Vendors/BottomAppBar.js";
import CartHeader from "./CartHeader";

// new dropdown imports:
import createActivityDetector from "activity-detector";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AiOutlineExclamationCircle } from "react-icons/ai";
// import 'react-dropdown/style.css';

const styles = {
  fontSize: 14,
  color: "blue",
};

import BuyerHeader from "./../Vendors/BuyerHeader.js";

const GET_AVAILABILITIES = gql`
  query GET_AVAILABILITIES($productIds: [String!]) {
    getAvailabilities(productIds: $productIds)
  }
`;

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null,
};

function generatePickupTimes(currHour, currMinute, endHour, endMinute) {
  let pickupTimes = [];
  let pickupMinute = Math.ceil(currMinute / 15) * 15;
  let pickupHour = currHour;
  while (pickupHour <= endHour) {
    while (
      pickupMinute < 45 &&
      !(pickupHour === endHour && pickupMinute >= endMinute)
    ) {
      pickupMinute += 15;
      const strPickupMinute =
        pickupMinute === 0 ? "00" : pickupMinute.toString();
      const strPickupHour =
        pickupHour === 12
          ? "12"
          : (pickupHour - Math.floor(pickupHour / 12) * 12).toString();
      const pickupTime = strPickupHour + ":" + strPickupMinute;
      pickupTimes.push(pickupTime);
    }
    pickupMinute = 0;
    pickupHour += 1;
  }
  const pickupObjs = pickupTimes.map((time) => {
    return { value: time, label: time };
  });
  return pickupObjs;
}

function calculateNextHours(
  currHour,
  currMinute,
  startHours,
  startMinutes,
  endHours,
  endMinutes
) {
  const currTime = currHour + currMinute / 60;
  const endTimes = [];
  for (let i = 0; i < endHours.length; i++) {
    endTimes.push(endHours[i] + endMinutes[i] / 60);
  }
  const startTimes = [];
  for (let i = 0; i < startHours.length; i++) {
    startTimes.push(startHours[i] + startMinutes[i] / 60);
  }
  let idx = 0;
  while (currTime >= startTimes[idx]) {
    idx += 1;
  }
  let timeIntervals = [];
  let newIdx = 0;
  //When restaurant is closed for the day
  if (idx === endTimes.length && currTime >= endTimes[idx - 1]) {
    return [[0, 0, 0, 0]];
  }
  //When restaurant is not open currently for orders, but open later in the day
  else if (
    idx === 0 ||
    (idx > 0 && currTime >= endTimes[idx - 1]) ||
    currTime >= endTimes[idx - 1] - 0.25
  ) {
    timeIntervals.push([
      startHours[idx],
      startMinutes[idx],
      endHours[idx],
      endMinutes[idx],
    ]);
    newIdx = idx + 1;
  }
  //When the restaurant is currently open for orders
  else {
    timeIntervals.push([
      currHour,
      currMinute,
      endHours[idx - 1],
      endMinutes[idx - 1],
    ]);
    newIdx = idx;
  }
  while (newIdx < endTimes.length) {
    timeIntervals.push([
      startHours[newIdx],
      startMinutes[newIdx],
      endHours[newIdx],
      endMinutes[newIdx],
    ]);
    newIdx += 1;
  }
  return timeIntervals;
}

function useIdle(options) {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    const activityDetector = createActivityDetector(options);
    activityDetector.on("idle", () => {
      setIsIdle(true);
    });
    // activityDetector.on('active', ()=>{setIsIdle(false)});
    return () => {
      activityDetector.stop();
    };
  }, []);
  return isIdle;
}

function CartDetail() {
  const [totals, setTotals] = useState(defaultTotals);
  const [pickupTime, setPickupTime] = useState(null);

  // Add payment method picker:
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  // from master:
  const [nullError, setNullError] = useState(checkNullFields());
  // eval to a field string if user's name, student id, or phone number is null
  const { loading, error, data } = useQuery(GET_VENDOR);

  // const options = ["Credit Card", "Tetra", "Cohen House"];
  const options = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Tetra", label: "Tetra" },
    { value: "Cohen House", label: "Cohen House" },
  ];
  // const defaultPaymentOption = options[0];

  const { loading, error, data } = useQuery(GET_VENDOR, {
    variables: { filter: { name: "Cohen House" } },
  });
  const [
    createOrder,
    { loading: order_loading, error: order_error, data: order_data },
  ] = useMutation(CREATE_ORDER);
  const [
    createPayment,
    { loading: payment_loading, error: payment_error, data: payment_data },
  ] = useMutation(CREATE_PAYMENT);

  const navigate = useNavigate();
  const cart_menu = cartItems();

  const isIdle = useIdle({ timeToIdle: 3000, inactivityEvents: [] });

  const product_ids = cart_menu.map((item) => {
    return item.dataSourceId;
  });
  console.log("Product IDs", product_ids);

  const {
    loading: avail_loading,
    error: avail_error,
    data: avail_data,
    refetch: avail_refetch,
  } = useQuery(GET_AVAILABILITIES, {
    variables: { productIds: product_ids },
    fetchPolicy: "network-only",
  });

  /*
  useEffect(() => {
    if(avail_called){
      avail_refetch()
    }
    else {
      getAvailabilities()
    }
  }, [cart_menu])
  */

  const handleConfirmClick = async () => {
    const newRes = await avail_refetch();
    while (newRes.loading) {}
    console.log("errors: ", avail_error);
    console.log("cart_menu:", cart_menu);
    console.log("availability", newRes.data);
    if (newRes.data.getAvailabilities === false) {
      return navigate("/eat/cohen/confirmation");
    } else {
      const q = {
        variables: createRecord(cart_menu),
      };
      const orderResponse = await createOrder(q);
      const orderJson = orderResponse.data.createOrder;
      const createPaymentResponse = await createPayment({
        variables: {
          // new:
          sourceId: "cnon:card-nonce-ok",
          orderId: orderJson.id,
          // new: (locationId is not hardcoded on another branch)
          locationId: "FMXAFFWJR95WC",
          subtotal: totals.subtotal * 100,
          currency: "USD",
        },
      });

      if (paymentMethod === "Credit") {
        // navigate to Almost there page
        console.log("The payment type is credit card.");
      }
      if (paymentMethod === "Cohen House") {
        // get cohen id from order summary
        // navigate to order confirmation page
        console.log("The payment type is through Cohen House.");
      }
      if (paymentMethod === "Tetra") {
        // store student id?
        // navigate to order confirmation page
        console.log("The payment type is through Tetra.");
      }
      orderSummary(
        Object.assign(orderSummary(), {
          orderId: orderJson.id,
          fulfillment: {
            uid: orderJson.fulfillment.uid,
            state: orderJson.fulfillment.state,
          },
        })
      );
      console.log(orderSummary());
      return navigate(`/eat/cohen/payment`);
    }
  };

  const updateTotal = () => {
    const newSubtotal = cart_menu.reduce(
      (total, current) => total + current.price * current.quantity,
      0
    );
    setTotals({
      subtotal: newSubtotal,
      tax: newSubtotal * 0.0825,
    });
  };

  const getTotal = () => {
    const total = cart_menu.reduce((total, current) => {
      return total + current.quantity;
    }, 0);
    return parseInt(total);
  };

  useEffect(() => {
    updateTotal();
  }, [cart_menu]);

  //	This is to make the page re-render so that updated state is shown when item
  //  is deleted.
  const [dummyDelete, setDummyDelete] = useState(0);

  if (loading) return <p>'Loading vendor's business hour ...'</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  if (order_loading) return <p>Loading...</p>;
  if (order_error) {
    return <p>{order_error.message}</p>;
  }
  if (payment_loading) return <p>Loading...</p>;
  if (payment_error) {
    return <p>{payment_error.message}</p>;
  }

  if (avail_loading) return <p>'Loading availabilities...'</p>;
  if (avail_error & (cart_menu.length != 0))
    return <p>`Error! ${avail_error.message}`</p>;

  const currDate = new Date();
  const currDay = currDate.getDay();
  const currHour = currDate.getHours();
  const currMinute = currDate.getMinutes();

  const {
    getVendor: { hours: businessHours },
  } = data;
  const businessHour = businessHours[currDay];

  // const businessHour = {start: '8:30 a.m.', end:'11:00 p.m.'}
  const startHours = businessHour.start.map((startHour) => {
    let hour = startHour.split(":")[0];
    if (startHour.includes("p.m.")) {
      return parseInt(hour) + 12;
    } else {
      return parseInt(hour);
    }
  });
  const endHours = businessHour.end.map((endHour) => {
    let hour = endHour.split(":")[0];
    if (endHour.includes("p.m.")) {
      return parseInt(hour) + 12;
    } else {
      return parseInt(hour);
    }
  });

  const startMinutes = businessHour.start.map((startHour) => {
    return parseInt(startHour.split(":")[1]);
  });
  const endMinutes = businessHour.end.map((endHour) => {
    return parseInt(endHour.split(":")[1]);
  });

  const timeIntervals = calculateNextHours(
    currHour,
    currMinute,
    startHours,
    startMinutes,
    endHours,
    endMinutes
  );
  let pickupTimes = [];
  for (let i = 0; i < timeIntervals.length; i++) {
    const interval = timeIntervals[i];
    pickupTimes = [
      ...pickupTimes,
      ...generatePickupTimes(
        interval[0],
        interval[1],
        interval[2],
        interval[3],
        interval[4]
      ),
    ];
  }

  const disabled = () => false; // uncomment the codde below for prod mode.
  // moment().hour() > endHour1 ||
  // (moment().hour() == endHour1 && moment().minute() >= endMinute1);

  function onChangeDropdown(newPayment) {
    setPaymentMethod(newPayment);
  }

  return (
    <div>
      <CartHeader showBackButton backLink="/eat" />
      <div className={isIdle ? "float-cart__disabled" : "float-cart"}>
        <div className="float-cart__content">
          <div className="float-cart__shelf-container">
            <p className="cart-title" style={{ marginTop: "30px" }}>
              Order Summary:
            </p>
            <div css={[centerCenter, row]}></div>
            {cartItems().map((item) => {
              return (
                <>
                  <CartProduct
                    product={item}
                    forceUpdate={setDummyDelete}
                    updateTotal={updateTotal}
                  />
                </>
              );
            })}
          </div>

          <div className="float-bill">
            {Object.keys(totals).map((type) => {
              if (totals[type]) {
                const formatted = currency(totals[type]).format();
                return (
                  <div className="subtotal-container">
                    <p className="subheader">{type}</p>
                    <p>{formatted}</p>
                  </div>
                );
              }
            })}
            <div className="total-container">
              <hr className="breakline" />
              <div className="total" style={{ marginBottom: "9vh" }}>
                <p className="total__header">Total</p>
                <p>{currency(totals.subtotal + totals.tax).format()}</p>
              </div>
            </div>
          </div>
          <div css={[centerCenter, row]}></div>
          <hr className="breakline" />

          <p className="float-cart__dropdown-title"> Pickup Time:</p>
          <Select
            options={pickupTimes}
            placeholder={"Select a pickup time"}
            onChange={(e) => {
              setPickupTime(e.value);
            }}
            clearable={false}
            style={styles.select}
            className="float-cart__dropdown"
          />
          <div css={[centerCenter, row]}></div>
          <hr className="breakline" />
          <p className="float-cart__dropdown-title">Payment Method:</p>
          <Select
            options={options}
            onChange={onChangeDropdown}
            placeholder={"Select a payment method"}
            clearable={false}
            style={styles.select}
            className="float-cart__dropdown"
          />
          <div>
            <p className="float-cart__payment-message">
              Please enter payment details on the following screen.
            </p>
          </div>

          {nullError != null && (
            <p css={{ alignSelf: "center", color: "red" }}>
              {" "}
              Error! Submission form contains null value for {nullError}. Please
              update your profile.{" "}
            </p>
          )}

          <div className="float-cart__footer">
            <button
              disabled={cartItems().length === 0 || pickupTime === null}
              className="buy-btn"
              title="Confirm"
              onClick={handleConfirmClick}
            >
              Submit Order
              <div />
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isIdle}
        style={{
          content: {
            backgroundColor: "white",
            height: "44vh",
            width: "50vw",
            position: "absolute",
            top: "28%",
            left: "26%",
            borderRadius: "20px",
            fontFamily: "Futura",
            textAlign: "center",
          },
          overlay: {
            zIndex: "10",
          },
        }}
      >
        <AiOutlineExclamationCircle style={{ fontSize: "100px" }} />
        <p style={{ marginLeft: "0px" }}>
          Your session has expired due to inactivity.
        </p>
        <button
          className="modal-btn"
          onClick={() => {
            window.location.reload(false);
          }}
        >
          Refresh Page
        </button>
        <button
          className="modal-btn"
          onClick={() => {
            navigate("/eat");
          }}
        >
          Home Page
        </button>
      </Modal>
    </div>
  );
}

export default CartDetail;
