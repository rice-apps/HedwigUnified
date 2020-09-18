/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import React, { useEffect, useState } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useParams, useHistory } from "react-router";
import logo from "../../../images/tealogo.png";
import "./cart.scss";
import { centerCenter, row, column } from "../../../Styles/flex";
import CartProduct from "./CartProducts";
import currency from "currency.js";
import { cartItems } from "../../../apollo";
import dispatch from "../Products/FunctionalCart";
import Select from 'react-select';
//import makeAnimated from 'react-select/animated';
//import moment from 'moment';

let cart_menu =

  cartItems();

const pickupTimes = [
  { value: 'ASAP', label: 'ASAP'},
  { value: '30 min.', label: '30 minutes'},
  { value: '1 hr.', label: '1 hour'},
  { value: '1 hr 30 min.', label: '1 hour 30 minutes'},
]

const defaultTotals = {
  subtotal: 0,
  tax: 0,
  discount: null

};

const CartDetail = ({}) => {
  const [totals, setTotals] = useState(defaultTotals);

  const [pickupTime, setPickupTime] = useState({});

  const handleConfirmClick = () => {
    // Submit order
  };

  useEffect(() => {
    let newSubtotal = cart_menu.reduce(
      (total, current) => total + current.price,
      0
    );
    setTotals({
      subtotal: newSubtotal,
      tax: newSubtotal * 0.05
    });
  }, [cart_menu]);

  const total = currency(
    Object.values(totals).reduce((total, current) => total + current, 0)
  );
//	This is to make the page re-render so that updated state is shown when item 
//  is deleted.
	const [dummyDelete, setDummyDelete] = useState(0);
	cartItems().map (item => console.log(item))

  console.log(cartItems());
  return (
    <div className="float-cart">
      <div className="float-cart__content">
        <div className="float-cart__shelf-container">
          <div css={[centerCenter, row]}>
            <img src={logo} className="logo" alt="Logo" />
            <div>
              <p css={{ margin: "16px 0 0 10px" }}>East West Tea</p>
              <p css={{ margin: "0 0 0 10px", color: "grey" }}>Houston, TX</p>
              
            </div>
          </div>
          <p css= {{alignSelf: 'center'}}> Pickup Time:</p>
          <Select
            options={pickupTimes}
            css= {{marginTop: "-10px", width: '200px', alignSelf: 'center',}}
            onChange={setPickupTime}
          />
			{cartItems().map(item => {
				return <CartProduct product={item} deleteItem={setDummyDelete}/>
			})}
          
        </div>

        <div className="float-bill">
          <h1 className="header">Bill Details</h1>
          {Object.keys(totals).map(type => {
            console.log(totals[type]);
            if (totals[type]) {
              let formatted = currency(totals[type]).format();
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
            <div className="total">
              <p className="total__header">Total</p>
              <p>{total.format()}</p>
            </div>
            <hr className="breakline" />
          </div>
        </div>

        <div className="float-cart__footer">
          <div

            className="buy-btn"
            title={"Confirm"}
            onClick={handleConfirmClick}
          >
            Make Payment
          </div>
        </div>
      </div>
    </div>

  );
};


export default CartDetail
