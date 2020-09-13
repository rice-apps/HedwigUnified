
import React, { Component, useState } from "react";
import Thumb from "./Thumb.js";
import logo from "../../../images/headphones.jpg";
import dispatch from "../Products/FunctionalCart";
import {cartItems} from '../../../apollo';

// import Dropdown from "react-dropdown";
// import "react-dropdown/style.css";

const QuantitySelector = ({ quantity, decrease, increase }) => {
  return (

    <div className="shelf-item__quantity">

      <button onClick={decrease} disabled={quantity === 1}>
        &ndash;
      </button>
      <p>{quantity}</p>
      <button onClick={increase}>+</button>
    </div>

  );
};

const CartProduct = ({ product, deleteItem }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity);
  const handleMouseOver = () => {
    setIsMouseOver(true);
  };
  const handleMouseOut = () => {
    setIsMouseOver(false);
  };
  const increase = () => {
	setQuantity(quantity + 1);
	
  };

  const decrease = () => {
    setQuantity(quantity - 1);
  };

  function getVarMod() {
	  let VarModList = " ";
	  VarModList += product.variant.name + ", ";
	  
	  for (var i = 0; i < product.modDisplay.length; i++){
		{ i < product.modDisplay.length - 1 ? (VarModList += product.modDisplay[i] + ", "):
	(VarModList += product.modDisplay[i] )}
	  }
	  return VarModList
  }

  function deleteCartItem() {
	dispatch({
		type: 'DELETE_ITEM',
		item:{
			...product
		}
	})
  }

  const date = new Date()

  const options = ["ASAP", "30 Minutes", "1 Hour"];
  const defaultOption = options[0];
  return (
    <div
      className={
        isMouseOver ? "shelf-item shelf-item--mouseover" : "shelf-item"

      }
    >
      {/* <Thumb classes="shelf-item__thumb" src={logo} alt={"Thai Tea"} /> */}
      {/* <DropDownList data={[ "ASAP",, "30 Minutes", "1 Hour", "1.5 Hours", "2 Hours", "3 Hours", "4 Hours"]} defaultValue="ASAP" />  */}


      <div className="shelf-item__title">
        <p id="title">{product.name}</p>
        <p id="options"> {getVarMod()}</p>

      </div>
      <QuantitySelector
        quantity={quantity}
        increase={increase}
        decrease={decrease}

      />
      <div className="shelf-item__price">
        <p>${product.price * quantity}</p>
      </div>
      <div
        className="shelf-item__del"
        onMouseOver={() => handleMouseOver()}
		onMouseOut={() => handleMouseOut()}
		onClick={() => {deleteCartItem() ; console.log(cartItems()); deleteItem(date.getTime())}}
      />
    </div>
	
  );
};


export default CartProduct
