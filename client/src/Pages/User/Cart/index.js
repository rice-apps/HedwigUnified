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
import Dropdown from "react-dropdown";
// import 'react-dropdown/style.css';

const styles = {
  fontSize: 14,
  color: "blue",
};

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null,
};

function generatePickupTimes(currHour, currMinute, endHour, endMinute){
  console.log(currHour, currMinute, endHour, endMinute)
  let pickupTimes = []
  let pickupMinute = Math.ceil(currMinute/15)*15
  let pickupHour = currHour;
  while(pickupHour <= endHour){
    while(pickupMinute<45 && !(pickupHour === endHour && pickupMinute >= endMinute)){
      pickupMinute += 15
      const strPickupMinute = (pickupMinute===0 ? "00" : pickupMinute.toString())
      const strPickupHour = pickupHour===12 ? "12" : (pickupHour-Math.floor(pickupHour/12)*12).toString()
      const pickupTime = strPickupHour+":"+strPickupMinute
      pickupTimes.push(pickupTime)
    }
    pickupMinute = 0
    pickupHour += 1
  }
  const pickupObjs = pickupTimes.map(time => {
    return {value: time, label: time}
  })
  return pickupObjs
}

function calculateNextHours(currHour, currMinute, startHours, startMinutes, endHours, endMinutes){
  const currTime = currHour+currMinute/60
  const endTimes = []
  for(let i=0; i<endHours.length; i++){
    endTimes.push(endHours[i]+endMinutes[i]/60)
  }
  const startTimes = []
  for(let i=0; i<startHours.length; i++){
    startTimes.push(startHours[i]+startMinutes[i]/60)
  }
  let idx=0
  while(currTime >= startTimes[idx]){
    idx+=1
  }
  let timeIntervals = []
  let newIdx = 0
  //When restaurant is closed for the day
  if(idx===endTimes.length && currTime >= endTimes[idx-1]){
    return [[0, 0, 0, 0]]
  }
  //When restaurant is not open currently for orders, but open later in the day
  else if(idx===0 || (idx > 0 && currTime >= endTimes[idx-1]) || (currTime >= endTimes[idx-1]-0.25)){
    timeIntervals.push([startHours[idx], startMinutes[idx], endHours[idx], endMinutes[idx]])
    newIdx = idx+1
  }
  //When the restaurant is currently open for orders
  else{
    timeIntervals.push([currHour, currMinute, endHours[idx-1], endMinutes[idx-1]])
    newIdx=idx
  }
  while(newIdx<endTimes.length){
    timeIntervals.push([startHours[newIdx], startMinutes[newIdx], endHours[newIdx], endMinutes[newIdx]])
    newIdx+=1
  }
  return timeIntervals
}

function CartDetail() {
  const [totals, setTotals] = useState(defaultTotals);
  const [pickupTime, setPickupTime] = useState(null);

  // Add payment method picker:
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
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

  const handleConfirmClick = async () => {
    const q = {
      variables: createRecord(cart_menu),
    };
    const orderResponse = await createOrder(q);
    const orderJson = orderResponse.data.createOrder;
    const createPaymentResponse = await createPayment({
      variables: {
        orderId: orderJson.id,
        subtotal: totals.subtotal * 100,
        currency: "USD",
      },
    });

    return navigate("/eat/cohen/payment");
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

  const currDate = new Date()
  const currDay = currDate.getDay()
  const currHour = currDate.getHours()
  const currMinute = currDate.getMinutes()
  const {
    getVendor: { hours: businessHours },
  } = data;
  const businessHour = businessHours[currDay];
  console.log(businessHour);

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

  const timeIntervals = calculateNextHours(currHour, currMinute, startHours, startMinutes, endHours, endMinutes)
  let pickupTimes = []
  for(let i=0; i<timeIntervals.length; i++){
    const interval = timeIntervals[i]
    pickupTimes = [...pickupTimes, ...generatePickupTimes(interval[0], interval[1], interval[2], interval[3], interval[4])]
  }
  console.log(pickupTimes)

  const disabled = () => false; // uncomment the codde below for prod mode.
  // moment().hour() > endHour1 ||
  // (moment().hour() == endHour1 && moment().minute() >= endMinute1);

  // const onChangeDropdown = (e) => {
  //   setPaymentMethod(e.value);
  //   console.log("payment method: ", paymentMethod);
  // };
  function onChangeDropdown(newPayment) {
    setPaymentMethod(newPayment);
    console.log("payment method: ", paymentMethod);
  }

  return (
    <div>
      <CartHeader showBackButton backLink="/eat" />
      <div className="float-cart">
        <div className="float-cart__content">
          <div className="float-cart__shelf-container">
            <p className="cart-title" style={{ marginTop: "30px" }}>
              Order Summary:
            </p>
            <div css={[centerCenter, row]}></div>
            <hr className="breakline" />
            {cartItems().map((item) => {
              return (
                <>
                  <CartProduct
                    product={item}
                    forceUpdate={setDummyDelete}
                    updateTotal={updateTotal}
                  />
                  <hr className="breakline" />
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

          <p css={{ alignSelf: "center", marginTop: "10px" }}> Pickup Time:</p>
          <Select
            options={pickupTimes}
            placeholder={"Select a pickup time"}
            onChange={onChangeDropdown}
            clearable={false}
            style={styles.select}
          />
          <div css={[centerCenter, row]}></div>
          <hr className="breakline" />
          <div style={{ position: "relative", float: "left" }}>
            <div>
              <p css={{ marginTop: "10px" }}>Payment Method:</p>
            </div>
            <div>
              {/* <Dropdown
                options={options}
                onChange={(e) => onChangeDropdown(e)}
                value={paymentMethod}
                placeholder="Select a Payment method"
                style={{ color: "red" }}
              /> */}
              <Select
                options={options}
                // onChange={(e) => onChangeDropdown(e)}
                onChange={onChangeDropdown}
                placeholder={"Select a payment method"}
                clearable={false}
                style={styles.select}
              />
            </div>
          </div>
          <div>
            <p>Please enter payment details on the following screen.</p>
          </div>

          <div className="float-cart__footer">
            <button
              disabled={cartItems().length == 0 || pickupTime == null}
              className="buy-btn"
              title="Confirm"
              onClick={handleConfirmClick}
            >
              Next: Payment
              <div />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartDetail;
